"use client";

import { useState } from "react";
import { Star, ArrowLeft, ArrowRight, Quote } from "lucide-react";

const testimonials: {
  stars: number;
  quote: string;
  author: string;
  location: string;
  image: string;
}[] = [
  {
    stars: 5,
    quote:
      "I started with the free plan, then upgraded for my wedding. Totally worth it.",
    author: "The Miller Family",
    location: "Melbourne",
    image: "https://placehold.co/400x400?text=Custom+your+invitation",
  },
  {
    stars: 5,
    quote: "Simple to use, looks professional, and affordable.",
    author: "Sarah Chen",
    location: "Sydney",
    image: "/woman-with-golden-retriever-dog-portrait.jpg",
  },
  {
    stars: 5,
    quote: "Free was enough at first, but Pro made it feel premium.",
    author: "Small Business Owner",
    location: "Sydney",
    image: "/woman-with-golden-retriever-dog-portrait.jpg",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState<number>(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
              Testimonials
            </span>
          </div> */}
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Trusted for Meaningful Moments
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Join thousands of Creator who&apos;ve build their own invitation.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border">
            {/* Quote Icon */}
            <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[current]?.stars)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 text-pretty">
              &ldquo;{testimonials[current]?.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img
                src={testimonials[current]?.image || "/placeholder.svg"}
                alt={testimonials[current]?.author}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
              />
              <div>
                <p className="font-semibold text-foreground">
                  {testimonials[current]?.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[current]?.location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current
                      ? "bg-primary"
                      : "bg-border hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
