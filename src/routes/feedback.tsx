import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock3,
  Sparkles,
  Bug,
  Lightbulb,
  Heart,
  SendHorizonal,
  MonitorSmartphone,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { TOOLS } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const BASE_URL = "https://devhub.flinkeo.online";

const FEEDBACK_TYPE_OPTIONS = [
  {
    value: "Bug" as const,
    label: "Bug Report",
    description: "Something broke, behaved unexpectedly, or felt unreliable.",
    icon: Bug,
  },
  {
    value: "Feature" as const,
    label: "Feature Request",
    description: "A workflow or capability that would make the toolkit more useful.",
    icon: Lightbulb,
  },
  {
    value: "UX" as const,
    label: "UX / Design Feedback",
    description: "Layout, clarity, accessibility, or visual polish feedback.",
    icon: Sparkles,
  },
  {
    value: "Praise" as const,
    label: "Praise",
    description: "What felt especially good or worth keeping exactly as-is.",
    icon: Heart,
  },
];

const WHAT_HELPS = [
  "What you were trying to do",
  "What you expected to happen",
  "What happened instead",
  "Which tool or page was involved",
];

// Client-side Zod validation schema matching server-side rules
const feedbackFormSchema = z
  .object({
    feedback: z
      .string()
      .min(10, "Please provide at least 10 characters of feedback.")
      .max(10000, "Feedback cannot exceed 10,000 characters."),
    type: z.enum(["Bug", "Feature", "UX", "Praise"], {
      message: "Please select a feedback type.",
    }),
    tool: z.string().optional(),
    source: z.string().optional(),
    website: z.string().optional(), // Honeypot
    browser: z.string().optional(),
    deviceOrOs: z.string().optional(),
    stepsToReproduce: z
      .string()
      .max(10000, "Steps to reproduce cannot exceed 10,000 characters.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Bug") {
      if (!data.browser || data.browser.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["browser"],
          message: "Please specify the browser where the bug occurred.",
        });
      }
      if (!data.deviceOrOs || data.deviceOrOs.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["deviceOrOs"],
          message: "Please specify your device or operating system.",
        });
      }
      if (!data.stepsToReproduce || data.stepsToReproduce.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stepsToReproduce"],
          message: "Please provide the steps to reproduce the bug.",
        });
      }
    }
  });

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback & Bug Report — DevHub Toolkit" },
      {
        name: "description",
        content:
          "Submit feedback, feature requests, UX suggestions, or bug reports to the DevHub Toolkit team.",
      },
      { property: "og:title", content: "Feedback & Bug Report — DevHub Toolkit" },
      {
        property: "og:description",
        content:
          "Help us make DevHub Toolkit better. Submit bug reports, feature requests, or praise.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/feedback` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/feedback` }],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toolPopoverOpen, setToolPopoverOpen] = useState(false);
  const availableTools = TOOLS.filter((tool) => tool.status !== "soon");

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback: "",
      type: undefined,
      tool: "",
      source: "Beta",
      website: "",
      browser: "",
      deviceOrOs: "",
      stepsToReproduce: "",
    },
  });

  const { watch, reset } = form;
  const currentType = watch("type");
  const selectedTool = watch("tool") || "";
  const feedbackValue = watch("feedback") || "";
  const stepsValue = watch("stepsToReproduce") || "";

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmitError(result.error || "Failed to submit feedback. Please try again.");
      } else {
        setSubmitSuccess(true);
        reset();
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      setSubmitError("A connection error occurred. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { n: "01", label: "Choose a type", done: Boolean(currentType) },
    { n: "02", label: "Add context", done: Boolean(selectedTool) || Boolean(currentType) },
    { n: "03", label: "Write it out", done: feedbackValue.trim().length >= 10 },
  ];

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] bg-[radial-gradient(ellipse_at_top,theme(colors.foreground/.07),transparent_60%)]" />

      {/* Masthead */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <MessageSquare className="size-3" />
            Feedback
            <span className="h-px flex-1 bg-border" />
            <span className="hidden sm:inline">Direct to the maker</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Tell us what&apos;s broken,
            <span className="text-muted-foreground"> missing, or worth keeping.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">
            No account, no ticket queue. Every note is read by the person who ships the fix.
          </p>
          <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3">
            {[
              { k: "Review", v: "Human, not a bot", icon: ShieldCheck },
              { k: "Time", v: "~60 seconds", icon: Clock3 },
              { k: "Works on", v: "Any device", icon: MonitorSmartphone },
            ].map((s) => (
              <div key={s.k} className="bg-background px-4 py-3">
                <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <s.icon className="size-3" />
                  {s.k}
                </dt>
                <dd className="mt-1 text-sm font-medium">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          {/* Rail */}
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Progress
            </p>
            <ol className="mt-4 space-y-3 border-l border-border pl-4">
              {steps.map((step) => (
                <li key={step.n} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[21px] top-1.5 size-2 rounded-full ring-4 ring-background transition-colors",
                      step.done ? "bg-foreground" : "bg-border",
                    )}
                  />
                  <div className="font-mono text-[10px] text-muted-foreground">{step.n}</div>
                  <div
                    className={cn(
                      "text-sm transition-colors",
                      step.done ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-t border-border/70 pt-5">
              <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <Sparkles className="size-3" /> What helps
              </p>
              <ul className="mt-3 space-y-1.5 text-[13px] leading-5 text-muted-foreground">
                {WHAT_HELPS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-border/70 pt-5">
              <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <ShieldCheck className="size-3" /> Privacy
              </p>
              <p className="mt-3 text-[13px] leading-5 text-muted-foreground">
                Only what you type is stored. No accounts, no tracking pixels, no third parties.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div>
            {submitSuccess ? (
              <div className="rounded-2xl border border-border/70 bg-card/80 px-6 py-14 text-center sm:px-10">
                <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="size-7 text-emerald-500 animate-in fade-in zoom-in-50 duration-300" />
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight">
                  Received. Thank you.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  We read every submission and use it to prioritize what gets built and fixed next.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-7"
                >
                  Submit another response
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                  {submitError && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <h4 className="font-semibold">Submission failed</h4>
                        <p className="mt-1 text-xs opacity-90">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Honeypot */}
                  <div className="absolute -z-50 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              tabIndex={-1}
                              autoComplete="off"
                              placeholder="Leave this empty"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 01 — Type */}
                  <section className="space-y-5">
                    <div className="flex items-baseline gap-4 border-b border-border/60 pb-3">
                      <span className="font-mono text-xs text-muted-foreground">01</span>
                      <h2 className="text-base font-semibold tracking-tight">
                        What kind of feedback is this?
                      </h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div
                              role="radiogroup"
                              aria-label="Feedback type"
                              className="grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-2"
                            >
                              {FEEDBACK_TYPE_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isActive = field.value === option.value;

                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => field.onChange(option.value)}
                                    className={cn(
                                      "group relative cursor-pointer p-4 text-left transition-colors duration-200",
                                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                                      isActive
                                        ? "bg-foreground text-background"
                                        : "bg-background hover:bg-muted/50",
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      <Icon
                                        className={cn(
                                          "mt-0.5 size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                                        )}
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">
                                            {option.label}
                                          </span>
                                          {isActive && <Check className="size-3.5 shrink-0" />}
                                        </div>
                                        <p
                                          className={cn(
                                            "mt-1 text-xs leading-5",
                                            isActive
                                              ? "text-background/70"
                                              : "text-muted-foreground",
                                          )}
                                        >
                                          {option.description}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* 02 — Context */}
                  <section className="space-y-5">
                    <div className="flex items-baseline gap-4 border-b border-border/60 pb-3">
                      <span className="font-mono text-xs text-muted-foreground">02</span>
                      <h2 className="text-base font-semibold tracking-tight">Add context</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="tool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Affected tool or page
                          </FormLabel>
                          <Popover open={toolPopoverOpen} onOpenChange={setToolPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={toolPopoverOpen}
                                  className={cn(
                                    "h-11 w-full justify-between px-3 font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  <span className="truncate">
                                    {field.value || "General / No specific tool"}
                                  </span>
                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[var(--radix-popover-trigger-width)] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search tools or pages..." />
                                <CommandList>
                                  <CommandEmpty>No matching tool found.</CommandEmpty>
                                  <CommandItem
                                    value="General / No specific tool"
                                    onSelect={() => {
                                      field.onChange("");
                                      setToolPopoverOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "size-4",
                                        !selectedTool ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    <span>General / No specific tool</span>
                                  </CommandItem>
                                  {availableTools.map((tool) => (
                                    <CommandItem
                                      key={tool.slug}
                                      value={tool.name}
                                      onSelect={(value) => {
                                        field.onChange(value);
                                        setToolPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "size-4",
                                          selectedTool === tool.name ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      <span className="truncate">{tool.name}</span>
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="text-xs text-muted-foreground">
                            Optional — helpful when the issue is tied to a specific utility.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {currentType === "Bug" && (
                      <div className="space-y-5 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-lg border border-border bg-background">
                            <Bug className="size-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold tracking-tight">
                              Bug diagnostics
                            </h3>
                            <p className="text-xs leading-5 text-muted-foreground">
                              These details help us reproduce the issue much faster.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="browser"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold">Browser</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g. Chrome 124, Safari Mobile" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deviceOrOs"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold">
                                  Device or OS
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. macOS Sonoma, Windows 11, iPhone 15"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="stepsToReproduce"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                <FormLabel className="text-xs font-semibold">
                                  Steps to reproduce
                                </FormLabel>
                                <span
                                  className={cn(
                                    "font-mono text-[10px]",
                                    stepsValue.length > 9500
                                      ? "font-semibold text-destructive"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {stepsValue.length.toLocaleString()} / 10,000
                                </span>
                              </div>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="1. Go to JSON Formatter&#10;2. Paste invalid JSON&#10;3. Click format — the app crashes..."
                                  className="min-h-[120px] resize-y"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </section>

                  {/* 03 — Message */}
                  <section className="space-y-5">
                    <div className="flex items-baseline gap-4 border-b border-border/60 pb-3">
                      <span className="font-mono text-xs text-muted-foreground">03</span>
                      <h2 className="text-base font-semibold tracking-tight">Your message</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                            <FormLabel className="text-sm font-semibold">
                              Feedback message <span className="text-destructive">*</span>
                            </FormLabel>
                            <span
                              className={cn(
                                "font-mono text-[10px]",
                                feedbackValue.length > 9500
                                  ? "font-semibold text-destructive"
                                  : "text-muted-foreground",
                              )}
                            >
                              {feedbackValue.length.toLocaleString()} / 10,000
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={
                                currentType === "Bug"
                                  ? "Describe the issue, the impact, and anything unusual you noticed..."
                                  : currentType === "Feature"
                                    ? "Describe the feature you'd like, how it should work, and the problem it solves..."
                                    : currentType === "UX"
                                      ? "Tell us what felt confusing, slow, crowded, or could be easier to use..."
                                      : "Type your feedback here..."
                              }
                              className="min-h-[180px] resize-y"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Short and specific is great. Examples make your point land faster.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <input type="hidden" {...form.register("source")} value="Beta" />

                  <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-muted-foreground">
                      Submissions are private and used only to prioritize fixes and new tools.
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="group inline-flex w-full items-center justify-center gap-2 font-medium sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit feedback
                          <SendHorizonal className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
