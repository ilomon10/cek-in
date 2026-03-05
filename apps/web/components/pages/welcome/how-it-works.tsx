import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create your pet's profile",
    description:
      "Tell us about your furry friend — breed, age, health history. We'll personalise everything from day one.",
    image: "/pet-profile-creation-mobile-app-screen.jpg",
  },
  {
    number: "02",
    title: "Get your custom care plan",
    description:
      "Our AI analyses your pet's needs and creates a proactive health roadmap with scheduled check-ups and preventive care.",
    image: "/pet-health-care-plan-dashboard-screen.jpg",
  },
  {
    number: "03",
    title: "Track, chat, and thrive",
    description:
      "Monitor wellness milestones, chat with vets 24/7, and watch your pet live their healthiest, happiest life.",
    image: "/pet-health-tracking-and-vet-chat-mobile-app.jpg",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
              How it works
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Three simple steps to better pet health
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <span className="text-6xl md:text-8xl font-bold text-primary/20">
                  {step.number}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-4 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-primary font-medium hover:gap-3 gap-2 transition-all"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
