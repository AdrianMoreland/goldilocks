import type { LucideIcon } from "lucide-react"
import type { Block } from "./blocks"

export type TopicGroup = "Architecture" | "OOP and SOLID" | "Runtime and security" | "Operations"

export interface Topic {
    id: string
    group: TopicGroup
    title: string
    icon: LucideIcon
    /** One line under the title. */
    summary: string
    blocks: Block[]
}
