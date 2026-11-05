"use client"

import * as React from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { homePathFor } from "@goldilocks/shared-types"
import { Eye, EyeOff } from "lucide-react"
import { features } from "@/config/features"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { ApiError } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

/** Only a 400/401 means the credentials were wrong; an unreachable or failing server must not look like a bad password. */
function loginErrorMessage(err: unknown): string {
  const status = err instanceof ApiError ? err.status : undefined
  if (status === null) return "Can't reach the server. Check your connection, then try again."
  if (status === 429) return "Too many sign-in attempts. Wait a minute, then try again."
  if (typeof status === "number" && status >= 500) return "The server had a problem. Try again shortly."
  return "Invalid email or password."
}

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, isAuthenticated, capabilities } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Already logged in (or just logged in) — go straight to the dashboard,
  // or back to wherever RequireAuth redirected from.
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from
    return <Navigate to={from?.pathname || homePathFor(capabilities)} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setError(null)
    setSubmitting(true)
    try {
      await login(values.email, values.password)
      // The new session isn't in this render's closure yet, so land on "/" and let it pick the branch's home page.
      navigate("/", { replace: true })
    } catch (err) {
      setError(loginErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          {features.redesign && (
            <div className="bg-primary text-primary-foreground mx-auto mb-1 grid size-9 place-items-center rounded-lg text-sm font-bold" aria-hidden>
              M
            </div>
          )}
          <CardTitle className="text-xl">Merrion Gold Pricing Workbook</CardTitle>
          <CardDescription>
            Sign in with your staff account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={features.redesign && showPassword ? "text" : "password"} autoComplete="current-password" className={features.redesign ? "pe-10" : undefined} {...field} />
                            {features.redesign && (
                              <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 grid w-10 place-items-center"
                              >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full cursor-pointer" disabled={submitting}>
                    {submitting ? "Signing in…" : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
