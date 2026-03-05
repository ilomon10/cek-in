"use client";

import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/ui/carousel";
import { Autoplay } from "@repo/ui/components/ui/carousel-autoplay";

export const HeroCarousel = () => {
  const templates = [
    {
      id: 1,
      url: "/TemplateOne-Capture.png",
    },
    {
      id: 2,
      url: "/TemplateTwo-Capture.png",
    },
    {
      id: 3,
      url: "/TemplateOne-Capture.png",
    },
    {
      id: 4,
      url: "/TemplateTwo-Capture.png",
    },
    {
      id: 5,
      url: "/TemplateOne-Capture.png",
    },
    {
      id: 6,
      url: "/TemplateTwo-Capture.png",
    },
    {
      id: 7,
      url: "/TemplateOne-Capture.png",
    },
    {
      id: 8,
      url: "/TemplateTwo-Capture.png",
    },
    {
      id: 9,
      url: "/TemplateOne-Capture.png",
    },
    {
      id: 10,
      url: "/TemplateTwo-Capture.png",
    },
  ];
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[Autoplay({ delay: 5000 })]}
    >
      {({ current }) => (
        <>
          <CarouselContent>
            {templates.map(({ id, url }, index) => {
              const isCurrent = index === current;
              const isPrev =
                index === (current - 1 + templates.length) % templates.length;
              const isNext = index === (current + 1) % templates.length;

              // Determine state for data-attribute
              const state = isCurrent
                ? "current"
                : isPrev
                  ? "prev"
                  : isNext
                    ? "next"
                    : "idle";
              return (
                <CarouselItem
                  key={id}
                  className="basis-1/3 md:basis-1/5 lg:basis-1/7"
                >
                  <AspectRatio
                    ratio={9 / 16}
                    className="bg-accent rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border
                    scale-80
                    data-[state='prev']:scale-85 
                    data-[state='next']:scale-85
                    data-[state='current']:scale-100 
                    data-[state='current']:rounded-b-none
                    data-[state='current']:translate-y-none
                    data-[state='prev']:translate-y-4
                    data-[state='next']:translate-y-4
                    data-[state='prev']:-translate-x-1
                    data-[state='next']:translate-x-1
                    translate-y-6
                    transition-all duration-500
                  "
                    data-state={state}
                  >
                    <img
                      src={url}
                      alt="Hugo pet health dashboard"
                      className="w-full h-full object-cover object-top"
                    />
                  </AspectRatio>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext className="right-16" />
          <CarouselPrevious className="left-16" />
        </>
      )}
    </Carousel>
  );
};
