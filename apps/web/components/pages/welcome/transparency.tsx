import { Badge } from "@repo/ui/components/ui/badge";
import {
  Heart,
  Shield,
  Clock,
  Smartphone,
  Calendar,
  MessageCircle,
  Building2Icon,
  ClockFadingIcon,
  BrushIcon,
} from "lucide-react";

const features = [
  {
    icon: Building2Icon,
    title: "Infrastructure & Reliability",
    description: "Fast loading, secure data, and stable performance.",
  },
  {
    icon: ClockFadingIcon,
    title: "Product Development",
    description: "New features, better tools, and continuous improvements.",
  },
  {
    icon: BrushIcon,
    title: "Design & Templates",
    description: "Fresh designs for different cultures, events, and trends.",
  },
];

export function TransparencySection() {
  return (
    <section id="transparency" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* <div className="inline-flex items-center gap-2 mb-4">
            <Badge
              variant={"outline"}
              className="text-sm px-4 rounded-full uppercase tracking-wider text-muted-foreground font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Features
            </Badge>
          </div> */}
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Why Pro Exists
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Running Undangon requires infrastructure, development, and creative
            work.
            <br />
            Pro plans allow us to:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
