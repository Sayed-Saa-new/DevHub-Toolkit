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

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top,theme(colors.primary/.12),transparent_55%)]" />
      <div className="pointer-events-none absolute right-0 top-24 -z-10 hidden h-72 w-72 rounded-full bg-primary/10 blur-3xl md:block" />

      {/* Hero Section */}
      <section className="border-b border-border/60 px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <MessageSquare className="size-3" /> Feedback
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Help us shape a better DevHub Toolkit
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                Share bugs, feature ideas, UX friction, or quick wins you&apos;d love to see. Every
                response goes straight to our internal dashboard for review.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-foreground" />
                Direct team review
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5 text-foreground" />
                Quick to submit
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                <MonitorSmartphone className="size-3.5 text-foreground" />
                Mobile-friendly form
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {SIDEBAR_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-lg border border-border bg-background/80">
                      <Icon className="size-4" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-tight">{card.title}</h2>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-2 leading-5">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-[0_20px_70px_-40px_oklch(0_0_0_/_0.45)] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
            {submitSuccess ? (
              <div className="flex flex-col items-center px-6 py-12 text-center sm:px-8 sm:py-14">
                <div className="mb-5 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <CheckCircle2 className="size-12 text-emerald-500 animate-in fade-in zoom-in-50 duration-300" />
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight">
                  Thanks! Your feedback has been submitted.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  We read every submission and use your input to prioritize what we build and fix
                  next.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6"
                >
                  Submit another response
                </Button>
              </div>
            ) : (
              <div className="p-5 sm:p-6 md:p-8">
                <div className="mb-6 space-y-2 border-b border-border/60 pb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                    <SendHorizonal className="size-3" />
                    Submission Form
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Tell us what happened
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    A little context goes a long way. Include the tool, the issue, and what you
                    expected so we can act on it faster.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    {submitError && (
                      <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <div>
                          <h4 className="font-semibold">Submission failed</h4>
                          <p className="mt-1 text-xs opacity-90">{submitError}</p>
                        </div>
                      </div>
                    )}

                    {/* Honeypot field (hidden off-screen for spam protection) */}
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

                    <div className="space-y-6">
                      {/* Feedback Type — inline card picker */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Feedback Type <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormDescription className="text-xs text-muted-foreground">
                              Pick the closest match — it changes which details we ask for.
                            </FormDescription>
                            <FormControl>
                              <div
                                role="radiogroup"
                                aria-label="Feedback type"
                                className="grid gap-2.5 pt-1 sm:grid-cols-2"
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
                                        "group cursor-pointer rounded-xl border p-3.5 text-left transition-all duration-200",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                        isActive
                                          ? "border-foreground/40 bg-muted/40 shadow-sm"
                                          : "border-border/70 bg-background/60 hover:border-border hover:bg-muted/20",
                                      )}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={cn(
                                            "grid size-9 shrink-0 place-items-center rounded-lg border transition-colors",
                                            isActive
                                              ? "border-foreground/30 bg-foreground text-background"
                                              : "border-border bg-background text-foreground",
                                          )}
                                        >
                                          <Icon className="size-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                              {option.label}
                                            </span>
                                            {isActive && (
                                              <Check className="size-3.5 shrink-0 text-foreground" />
                                            )}
                                          </div>
                                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
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

                      {/* Optional Affected Tool / Page */}
                      <FormField
                        control={form.control}
                        name="tool"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Affected Tool or Page
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
                                      "h-10 w-full justify-between px-3 font-normal",
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
                                            selectedTool === tool.name
                                              ? "opacity-100"
                                              : "opacity-0",
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
                              Optional, but helpful when the issue is tied to a specific utility or
                              page. You can search by name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Conditional Fields for Bugs */}
                    {currentType === "Bug" && (
                      <div className="space-y-5 rounded-2xl border border-border/80 bg-muted/10 p-4 sm:p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-xl border border-border bg-background/80">
                              <Bug className="size-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold tracking-tight">
                                Bug diagnostic information
                              </h3>
                              <p className="text-xs leading-5 text-muted-foreground">
                                These details help us reproduce issues much faster.
                              </p>
                            </div>
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
                                  Steps to Reproduce
                                </FormLabel>
                                <span
                                  className={`text-[10px] font-mono ${
                                    stepsValue.length > 9500
                                      ? "font-semibold text-destructive"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {stepsValue.length.toLocaleString()} / 10,000
                                </span>
                              </div>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="1. Go to JSON Formatter&#10;2. Paste invalid JSON&#10;3. Click format - the app crashes..."
                                  className="min-h-[120px] resize-y"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Feedback content */}
                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                            <FormLabel className="text-sm font-semibold">
                              Feedback Message
                            </FormLabel>
                            <span
                              className={`text-[10px] font-mono ${
                                feedbackValue.length > 9500
                                  ? "font-semibold text-destructive"
                                  : "text-muted-foreground"
                              }`}
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
                                    ? "Describe the feature you'd like to see, how it should work, and the problem it solves..."
                                    : currentType === "UX"
                                      ? "Tell us what felt confusing, slow, crowded, or could be easier to use..."
                                      : "Type your feedback here..."
                              }
                              className="min-h-[160px] resize-y"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Short and specific is great. Include examples when they make your point
                            clearer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hidden source field */}
                    <input type="hidden" {...form.register("source")} value="Beta" />

                    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-6 text-muted-foreground">
                        We use these notes to prioritize fixes, design polish, and future tools.
                      </p>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 font-medium sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Submitting feedback...
                          </>
                        ) : (
                          <>
                            <SendHorizonal className="size-4" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <h2 className="text-sm font-semibold tracking-tight">Need a solid bug report?</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2 leading-5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  Mention the browser, device, and tool involved.
                </li>
                <li className="flex gap-2 leading-5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  List the exact steps that triggered the problem.
                </li>
                <li className="flex gap-2 leading-5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  Tell us what you expected versus what actually happened.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-foreground" />
                <h2 className="text-sm font-semibold tracking-tight">Privacy</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We only store what you type here. No accounts, no tracking pixels, and nothing is
                shared with third parties.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
