/**
 * Plugin entry: shows the panel and runs what it asks for. The panel lists the catalogue (see catalogue.mjs)
 * for importing, and has two more tabs: Compose (build a design from a spec) and Export (selection or library
 * as JSON). Each request opens a session: variables and styles are brought up to date, the target page is
 * chosen, and existing library components are found so layouts and compositions can place instances of them.
 */

const SETTINGS_KEY = 'merrion-plugin-settings';
const DEFAULT_SETTINGS = { mode: 'light', page: 'design', replace: true };
const PAGE_NAME = 'Design system';

figma.showUI(__html__, { width: 440, height: 720, themeColors: true });

const send = (message) => figma.ui.postMessage(message);

async function sendInit() {
    let saved;
    try {
        saved = await figma.clientStorage.getAsync(SETTINGS_KEY);
    } catch (error) {
        console.error('Could not read saved settings', error);
    }
    send({ type: 'init', name: DATA.name, groups: GROUPS, catalogue: CATALOGUE, settings: { ...DEFAULT_SETTINGS, ...(saved ?? {}) } });
}

async function getPage(settings) {
    if (settings.page === 'current') return { page: figma.currentPage, note: null };
    let page = figma.root.children.find((p) => p.name === PAGE_NAME);
    if (!page) {
        try {
            page = figma.createPage();
            page.name = PAGE_NAME;
        } catch {
            return { page: figma.currentPage, note: `Could not add a "${PAGE_NAME}" page (page limit?), so everything went on the current page.` };
        }
    }
    await figma.setCurrentPageAsync(page);
    return { page, note: null };
}

let busy = false;

/** Opens a session: fresh context, foundation up to date, page chosen, existing masters found. */
async function startSession(settings) {
    CTX = { settings, mode: settings.mode === 'dark' ? 'dark' : 'light', masters: new Map(), building: new Set(), created: [], notes: [], font: null, styles: null, page: null, cursor: null };
    note('Setting up variables and text styles…');
    await ensureFoundation();
    const { page, note: pageNote } = await getPage(settings);
    CTX.page = page;
    if (pageNote) CTX.notes.push(pageNote);
    await loadMasters();
    startRun();
    return CTX;
}

function revealCreated() {
    const shown = CTX.created.filter((n) => !n.removed);
    if (shown.length) {
        CTX.page.selection = shown;
        figma.viewport.scrollAndZoomIntoView(shown);
    }
}

async function runImport({ ids, settings }) {
    if (busy) return;
    busy = true;
    const failed = [];
    let built = 0;
    try {
        await startSession(settings);
        const page = CTX.page;
        let lastGroup = null;
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const entry = CATALOGUE.find((e) => e.id === id);
            if (!entry || !BUILDERS[id]) {
                failed.push({ label: entry?.label ?? id, error: 'No builder for this entry yet.' });
                continue;
            }
            if (entry.group !== lastGroup) {
                newRow();
                lastGroup = entry.group;
            }
            note(`${i + 1} of ${ids.length}: ${entry.label}`);
            const before = new Set(page.children);
            const createdBefore = CTX.created.length;
            try {
                await BUILDERS[id]();
                await flush();
                built++;
            } catch (error) {
                console.error(`${id} failed`, error);
                PENDING.length = 0;
                failed.push({ label: entry.label, error: error.message });
                // Drop the half-built pieces so a failed item never leaves stray layers on the page.
                const kept = new Set(CTX.created.slice(0, createdBefore));
                for (const n of [...page.children]) if (!before.has(n) && !CTX.created.includes(n)) n.remove();
                for (const [key, node] of CTX.masters) if (node.removed) CTX.masters.delete(key);
                CTX.created = CTX.created.filter((n) => kept.has(n) || !n.removed);
            }
        }
        revealCreated();
        const summary = `Imported ${built} of ${ids.length}.`;
        figma.notify(failed.length ? `${summary} ${failed.length} failed, see the panel.` : summary);
        send({ type: 'done', built, total: ids.length, failed, notes: CTX.notes, mode: CTX.mode });
    } catch (error) {
        console.error(error);
        send({ type: 'error', message: error.message });
    } finally {
        busy = false;
    }
}

function parseSpec(text) {
    try {
        return { spec: JSON.parse(text) };
    } catch (error) {
        return { problems: [`The spec is not valid JSON: ${error.message}`] };
    }
}

async function runCompose({ text, check, settings }) {
    if (busy) return;
    busy = true;
    try {
        const parsed = parseSpec(text);
        const problems = parsed.problems ?? [];
        let warnings = [];
        if (parsed.spec) {
            const result = checkSpec(parsed.spec);
            problems.push(...result.errors);
            warnings = result.warnings;
        }
        if (problems.length || check) {
            send({ type: 'compose-result', ok: problems.length === 0, checked: true, errors: problems, warnings });
            return;
        }
        await startSession(settings);
        const before = new Set(CTX.page.children);
        try {
            const frame = await composeSpec(parsed.spec);
            revealCreated();
            figma.notify(`Built "${parsed.spec.name ?? 'design'}" from library components.`);
            send({ type: 'compose-result', ok: true, checked: false, built: frame.name, errors: [], warnings: [...warnings, ...CTX.notes] });
        } catch (error) {
            console.error(error);
            PENDING.length = 0;
            for (const n of [...CTX.page.children]) if (!before.has(n) && !CTX.created.includes(n)) n.remove();
            send({ type: 'compose-result', ok: false, checked: false, errors: [error.message], warnings });
        }
    } finally {
        busy = false;
    }
}

async function runExport(kind) {
    try {
        if (kind === 'selection') {
            const result = await exportSelection();
            send({ type: 'export-result', kind, ...result });
        } else {
            send({ type: 'export-result', kind, ...(await exportLibrary()) });
        }
    } catch (error) {
        console.error(error);
        send({ type: 'export-result', kind, error: error.message });
    }
}

figma.ui.onmessage = async (msg) => {
    try {
        if (msg.type === 'ready') await sendInit();
        else if (msg.type === 'settings') await figma.clientStorage.setAsync(SETTINGS_KEY, msg.settings);
        else if (msg.type === 'import') await runImport(msg);
        else if (msg.type === 'compose') await runCompose(msg);
        else if (msg.type === 'export') await runExport(msg.kind);
        else if (msg.type === 'close') figma.closePlugin();
    } catch (error) {
        console.error(error);
        send({ type: 'error', message: error.message });
    }
};

// Messages sent before the panel has loaded are queued by Figma, so this also covers a panel that
// finished loading before the handler above was attached.
sendInit().catch((error) => console.error('init failed', error));
