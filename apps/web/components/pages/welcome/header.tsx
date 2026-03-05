"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <UndangonLogo />
            <span className="font-semibold text-foreground text-xl">
              Undangon
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#transparency"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Transparency
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="text-sm font-medium">
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 text-sm font-medium"
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                FAQ
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="justify-start">
                  Log in
                </Button>
                <Button className="bg-primary text-primary-foreground rounded-full">
                  Get started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function UndangonLogo() {
  return (
    <div>
      <img className="size-10" src={"logo.svg"} />
    </div>
  );
}
