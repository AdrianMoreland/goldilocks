"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { CornerDownLeft, History, Search } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import type { NavItem } from "@/config/nav"
import { useNavGroups } from "@/hooks/use-nav-groups.hook"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { modKeyLabel } from "@/lib/command-search"

const RECENT_LIMIT = 3

const itemClass = "h-9 gap-2.5 rounded-lg px-2 py-0 text-foreground/80 data-[selected=true]:text-foreground"

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Jump-to-page palette. Offers the same pages as the sidebar, so a user is only shown what their role may open. */
export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const navigate = useNavigate()
  const groups = useNavGroups()
  const [recent, setRecent] = useUserPreference<string[]>("palette-recent", [])
  const [query, setQuery] = React.useState("")

  // Looked up against the current pages, so a remembered page the user can no longer open is dropped.
  const allItems = React.useMemo(() => groups.flatMap((group) => group.items), [groups])
  const recentItems = recent
    .map((url) => allItems.find((item) => item.url === url))
    .filter((item): item is NavItem => item !== undefined)

  const handleOpenChange = (next: boolean) => {
    if (!next) setQuery("")
    onOpenChange(next)
  }

  const go = (item: NavItem) => {
    setRecent([item.url, ...recent.filter((url) => url !== item.url)].slice(0, RECENT_LIMIT))
    handleOpenChange(false)
    navigate(item.url)
  }

  const renderItem = (item: NavItem, valuePrefix = "") => {
    const Icon = item.icon
    return (
      <CommandItem
        key={valuePrefix + item.url}
        value={valuePrefix + item.title}
        keywords={item.keywords}
        onSelect={() => go(item)}
        className={itemClass}
      >
        <Icon />
        {item.title}
      </CommandItem>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] translate-y-0 gap-0 overflow-hidden rounded-xl p-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">Search or jump to</DialogTitle>
        <DialogDescription className="sr-only">Type to find a page, then press Enter to open it.</DialogDescription>
        <Command className="rounded-xl **:data-[slot=command-input-wrapper]:h-11">
          <CommandInput placeholder="Search or jump to…" value={query} onValueChange={setQuery} className="h-11" />
          <CommandList className="max-h-72 p-1.5">
            <CommandEmpty className="text-muted-foreground px-3 py-8 text-center text-sm">
              Nothing for “{query}”.
            </CommandEmpty>
            {query === "" && recentItems.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-1.5">
                    <History className="size-3" />
                    Recent
                  </span>
                }
              >
                {recentItems.map((item) => renderItem(item, "recent "))}
              </CommandGroup>
            )}
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => renderItem(item))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="text-muted-foreground flex items-center gap-3 border-t px-3 py-2 text-xs">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>
              <CornerDownLeft />
            </Kbd>
            open
          </span>
          <span className="ms-auto flex items-center gap-1">
            <Kbd>esc</Kbd>
            close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-input bg-popover text-muted-foreground hover:text-foreground focus-visible:ring-ring relative inline-flex h-8 w-8 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg border px-0 text-sm whitespace-nowrap outline-none focus-visible:ring-2 sm:w-full sm:justify-start sm:px-3"
    >
      <Search className="size-4 shrink-0" />
      <span className="hidden min-w-0 flex-1 truncate text-start sm:inline">Search or jump to…</span>
      <KbdGroup className="ms-auto hidden shrink-0 sm:inline-flex">
        <Kbd>{modKeyLabel}</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  )
}
