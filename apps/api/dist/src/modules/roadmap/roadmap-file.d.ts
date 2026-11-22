export declare function roadmapFilePath(): string | null;
export declare const readRoadmapFile: (path: string) => string;
export declare const writeRoadmapFile: (path: string, markdown: string) => void;
export declare const normalizeRoadmap: (markdown: string) => string;
export interface RoadmapDiff {
    added: number;
    removed: number;
    lines: string[];
}
export declare function diffRoadmap(from: string, to: string): RoadmapDiff;
//# sourceMappingURL=roadmap-file.d.ts.map