import Link from "next/link";

export const metadata = { title: "FAQ | Crescent Mobility" };

const faqs = [
  { q: "How much does it cost to rent a ramp?", a: "Rentals start at $25 per day, with lower rates for weekly and monthly terms. Delivery and setup are always included at no extra charge." },
  { q: "Do you deliver and set up the ramp?", a: "Yes. Every rental includes professional delivery and installation. Our team positions and secures the ramp so it's safe and ready to use the same day." },
  { q: "How do I know what size I need?", a: "The right length depends on the height of your step or landing. If you're unsure, contact us with a rough measurement and we'll recommend the correct ramp." },
  { q: "How long can I keep the ramp?", a: "As long as you need it. Rent by the day, week, or month. When you're finished, just schedule a pickup and we'll remove everything." },
  { q: "What areas do you serve?", a: "We serve the greater New Orleans area. If you're not sure whether we reach your address, get in touch and we'll let you know right away." },
  { q: "Are the ramps safe and inspected?", a: "Every ramp is inspected and rated before it goes out, and we install to a safe slope with secure handrails and non-slip surfaces." },
];

export default function FaqPage() {
  return (
    <main className="pt-36 pb-24 bg-charcoal text-white min-h-screen">
      <div className="container-x">
        <p className="overline text-amber">FAQ</p>
        <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">Questions, answered</h1>
        <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
          The things people ask us most. Don't see your question? Reach out and we'll help.
        </p>

        <div className="mt-16 space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.q} className="bg-charcoal-light border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-3">{f.q}</h2>
              <p className="text-white/70 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/ramps" className="btn-amber">Browse ramps</Link>
          <Link href="/contact" className="btn-outline">Still have questions?</Link>
        </div>
      </div>
    </main>
  );
}
