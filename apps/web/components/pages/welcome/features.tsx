import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/ui/carousel";
import { Heart, Shield } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Start Free",
    description:
      "Create invitations using free templates and share them instantly.",
    punchline: "No payment needed to get started.",
  },
  {
    icon: Shield,
    title: "Upgrade When Ready",
    description:
      "Unlock advanced customization, premium designs, and extra tools.",
    punchline: "Pay only if you need more.",
  },
  {
    icon: Shield,
    title: "Support Designers",
    description:
      "Every purchase helps independent designers earn from their work.",
    punchline: "Your upgrade supports creativity.",
  },
  {
    icon: Shield,
    title: "Sustainable Platform",
    description: "Pro plans keep Undangon running and improving.",
    punchline: "Fair pricing. Clear value.",
  },
];

export function Features() {
  return (
    <section id="features" className="dark py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Free for Everyone. Powerful for Those Who Need More.
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Undangon is free to use for creating and sharing invitations.
            <br />
            You can pick a template, customize it, and share it — no
            subscription required.
            <br />
            When you need advanced features, premium templates, or want to build
            as a creator,{" "}
            <span className="font-bold">
              Pro gives you more — and directly supports the people behind the
              platform
            </span>
          </p>
        </div>
      </div>
      {/* Features Grid */}
      <Carousel
        opts={{
          align: "center",
        }}
      >
        <div className="max-w-7xl mx-auto pb-7 px-8">
          <CarouselPrevious className="relative inset-[unset] translate-none size-12 mr-2 text-white border-white" />
          <CarouselNext className="relative inset-[unset] translate-none size-12 text-white border-white" />
        </div>
        <CarouselContent className="lg:px-[calc(50%_-_608px_+_16px)] py-1">
          {features.map((feature, index) => (
            <CarouselItem
              key={index}
              index={index}
              className="group md:basis-1/2 lg:basis-1/2 px-4"
            >
              <div
                className="p-8 rounded-2xl bg-card border border-border 
                transition-all duration-300
              
                hover:border-primary/50 
                hover:shadow-lg 
                hover:shadow-primary/5 
                
                group-data-[active=true]:border-primary/50 
                group-data-[active=true]:shadow-lg 
                group-data-[active=true]:shadow-primary/5
                "
              >
                <AspectRatio ratio={4 / 3}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.punchline}
                  </p>
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
