"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  useAutoplay,
  useAutoplayProgress,
  useEmblaProgressOnSelect,
} from "@repo/ui/components/ui/carousel-autoplay";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

const steps = [
  {
    number: "00",
    title: "Choose a Template",
    description: "Browse free and premium invitation designs.",
    image: "https://placehold.co/400x400?text=Template+gallery+image",
  },
  {
    number: "01",
    title: "Customize & Share",
    description:
      "Edit details, preview instantly, and share your invitation link.",
    image: "https://placehold.co/400x400?text=Editor+UI+image",
  },
  {
    number: "02",
    title: "Create & Publish Templates",
    description: "Design your own templates and publish them to Undangon.",
    image: "https://placehold.co/400x400?text=Designer+dashboard+image",
  },
  {
    number: "03",
    title: "Ecosystem",
    description: "Users Support Designers. Designers Grow the Platform.",
    image: "https://placehold.co/400x400?text=Ecosystem+diagram",
  },
];

export function HowItWorksSection() {
  const [api, setApi] = useState<CarouselApi>();

  const [current, setCurrent] = useState<string>("00");

  const progress = useEmblaProgressOnSelect(api, 10000);

  useEffect(() => {
    if (!api) {
      return;
    }
    const handleSelect = () => {
      const c = api.selectedScrollSnap();
      setCurrent(`0${c}`);
    };
    api.on("reInit", handleSelect);
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Three simple steps to better pet health
          </h2>
        </div> */}

        {/* Steps */}
        <div className="space-y-20">
          <div className={`flex items-center gap-12 lg:gap-20`}>
            <div className="w-1/2">
              <h2 className="text-3xl font-bold mb-4">How Undangon works</h2>
              <Accordion
                type="single"
                value={current}
                onValueChange={(a) => {
                  console.log(a, Number(a));
                  api?.scrollTo(Number(a));
                }}
                className="-mx-4"
              >
                {steps.map((step, index) => (
                  <AccordionItem
                    key={index}
                    value={step.number}
                    className="relative data-[state=open]:bg-white rounded-lg px-4 overflow-hidden border-none"
                  >
                    <div
                      className={`embla__progress absolute top-0 bottom-0 left-0 overflow-hidden`}
                    >
                      <div
                        style={{
                          transitionDuration: `${progress.duration}ms`,
                        }}
                        className={cn(
                          `embla__progress__bar ease-linear transition-transform w-1 h-full bg-primary`,
                          step.number === current
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-full"
                        )}
                      />
                    </div>
                    <AccordionTrigger className="text-2xl">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {step.description}
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center text-primary font-medium hover:gap-3 gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="w-1/2">
              <Carousel
                opts={{
                  align: "center",
                }}
                setApi={setApi}
                plugins={[Autoplay({ delay: progress.duration })]}
              >
                <CarouselContent>
                  {steps.map((step, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={4 / 3}>
                        <div className="bg-card size-full rounded-2xl overflow-hidden border border-border">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="size-full object-cover"
                          />
                        </div>
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
