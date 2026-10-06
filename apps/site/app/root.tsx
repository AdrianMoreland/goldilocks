import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Remove once the site is ready to be indexed (launch step in docs/SITE-PLAN.md). */}
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-heading text-4xl">{notFound ? "Page not found" : "Something went wrong"}</h1>
      <p className="mt-4 text-muted-foreground">
        {notFound ? "We could not find that page." : "Please try again, or call 01 254 7901."}
      </p>
    </main>
  );
}
