import { renderToString } from "react-dom/server"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { StockFlag } from "./stock-flag"

const productLevels = vi.fn(async () => [{ productId: 1, state: "IN", total: 6, branches: [] }])
let allowed = false

vi.mock("@/api/permissions.api", () => ({ useMyPermissions: () => ({ can: () => allowed }) }))
vi.mock("@/api/live-stock.api", () => ({ useLiveStockApi: () => ({ productLevels }) }))

const html = () =>
    renderToString(
        <QueryClientProvider client={new QueryClient()}>
            <StockFlag productId={1} />
        </QueryClientProvider>,
    )

describe("StockFlag", () => {
    beforeEach(() => productLevels.mockClear())

    it("renders nothing and never asks the server without the stock-levels permission", () => {
        allowed = false
        expect(html()).toBe("")
        expect(productLevels).not.toHaveBeenCalled()
    })
})
