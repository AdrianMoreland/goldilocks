/**
 * The prototype's page-level tab style: text with an underline on the active one, in the theme's primary colour. Used by the
 * redesign for page views (Admin, Stocktake detail, Project Management, the tools panel); filters and modes keep the compact
 * segmented control.
 */
export const UNDERLINE_TAB_LIST = "h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0"

export const UNDERLINE_TAB =
    "text-muted-foreground flex-none cursor-pointer rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 pt-1 pb-2 text-sm shadow-none " +
    "data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none " +
    "dark:text-muted-foreground dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-foreground"
