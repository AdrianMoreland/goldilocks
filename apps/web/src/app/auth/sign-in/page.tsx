import { LoginForm1 } from "./components/login-form-1.tsx"
import { Logo } from "@/components/logo"
import { features } from "@/config/features"

export default function Page() {
  return (
    <div className={features.redesign ? "bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10" : "bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"}>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={features.redesign ? "hidden" : "flex flex-col items-center gap-2 self-center"}>
          <Logo size={56} />
          <div className="text-lg font-semibold">Merrion Gold</div>
          <div className="text-muted-foreground text-sm">Pricing Workbook</div>
        </div>
        <LoginForm1 />
      </div>
    </div>
  )
}
