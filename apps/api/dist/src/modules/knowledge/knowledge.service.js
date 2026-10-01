"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var KnowledgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
function contentHash(raw) {
    return (0, node_crypto_1.createHash)('sha256')
        .update(raw.replace(/\r\n/g, '\n'))
        .digest('hex');
}
function toDay(date) {
    return date.toISOString().slice(0, 10);
}
function toDocument(row) {
    return {
        slug: row.slug,
        title: row.title,
        category: row.category,
        jurisdiction: row.jurisdiction,
        owner: row.owner,
        status: row.status,
        version: row.version,
        contentUpdatedOn: toDay(row.contentUpdatedOn),
        markdown: row.markdown,
    };
}
function todayUtc() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
let KnowledgeService = KnowledgeService_1 = class KnowledgeService {
    prisma;
    logger = new common_1.Logger(KnowledgeService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listDocuments(isAdmin) {
        const rows = await this.prisma.kbDocument.findMany({
            where: isAdmin ? undefined : { status: { not: 'retired' } },
            orderBy: { slug: 'asc' },
        });
        return rows.map(toDocument);
    }
    async listApproved() {
        const rows = await this.prisma.kbDocument.findMany({
            where: { status: 'approved' },
            orderBy: { slug: 'asc' },
        });
        return rows.map(toDocument);
    }
    async updateDocument(slug, dto, actor) {
        const existing = await this.requireDocument(slug);
        const markdown = dto.markdown.trim();
        if ((0, shared_types_1.splitFrontmatter)(markdown)) {
            throw new common_1.BadRequestException('Remove the --- block at the top: title and owner have their own fields.');
        }
        const others = await this.prisma.kbDocument.findMany({
            where: { slug: { not: slug } },
            select: { slug: true, markdown: true },
        });
        const universe = [
            {
                slug,
                sections: (0, shared_types_1.splitSections)(markdown),
                links: (0, shared_types_1.findLinks)(markdown),
            },
            ...others.map((row) => ({
                slug: row.slug,
                sections: (0, shared_types_1.splitSections)(row.markdown),
                links: (0, shared_types_1.findLinks)(row.markdown),
            })),
        ];
        const brokenSections = (0, shared_types_1.findBrokenLinks)(universe).filter((link) => link.reason === 'missing-section');
        if (brokenSections.length > 0) {
            throw new common_1.BadRequestException(brokenSections.map((link) => `"${link.from}" links to [[${link.slug}#${link.anchor}]], a section that doesn't exist.`));
        }
        const contentChanged = markdown !== existing.markdown.trim() ||
            dto.title !== existing.title;
        if (!contentChanged && dto.owner === existing.owner) {
            return toDocument(existing);
        }
        const status = existing.status === 'approved' && contentChanged
            ? 'draft'
            : existing.status;
        const updated = await this.prisma.kbDocument.update({
            where: { slug },
            data: {
                title: dto.title,
                owner: dto.owner,
                markdown,
                status,
                editedInApp: contentChanged || existing.editedInApp,
                contentHash: contentChanged
                    ? `app:${contentHash(markdown)}`
                    : existing.contentHash,
            },
        });
        this.logger.log(`[audit] ${actor} edited SOP "${slug}"${status !== existing.status ? ` (approved → ${status})` : ''}`);
        return toDocument(updated);
    }
    async setStatus(slug, next, actor) {
        const existing = await this.requireDocument(slug);
        if (existing.status === next)
            return toDocument(existing);
        if (next === 'approved') {
            if (existing.status === 'retired') {
                throw new common_1.BadRequestException('Return a retired SOP to draft before approving it.');
            }
            const open = (0, shared_types_1.splitSections)(existing.markdown).filter((section) => section.hasTodo);
            if (open.length > 0) {
                throw new common_1.BadRequestException(`Can't approve "${existing.title}": ${open.length} ${open.length === 1 ? 'section still contains' : 'sections still contain'} a [TODO] (${open.map((s) => s.heading || 'introduction').join(', ')}). Resolve them first.`);
            }
            if (/^todo$/i.test(existing.owner.trim())) {
                throw new common_1.BadRequestException(`Can't approve "${existing.title}": it has no owner yet.`);
            }
        }
        const updated = await this.prisma.kbDocument.update({
            where: { slug },
            data: next === 'approved'
                ? {
                    status: next,
                    version: existing.version + 1,
                    contentUpdatedOn: todayUtc(),
                }
                : { status: next },
        });
        this.logger.log(`[audit] ${actor} moved SOP "${slug}" ${existing.status} → ${next}`);
        return toDocument(updated);
    }
    async requireDocument(slug) {
        const row = await this.prisma.kbDocument.findUnique({
            where: { slug },
        });
        if (!row)
            throw new common_1.NotFoundException(`SOP "${slug}" not found.`);
        return row;
    }
    async importDocuments(files, options = {}) {
        const results = [];
        const parsed = [];
        for (const file of files) {
            const result = (0, shared_types_1.parseKbDocument)(file.raw);
            if (!result.ok) {
                results.push({
                    file: file.name,
                    slug: null,
                    action: 'rejected',
                    errors: result.errors,
                });
            }
            else {
                parsed.push({ file, doc: result.doc });
            }
        }
        const bySlug = new Map();
        for (const { file, doc } of parsed) {
            const slug = doc.frontmatter.slug;
            const first = bySlug.get(slug);
            if (first) {
                results.push({
                    file: file.name,
                    slug,
                    action: 'rejected',
                    errors: [
                        `Duplicate slug "${slug}" — already used by ${first}.`,
                    ],
                });
            }
            else {
                bySlug.set(slug, file.name);
            }
        }
        const unique = parsed.filter(({ file, doc }) => bySlug.get(doc.frontmatter.slug) === file.name);
        const stored = await this.prisma.kbDocument.findMany({
            select: {
                slug: true,
                markdown: true,
                version: true,
                contentHash: true,
                editedInApp: true,
            },
        });
        const incomingSlugs = new Set(unique.map(({ doc }) => doc.frontmatter.slug));
        const linkUniverse = [
            ...unique.map(({ doc }) => ({
                slug: doc.frontmatter.slug,
                sections: doc.sections,
                links: doc.links,
            })),
            ...stored
                .filter((row) => !incomingSlugs.has(row.slug))
                .map((row) => ({
                slug: row.slug,
                sections: (0, shared_types_1.splitSections)(row.markdown),
                links: (0, shared_types_1.findLinks)(row.markdown),
            })),
        ];
        const broken = (0, shared_types_1.findBrokenLinks)(linkUniverse).filter((link) => incomingSlugs.has(link.from));
        const blocking = broken.filter((link) => link.reason === 'missing-section' ||
            !options.allowUnresolvedLinks);
        const unresolvedLinks = broken.filter((link) => !blocking.includes(link));
        for (const link of blocking) {
            const target = link.anchor
                ? `${link.slug}#${link.anchor}`
                : link.slug;
            const message = link.reason === 'missing-section'
                ? `Link [[${target}]] points at a section that doesn't exist.`
                : `Link [[${target}]] points at a SOP that doesn't exist.`;
            const owner = unique.find(({ doc }) => doc.frontmatter.slug === link.from);
            const fileName = owner?.file.name ?? link.from;
            const existing = results.find((r) => r.file === fileName && r.action === 'rejected');
            if (!existing) {
                results.push({
                    file: fileName,
                    slug: link.from,
                    action: 'rejected',
                    errors: [message],
                });
            }
            else if (!existing.errors.includes(message)) {
                existing.errors.push(message);
            }
        }
        const storedBySlug = new Map(stored.map((row) => [row.slug, row]));
        const writes = [];
        for (const { file, doc } of unique) {
            const { frontmatter, body } = doc;
            if (results.some((r) => r.file === file.name && r.action === 'rejected'))
                continue;
            const hash = contentHash(file.raw);
            const existing = storedBySlug.get(frontmatter.slug);
            if (existing && existing.contentHash === hash) {
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'unchanged',
                    errors: [],
                });
                continue;
            }
            if (existing?.editedInApp && !options.force) {
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'skipped',
                    errors: [
                        'Edited in the app, so the file was left alone (importing would overwrite those edits). Use force to overwrite.',
                    ],
                });
                continue;
            }
            if (existing &&
                existing.version > frontmatter.version &&
                !options.force) {
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'rejected',
                    errors: [
                        `Stored version is ${existing.version} but the file is version ${frontmatter.version}. Use force to overwrite.`,
                    ],
                });
                continue;
            }
            const data = {
                title: frontmatter.title,
                category: frontmatter.category,
                jurisdiction: frontmatter.jurisdiction,
                owner: frontmatter.owner,
                status: frontmatter.status,
                version: frontmatter.version,
                contentUpdatedOn: new Date(`${frontmatter.updatedAt}T00:00:00.000Z`),
                markdown: body,
                contentHash: hash,
                editedInApp: false,
            };
            const action = existing ? 'updated' : 'created';
            results.push({
                file: file.name,
                slug: frontmatter.slug,
                action,
                errors: [],
            });
            writes.push({
                slug: frontmatter.slug,
                action,
                run: () => this.prisma.kbDocument.upsert({
                    where: { slug: frontmatter.slug },
                    create: { slug: frontmatter.slug, ...data },
                    update: data,
                }),
            });
        }
        const hasErrors = results.some((r) => r.action === 'rejected');
        if (hasErrors || options.dryRun) {
            return {
                results: this.inFileOrder(files, results),
                unresolvedLinks,
                applied: false,
            };
        }
        if (writes.length > 0) {
            await this.prisma.$transaction(writes.map((write) => write.run()));
            this.logger.log(`Knowledge Center import: ${writes.length} SOP(s) written`);
        }
        return {
            results: this.inFileOrder(files, results),
            unresolvedLinks,
            applied: true,
        };
    }
    inFileOrder(files, results) {
        const order = new Map(files.map((file, index) => [file.name, index]));
        return [...results].sort((a, b) => (order.get(a.file) ?? 0) - (order.get(b.file) ?? 0));
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = KnowledgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KnowledgeService);
//# sourceMappingURL=knowledge.service.js.map