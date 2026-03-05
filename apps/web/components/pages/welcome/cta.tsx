import { Button } from "@repo/ui/components/ui/button";
import { ArrowRightIcon, RibbonIcon } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
          Start Free. Upgrade When You’re Ready.
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-pretty">
          Undangon is designed to grow with you — from simple invitations to a
          creative ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 py-6 text-base font-medium"
          >
            Create Invitation — Free
            <RibbonIcon className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 py-6 text-base font-medium"
          >
            Become a Designer
            <RibbonIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <p className="text-sm text-primary-foreground/60 mt-6">
          No investors pushing dark patterns. Just a fair platform built for
          real users.
        </p>
      </div>
    </section>
  );
}
