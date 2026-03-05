import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Suspense } from "react";
import { HeroCarousel } from "./hero-carousel";

export function Hero() {
  const avatars = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/90.jpg",
  ];

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm text-foreground font-medium">
              New: AI-powered health insights
            </span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div> */}

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight mb-6 text-balance">
            Undangon — Digital Invitations Made Simple
          </h1>
          <h2 className="text-4xl -mt-4 font-bold text-foreground leading-tight tracking-tight mb-6 text-balance">
            Create, customize, and share invitations in minutes.
            {/* Free to Use. Built Together. Sustained by Support. */}
          </h2>

          {/* Subheadline */}
          <p className="text-md text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-pretty">
            Free to start. Upgrade when you need more. Built for users.
            Empowered by designers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant={"default"}>
              Start Creating for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant={"outline"}>
              Become a Designer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Social Proof */}
          {/* <div className="flex items-center justify-center gap-6 mt-12">
            <div className="flex -space-x-3">
              {avatars.map((src, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-card bg-accent overflow-hidden"
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Pet owner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span>{" "}
                from 500+ creator
              </p>
            </div>
          </div> */}
        </div>
      </div>
      {/* Hero Image */}
      <div className="mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
        <HeroCarousel />
      </div>
    </section>
  );
}
