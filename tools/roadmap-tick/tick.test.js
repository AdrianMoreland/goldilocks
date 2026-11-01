'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { parseRefs, applyTicks } = require('./tick.js');

const md = `# T

## 1.1 First 🟠

- [ ] Alpha thing
  - [ ] **Beta** child
- [x] Done thing

## 1.2 Second

- [ ] Alpha thing
- [ ] Gamma one
- [ ] Gamma two

# PHASE 2
`;

test('parses only well-formed lines', () => {
    const r = parseRefs('x\nRoadmap: 1.1 | alpha\nroadmap: 1.2\nRoadmap: none\n');
    assert.deepStrictEqual(r, [{ id: '1.1', text: 'alpha' }, { id: '1.2', text: '' }]);
});

test('ticks a unique match, nested, ignoring markdown marks', () => {
    const r = applyTicks(md, [{ id: '1.1', text: 'beta child' }]);
    assert.match(r.markdown, /  - \[x\] \*\*Beta\*\* child/);
    assert.deepStrictEqual(r.ticked, ['1.1 | beta child']);
});

test('only searches inside the named section', () => {
    const r = applyTicks(md, [{ id: '1.2', text: 'alpha' }]);
    assert.match(r.markdown, /## 1\.1[\s\S]*- \[ \] Alpha thing[\s\S]*## 1\.2[\s\S]*- \[x\] Alpha thing/);
});

test('ambiguous, missing, already ticked and bare IDs change nothing', () => {
    const r = applyTicks(md, [
        { id: '1.2', text: 'gamma' }, { id: '1.2', text: 'nope' },
        { id: '1.1', text: 'done thing' }, { id: '9.9', text: 'x' }, { id: '1.1', text: '' },
    ]);
    assert.strictEqual(r.markdown, md);
    assert.strictEqual(r.skipped.length, 5);
});

test('keeps CRLF line endings', () => {
    const r = applyTicks(md.replace(/\n/g, '\r\n'), [{ id: '1.2', text: 'gamma one' }]);
    assert.ok(r.markdown.includes('\r\n') && r.markdown.includes('[x] Gamma one'));
});
