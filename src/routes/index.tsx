import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hello — Blank Landing" },
      { name: "description", content: "A simple blank landing page." },
      { property: "og:title", content: "Hello — Blank Landing" },
      { property: "og:description", content: "A simple blank landing page." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Hello
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          A blank landing page, ready when you are.
        </p>
      </div>
    </main>
  );
}
