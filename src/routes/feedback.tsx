import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { TOOLS } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const BASE_URL = "https://devhub.flinkeo.online";

// Client-side Zod validation schema matching server-side rules
const feedbackFormSchema = z
  .object({
    feedback: z
      .string()
      .min(10, "Please provide at least 10 characters of feedback.")
      .max(10000, "Feedback cannot exceed 10,000 characters."),
    type: z.enum(["Bug", "Feature", "UX", "Praise"], {
      errorMap: () => ({ message: "Please select a feedback type." }),
    }),
    tool: z.string().optional(),
    source: z.string().default("Beta"),
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="border-b border-border/60 px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="size-3" /> Feedback
          </div>
          <h1 className="text-balance text-2xl md:text-3xl font-semibold tracking-tight">
            Feedback & Bug Report
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Help us improve DevHub Toolkit. Suggest features, report bugs, or share your thoughts.
            All submissions go directly to our dashboard.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-10">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          {submitSuccess ? (
            <div className="flex flex-col items-center text-center py-10 space-y-4">
              <CheckCircle2 className="size-16 text-emerald-500 animate-in fade-in zoom-in-50 duration-300" />
              <h2 className="text-xl font-semibold tracking-tight">
                Thanks! Your feedback has been submitted.
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                We read every submission and use your input to prioritize what we build and fix
                next.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitSuccess(false)}
                className="mt-4"
              >
                Submit another response
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Submission failed</h4>
                      <p className="mt-1 text-xs opacity-90">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Honeypot field (hidden off-screen for spam protection) */}
                <div className="absolute overflow-hidden h-0 w-0 -z-50" aria-hidden="true">
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

                {/* Feedback Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Feedback Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select type of feedback" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bug">Bug Report</SelectItem>
                          <SelectItem value="Feature">Feature Request</SelectItem>
                          <SelectItem value="UX">UX / Design Feedback</SelectItem>
                          <SelectItem value="Praise">Praise</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Affected Tool or Page (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                        defaultValue={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="General / No specific tool" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">General / No specific tool</SelectItem>
                          {TOOLS.filter((t) => t.status !== "soon").map((t) => (
                            <SelectItem key={t.slug} value={t.name}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs text-muted-foreground">
                        Select the utility you were using when you noticed this issue or had this
                        idea.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Fields for Bugs */}
                {currentType === "Bug" && (
                  <div className="space-y-6 p-4 rounded-lg border border-border/80 bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Bug Diagnostic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Browser */}
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

                      {/* OS / Device */}
                      <FormField
                        control={form.control}
                        name="deviceOrOs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">Device or OS</FormLabel>
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

                    {/* Steps to Reproduce */}
                    <FormField
                      control={form.control}
                      name="stepsToReproduce"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-baseline">
                            <FormLabel className="text-xs font-semibold">
                              Steps to Reproduce
                            </FormLabel>
                            <span
                              className={`text-[10px] font-mono ${
                                stepsValue.length > 9500
                                  ? "text-destructive font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {stepsValue.length.toLocaleString()} / 10,000
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="1. Go to JSON Formatter&#10;2. Paste invalid JSON&#10;3. Click format — app crashes..."
                              className="min-h-[100px] resize-y"
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
                      <div className="flex justify-between items-baseline">
                        <FormLabel className="text-sm font-semibold">Feedback Message</FormLabel>
                        <span
                          className={`text-[10px] font-mono ${
                            feedbackValue.length > 9500
                              ? "text-destructive font-semibold"
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
                              ? "Describe the issue or error you encountered..."
                              : currentType === "Feature"
                                ? "Describe the feature you'd like to see, how it should work, and the problem it solves..."
                                : "Type your feedback here..."
                          }
                          className="min-h-[120px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hidden source field */}
                <input type="hidden" {...form.register("source")} value="Beta" />

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting feedback...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
