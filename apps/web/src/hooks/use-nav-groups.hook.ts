import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { navGroupsFor } from "@/config/nav"

/** The navigation groups the signed-in user may see, shared by the sidebar and the command palette. */
export function useNavGroups() {
  const { isAdmin, isManager, capabilities } = useAuth()
  return React.useMemo(() => navGroupsFor({ isAdmin, isManager, capabilities }), [isAdmin, isManager, capabilities])
}
