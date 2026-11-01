import { parseRoadmap, type RoadmapTask } from './roadmap';
import { mergeRoadmap } from './roadmap-merge';

/**
 * What the app and master last agreed on, after master's changes are taken in
 * (docs/ROADMAP-SYNC-PULL-DESIGN.md section 2). Master's deletions stay in it, flagged, so a later push
 * cannot bring them back; what differs between the app and this text is exactly the app's own edits.
 */
export function absorbFile(base: string, file: string): string {
  return mergeRoadmap(base, file, base).forApp;
}

export interface TaskRef {
  /** Section key, e.g. `1.12`. */
  section: string;
  title: string;
  checked: boolean;
}

export interface AppOnlyTasks {
  /** In the app, nowhere on master (same section, same text). */
  appOnly: TaskRef[];
  /** Ticked in the app, present but unticked on master. */
  ticksOnlyInApp: TaskRef[];
}

/** A task's text with everything but letters and digits dropped, so dash style, markdown marks, emoji and spacing do not matter. */
const keyOf = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

/** How much of the start of a task counts as "the same task" when the end (usually a note in `*( … )*`) was reworded. */
const HEAD = 48;
/** Shorter titles than this must match in full: a short prefix is too likely to hit another task. */
const MIN_HEAD = 24;

function flatten(tasks: RoadmapTask[], into: { text: string; checked: boolean }[]) {
  for (const task of tasks) {
    into.push({ text: task.text, checked: task.checked });
    flatten(task.children, into);
  }
}

function tasksBySection(markdown: string) {
  const out = new Map<string, { text: string; checked: boolean }[]>();
  for (const section of parseRoadmap(markdown)) {
    const list = out.get(section.key) ?? [];
    flatten(section.tasks, list);
    out.set(section.key, list);
  }
  return out;
}

/**
 * The tasks a first pull would put at risk: those only the app has, and ticks only the app made.
 * Matching is by section key and task text, ignoring case, spacing, punctuation, dash style and emoji; a task
 * whose first part matches counts as the same task even if its trailing note was reworded, so a stale copy
 * that differs only in wording does not look like hundreds of app-only tasks.
 */
export function findAppOnlyTasks(app: string, master: string): AppOnlyTasks {
  const mine = tasksBySection(app);
  const theirs = tasksBySection(master);
  const result: AppOnlyTasks = { appOnly: [], ticksOnlyInApp: [] };
  for (const [section, tasks] of mine) {
    const remote = theirs.get(section) ?? [];
    const full = new Map<string, { checked: boolean }>();
    const head = new Map<string, { checked: boolean }>();
    for (const task of remote) {
      const key = keyOf(task.text);
      if (!full.has(key)) full.set(key, task);
      if (key.length >= MIN_HEAD && !head.has(key.slice(0, HEAD))) head.set(key.slice(0, HEAD), task);
    }
    for (const task of tasks) {
      const key = keyOf(task.text);
      const match = full.get(key) ?? (key.length >= MIN_HEAD ? head.get(key.slice(0, HEAD)) : undefined);
      if (!match) result.appOnly.push({ section, title: task.text, checked: task.checked });
      else if (task.checked && !match.checked) result.ticksOnlyInApp.push({ section, title: task.text, checked: true });
    }
  }
  return result;
}
