import { Marquee } from "@repo/ui/components/ui/seragam/marquee";

export const CampaignBand = () => {
  return (
    <section className="w-full">
      <Marquee className="flex py-4 pb-3 bg-green-500">
        {[
          "Free for All",
          "Sustained by Care",
          "Free for All",
          "Sustained by Care",
          "Free for All",
          "Sustained by Care",
          "Free for All",
          "Sustained by Care",
          "Use It Free",
          "Support It Fair",
        ].map((v, idx) => (
          <div
            key={idx}
            className="text-4xl font-semibold tracking-wider whitespace-nowrap uppercase text-white"
          >
            {v}
            <span className="p-4">•</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
};
