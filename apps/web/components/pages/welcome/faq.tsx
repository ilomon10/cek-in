"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Undangon really free?",
    answer: "Yes. You can create and share invitations using the free plan.",
  },
  {
    question: "What’s the difference between Free and Pro?",
    answer:
      "Free covers basic needs. Pro unlocks premium templates, full customization, and advanced features.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. You can upgrade anytime, even after creating your invitation.",
  },
  {
    question: "Is Pro a subscription or one-time payment?",
    answer: "You can choose flexible plans designed to fit different needs.",
  },
  {
    question: "Will my free invitation stop working?",
    answer: "No. Invitations created with the free plan remain accessible.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Got questions?
          </h2>
          <p className="text-lg text-muted-foreground">
            We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, chat with our team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl overflow-hidden bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
