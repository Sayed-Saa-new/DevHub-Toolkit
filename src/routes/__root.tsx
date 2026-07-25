import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { TOOLS } from "@/lib/tools";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you\'re looking for doesn\'t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn\'t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `DevHub Toolkit — ${TOOLS.length} Free Online Developer Tools` },
      {
        name: "description",
        content: `Free online JSON formatter, Base64 decoder, JWT decoder, UUID & hash generator, regex tester, QR codes, AI SQL & regex generators — ${TOOLS.length} developer tools, no signup.`,
      },
      {
        name: "keywords",
        content:
          "developer tools online, free developer tools, json formatter, base64 decode, jwt decoder, uuid generator, regex tester, hash generator, qr code generator, ai sql generator, ai regex generator",
      },
      { name: "author", content: "DevHub" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "google-site-verification", content: "4GW5hFWsbJa_98tGQoSUIX-OAfhGOfhh7ZLsxEoHqc0" },
      { property: "og:title", content: `DevHub Toolkit — ${TOOLS.length} Free Online Developer Tools` },
      {
        property: "og:description",
        content:
          "JSON, Base64, JWT, UUID, hashes, regex, QR codes, AI SQL, AI regex and more. Fast, minimal, keyboard-first — no signup.",
      },
      { property: "og:site_name", content: "DevHub Toolkit" },
      { property: "og:type", content: "website" },
      // Fallback og:image for pages that don't define their own (changelog, favorites, etc.)
      { property: "og:image", content: "https://devhub.flinkeo.online/og-image.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "DevHub Toolkit — free developer tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `DevHub Toolkit — ${TOOLS.length} Free Online Developer Tools` },
      {
        name: "twitter:description",
        content:
          "JSON, Base64, JWT, UUID, hashes, regex, QR codes, AI SQL, AI regex and more. Fast, minimal, keyboard-first — no signup.",
      },
      { name: "twitter:image", content: "https://devhub.flinkeo.online/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32.png?v=3", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png?v=3", type: "image/png", sizes: "16x16" },
      { rel: "alternate icon", href: "/favicon.ico?v=3", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=3", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
    // WebSite and Organization JSON-LD are defined in src/routes/index.tsx with proper @id anchors.
    // They are intentionally omitted here to avoid duplicate structured data on the homepage.
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      {isLanding ? (
        <Outlet />
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
      <Toaster position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
}