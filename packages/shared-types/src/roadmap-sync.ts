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

const norm = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();

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
 * Matching is by section key and task text, ignoring case and spacing.
 */
export function findAppOnlyTasks(app: string, master: string): AppOnlyTasks {
  const mine = tasksBySection(app);
  const theirs = tasksBySection(master);
  const result: AppOnlyTasks = { appOnly: [], ticksOnlyInApp: [] };
  for (const [section, tasks] of mine) {
    const remote = new Map((theirs.get(section) ?? []).map((t) => [norm(t.text), t]));
    for (const task of tasks) {
      const match = remote.get(norm(task.text));
      if (!match) result.appOnly.push({ section, title: task.text, checked: task.checked });
      else if (task.checked && !match.checked) result.ticksOnlyInApp.push({ section, title: task.text, checked: true });
    }
  }
  return result;
}
