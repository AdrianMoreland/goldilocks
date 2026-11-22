import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useMyPermissions } from "@/api/permissions.api"
import { navGroupsFor } from "@/config/nav"
import { features } from "@/config/features"

/** The navigation groups the signed-in user may see, shared by the sidebar and the command palette. */
export function useNavGroups() {
  const { isAdmin, capabilities } = useAuth()
  const { can } = useMyPermissions()
  return React.useMemo(() => navGroupsFor({ isAdmin, can, grouped: features.redesign, capabilities }), [isAdmin, can, capabilities])
}
