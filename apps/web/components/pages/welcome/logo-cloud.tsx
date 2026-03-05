export function LogoCloud() {
  const logos = [
    "EscoMining",
    "Samudera Mulia Abadi",
    "IT: Imanuel Tenda",
    "PetStock",
    "Greencross",
  ];

  return (
    <section className="py-12 border-y border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by company at Indonesia
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
