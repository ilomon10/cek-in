import { Check } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

const plans = [
  {
    name: "Essential",
    price: "29",
    period: "per month",
    description: "Perfect for healthy pets needing basic preventive care.",
    features: [
      "Annual wellness check-up",
      "Core vaccinations",
      "24/7 vet chat support",
      "Health tracking app",
      "Smart reminders",
    ],
    popular: false,
  },
  {
    name: "Complete",
    price: "59",
    period: "per month",
    description: "Comprehensive coverage for total peace of mind.",
    features: [
      "Everything in Essential",
      "Bi-annual check-ups",
      "Dental cleaning included",
      "Video vet consultations",
      "Nutrition planning",
      "Behavioural support",
      "Priority appointment booking",
    ],
    popular: true,
  },
  {
    name: "Family",
    price: "89",
    period: "per month",
    description: "Best value for multi-pet households. Up to 3 pets.",
    features: [
      "Everything in Complete",
      "Cover up to 3 pets",
      "Family wellness dashboard",
      "Dedicated care coordinator",
      "Emergency care coverage",
      "Monthly wellness boxes",
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            No hidden fees. No claim forms. Just predictable monthly costs and
            exceptional care for your pet.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/25 scale-105"
                  : "bg-card border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-foreground text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3
                className={`text-xl font-semibold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {plan.description}
              </p>

              <div className="mb-8">
                <span
                  className={`text-5xl font-bold ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}
                >
                  ${plan.price}
                </span>
                <span
                  className={`text-sm ml-2 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`}
                    />
                    <span
                      className={`text-sm ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full py-6 ${
                  plan.popular
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
