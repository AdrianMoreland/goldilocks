"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRoadmap = exports.writeRoadmapFile = exports.readRoadmapFile = void 0;
exports.roadmapFilePath = roadmapFilePath;
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
//# sourceMappingURL=roadmap-file.js.map