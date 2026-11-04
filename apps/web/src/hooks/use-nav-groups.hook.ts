import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { navGroupsFor } from "@/config/nav"
import { features } from "@/config/features"

/** The navigation groups the signed-in user may see, shared by the sidebar and the command palette. */
export function useNavGroups() {
  const { isAdmin, isManager, capabilities } = useAuth()
  return React.useMemo(() => navGroupsFor({ isAdmin, isManager, grouped: features.redesign, capabilities }), [isAdmin, isManager, capabilities])
}
