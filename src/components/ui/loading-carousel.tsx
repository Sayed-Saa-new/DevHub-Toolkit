import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface Tip {
  text: string;
  image: string;
  url?: string;
}

interface LoadingCarouselProps {
  tips: Tip[];
  className?: string;
  autoplayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  showProgress?: boolean;
  aspectRatio?: "video" | "square" | "wide";
  textPosition?: "top" | "bottom";
  onTipChange?: (index: number) => void;
  backgroundTips?: boolean;
  backgroundGradient?: boolean;
  ariaLabel?: string;
}

function getTipKey(tip: Tip): string {
  return `${tip.text}-${tip.image}`;
}

const carouselVariants: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
};

const aspectRatioClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[2/1]",
};

export function LoadingCarousel({
  onTipChange,
  className,
  tips,
  showProgress = true,
  aspectRatio = "video",
  showNavigation = false,
  showIndicators = true,
  backgroundTips = false,
  textPosition = "bottom",
  autoplayInterval = 4500,
  backgroundGradient = false,
  ariaLabel = "Featured tips",
}: LoadingCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: autoplayInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: !prefersReducedMotion,
      }),
    [autoplayInterval, prefersReducedMotion],
  );

  useEffect(() => {
    if (!api) return;
    if (prefersReducedMotion) autoplay.stop();
  }, [api, autoplay, prefersReducedMotion]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setDirection(newIndex - current);
      setCurrent(newIndex);
      onTipChange?.(newIndex);
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, current, onTipChange]);

  const handleSelect = useCallback((index: number) => api?.scrollTo(index), [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!api) return;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          api.scrollPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          api.scrollNext();
          break;
        case "Home":
          event.preventDefault();
          api.scrollTo(0);
          break;
        case "End":
          event.preventDefault();
          api.scrollTo(tips.length - 1);
          break;
      }
    },
    [api, tips.length],
  );

  return (
    <motion.div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
      className={cn(
        "mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-muted border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="w-full overflow-hidden rounded-xl">
        <Carousel setApi={setApi} plugins={[autoplay]} className="relative w-full" opts={{ loop: true }}>
          <CarouselContent>
            <AnimatePresence initial={false} custom={direction}>
              {tips.map((tip, index) => (
                <CarouselItem
                  key={getTipKey(tip)}
                  className="min-w-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${tips.length}: ${tip.text}`}
                >
                  <motion.div
                    variants={carouselVariants}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    custom={direction}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeInOut" }}
                    className={cn("relative w-full overflow-hidden bg-background", aspectRatioClasses[aspectRatio])}
                  >
                    <img
                      src={tip.image}
                      alt=""
                      aria-hidden="true"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "low"}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 1024px) 1152px, 100vw"
                      className="absolute inset-0 h-full w-full object-contain p-8"
                    />
                    {backgroundGradient && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    )}
                    {backgroundTips && (
                      <motion.div
                        variants={textVariants}
                        initial={prefersReducedMotion ? false : "hidden"}
                        animate="visible"
                        className={cn(
                          "absolute left-0 right-0 min-w-0 p-4 sm:p-6 md:p-8",
                          textPosition === "top" ? "top-0" : "bottom-0",
                        )}
                      >
                        <p className="text-center md:text-left text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight text-white">
                          {tip.text}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </CarouselItem>
              ))}
            </AnimatePresence>
          </CarouselContent>
          {showNavigation && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2" />
            </>
          )}
        </Carousel>
        <div className={cn("bg-muted p-4 sm:p-5", showIndicators && !backgroundTips ? "lg:px-4 lg:py-3" : "")}>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Slide {current + 1} of {tips.length}: {tips[current]?.text}
          </span>
          <div
            className={cn(
              "flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-center",
              showIndicators && !backgroundTips ? "sm:flex-col sm:items-start" : "",
            )}
          >
            {showIndicators && (
              <div className="flex w-full gap-2 overflow-x-auto pb-1 sm:pb-0">
                {tips.map((tip, index) => {
                  const isActive = index === current;
                  const isComplete = index < current;
                  return (
                    <button
                      key={getTipKey(tip)}
                      type="button"
                      className="flex h-10 min-w-8 flex-1 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-muted active:scale-[0.96] sm:min-w-0"
                      onClick={() => handleSelect(index)}
                      aria-label={`Go to tip ${index + 1}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/15">
                        {showProgress ? (
                          isComplete ? (
                            <span className="absolute inset-0 rounded-full bg-foreground/70" />
                          ) : isActive ? (
                            <motion.span
                              key={current}
                              initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                              animate={{ scaleX: 1 }}
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : { duration: autoplayInterval / 1000, ease: "linear" }
                              }
                              className="absolute inset-0 origin-left rounded-full bg-foreground/70"
                            />
                          ) : null
                        ) : (
                          <span
                            className={cn(
                              "absolute inset-0 origin-left rounded-full bg-foreground/70 transition-transform",
                              isActive ? "scale-x-100" : "scale-x-0",
                            )}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex min-w-0 items-center gap-2 text-foreground">
              {backgroundTips ? (
                <span className="whitespace-nowrap text-sm font-medium tabular-nums">
                  Tip {current + 1}/{tips.length}
                </span>
              ) : (
                <div className="min-w-0 max-w-full">
                  {tips[current]?.url ? (
                    <a
                      href={tips[current]?.url}
                      className="block max-w-full rounded-sm text-base font-medium leading-tight tracking-tight lg:text-2xl xl:font-semibold hover:underline"
                    >
                      {tips[current]?.text}
                    </a>
                  ) : (
                    <span className="block max-w-full text-base font-medium leading-tight tracking-tight lg:text-2xl xl:font-semibold">
                      {tips[current]?.text}
                    </span>
                  )}
                </div>
              )}
              {backgroundTips && <ChevronRight aria-hidden="true" className="h-4 w-4" />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingCarousel;