import { diffRoadmap } from './roadmap-file';

describe('diffRoadmap', () => {
    it('finds nothing when only line endings and the trailing newline differ', () => {
        const diff = diffRoadmap('# A\r\n- [ ] x\r\n', '# A\n- [ ] x');
        expect(diff).toEqual({ added: 0, removed: 0, lines: [] });
    });

    it('reports a ticked box as one removed and one added line, with context', () => {
        const diff = diffRoadmap(
            '# A\n- [ ] x\n- [ ] y\n- [ ] z\n- [ ] w',
            '# A\n- [x] x\n- [ ] y\n- [ ] z\n- [ ] w',
        );
        expect(diff.added).toBe(1);
        expect(diff.removed).toBe(1);
        expect(diff.lines).toEqual([
            '  # A',
            '- - [ ] x',
            '+ - [x] x',
            '  - [ ] y',
            '  …',
        ]);
    });

    it('reports added and deleted lines', () => {
        const diff = diffRoadmap('a\nb\nc', 'a\nc\nd');
        expect(diff.removed).toBe(1);
        expect(diff.added).toBe(1);
        expect(diff.lines).toContain('- b');
        expect(diff.lines).toContain('+ d');
    });
});
