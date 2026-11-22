"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRoadmap = exports.writeRoadmapFile = exports.readRoadmapFile = void 0;
exports.roadmapFilePath = roadmapFilePath;
exports.diffRoadmap = diffRoadmap;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
function roadmapFilePath() {
    const candidates = [
        process.env.ROADMAP_FILE,
        (0, node_path_1.join)(process.cwd(), 'docs/ROADMAP.md'),
        (0, node_path_1.join)(process.cwd(), '../../docs/ROADMAP.md'),
    ].filter((p) => !!p);
    const found = candidates.map((p) => (0, node_path_1.resolve)(p)).find((p) => (0, node_fs_1.existsSync)(p));
    return found ?? null;
}
const readRoadmapFile = (path) => (0, node_fs_1.readFileSync)(path, 'utf8');
exports.readRoadmapFile = readRoadmapFile;
const writeRoadmapFile = (path, markdown) => (0, node_fs_1.writeFileSync)(path, markdown, 'utf8');
exports.writeRoadmapFile = writeRoadmapFile;
const normalizeRoadmap = (markdown) => markdown.replace(/\r\n/g, '\n').replace(/\s+$/, '');
exports.normalizeRoadmap = normalizeRoadmap;
function diffRoadmap(from, to) {
    const a = (0, exports.normalizeRoadmap)(from).split('\n');
    const b = (0, exports.normalizeRoadmap)(to).split('\n');
    const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            lcs[i][j] =
                a[i] === b[j]
                    ? lcs[i + 1][j + 1] + 1
                    : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
    }
    const ops = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) {
            ops.push({ kind: ' ', text: a[i], line: i + 1 });
            i++;
            j++;
        }
        else if (j < b.length &&
            (i === a.length || lcs[i][j + 1] > lcs[i + 1][j])) {
            ops.push({ kind: '+', text: b[j], line: i + 1 });
            j++;
        }
        else {
            ops.push({ kind: '-', text: a[i], line: i + 1 });
            i++;
        }
    }
    const changed = ops.map((op) => op.kind !== ' ');
    const show = ops.map((_, k) => changed[k] || changed[k - 1] || changed[k + 1]);
    const lines = [];
    ops.forEach((op, k) => {
        if (!show[k]) {
            if (show[k - 1])
                lines.push('  …');
            return;
        }
        lines.push(`${op.kind} ${op.text}`);
    });
    return {
        added: ops.filter((op) => op.kind === '+').length,
        removed: ops.filter((op) => op.kind === '-').length,
        lines,
    };
}
//# sourceMappingURL=roadmap-file.js.map