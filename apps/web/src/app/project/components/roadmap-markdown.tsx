import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

const block: Components = {
    p: ({ children }) => <p className="my-2 text-sm leading-6 first:mt-0 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    // Fenced blocks carry a language- class (or newlines); they sit in the <pre> below and need no chip of their own.
    code: ({ children, className }) =>
        className || String(children).includes("\n") ? (
            <code className={className}>{children}</code>
        ) : (
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.8em]">{children}</code>
        ),
    h3: ({ children }) => <h3 className="mt-5 mb-1.5 text-sm font-semibold first:mt-0">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 mb-1 text-sm font-medium first:mt-0">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="border-border text-muted-foreground my-3 border-l-2 pl-3 text-sm">{children}</blockquote>,
    hr: () => <hr className="my-4" />,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 text-sm marker:text-muted-foreground">{children}</ul>,
    ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 text-sm marker:text-muted-foreground">{children}</ol>,
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
            {children}
        </a>
    ),
    table: ({ children }) => (
        <div className="my-3 overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">{children}</table>
        </div>
    ),
    th: ({ children }) => <th className="bg-muted/60 border-b px-3 py-2 text-xs font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-b px-3 py-2 align-top last:border-b-0">{children}</td>,
    pre: ({ children }) => <pre className="bg-muted my-3 overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{children}</pre>,
}

/** Prose and tables from a roadmap section (ground rules, conflicts table, architecture block). */
export function RoadmapMarkdown({ children }: { children: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={block}>
            {children}
        </ReactMarkdown>
    )
}

const inline: Components = {
    p: ({ children }) => <>{children}</>,
    strong: block.strong,
    code: block.code,
    a: block.a,
}

/** One task's text on one line: bold, code, links and italics only. */
export function InlineMarkdown({ children }: { children: string }) {
    return <ReactMarkdown components={inline}>{children}</ReactMarkdown>
}
