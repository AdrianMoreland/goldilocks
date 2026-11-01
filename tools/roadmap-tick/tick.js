#!/usr/bin/env node
'use strict';
// Ticks roadmap tasks named in a merged PR body. Plain Node, no dependencies.
//
//   node tools/roadmap-tick/tick.js docs/ROADMAP.md pr-body.txt
//
// The PR body names each finished task on its own line:
//   Roadmap: 1.12 | stocktake carry-forward
// "1.12" is the section ID (the "## 1.12 ..." heading); the text after "|" must appear in exactly one
// unticked task line inside that section (case-insensitive, markdown marks ignored). Anything that does
// not match exactly once is reported and left alone. Only "- [ ]" becomes "- [x]"; nothing else changes.
// "Roadmap: none" and bare "Roadmap: 1.12" (no task text) tick nothing.
const fs = require('node:fs');

const norm = (s) => s.toLowerCase().replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();

function parseRefs(body) {
    const refs = [];
    for (const line of body.replace(/\r\n/g, '\n').split('\n')) {
        const m = /^\s*roadmap:\s*(\d+\.\d+)\s*\|\s*(.+?)\s*$/i.exec(line);
        if (m) refs.push({ id: m[1], text: m[2] });
        else if (/^\s*roadmap:\s*\d+\.\d+\s*$/i.test(line)) {
            refs.push({ id: line.match(/(\d+\.\d+)/)[1], text: '' });
        }
    }
    return refs;
}

function sectionRange(lines, id) {
    const re = new RegExp(`^## ${id.replace('.', '\\.')}(\\s|$)`);
    const start = lines.findIndex((l) => re.test(l));
    if (start < 0) return null;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
        if (/^#{1,2} /.test(lines[i])) { end = i; break; }
    }
    return [start + 1, end];
}

/** Returns { markdown, ticked: [...], skipped: [...] }. */
function applyTicks(markdown, refs) {
    const nl = markdown.includes('\r\n') ? '\r\n' : '\n';
    const lines = markdown.split(/\r?\n/);
    const ticked = [];
    const skipped = [];
    for (const { id, text } of refs) {
        if (!text) { skipped.push(`${id}: no task text after "|", nothing ticked`); continue; }
        const range = sectionRange(lines, id);
        if (!range) { skipped.push(`${id} | ${text}: section not found`); continue; }
        const want = norm(text);
        const open = [];
        const done = [];
        for (let i = range[0]; i < range[1]; i++) {
            const m = /^(\s*[-*] )\[( |x|X)\] (.*)$/.exec(lines[i]);
            if (!m || !norm(m[3]).includes(want)) continue;
            (m[2] === ' ' ? open : done).push(i);
        }
        if (open.length === 1) {
            lines[open[0]] = lines[open[0]].replace('[ ]', '[x]');
            ticked.push(`${id} | ${text}`);
        } else if (open.length > 1) {
            skipped.push(`${id} | ${text}: matches ${open.length} open tasks, be more specific`);
        } else if (done.length) {
            skipped.push(`${id} | ${text}: already ticked`);
        } else {
            skipped.push(`${id} | ${text}: no matching task`);
        }
    }
    return { markdown: lines.join(nl), ticked, skipped };
}

module.exports = { parseRefs, applyTicks };

if (require.main === module) {
    const [file, bodyFile] = process.argv.slice(2);
    if (!file || !bodyFile) { console.error('usage: tick.js ROADMAP.md pr-body.txt'); process.exit(2); }
    const refs = parseRefs(fs.readFileSync(bodyFile, 'utf8'));
    const { markdown, ticked, skipped } = applyTicks(fs.readFileSync(file, 'utf8'), refs);
    if (ticked.length) fs.writeFileSync(file, markdown);
    for (const t of ticked) console.log(`TICKED ${t}`);
    for (const s of skipped) console.log(`SKIPPED ${s}`);
    if (!refs.length) console.log('No Roadmap: lines in the PR body.');
}
