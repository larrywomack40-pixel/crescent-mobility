import Link from "next/link";

export const metadata = { title: "How It Works | Crescent Mobility" };

const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    body: "Browse our ramps and pick the size that fits your entry. Not sure? Reach out and we'll help you measure and choose the right rise and length.",
  },
  {
    n: "02",
    title: "We deliver & set up",
    body: "Delivery and professional setup are included on every rental. Our team positions and secures the ramp so it's safe and ready to roll the same day.",
  },
  {
    n: "03",
    title: "Rent by day, week, or month",
    body: "Keep it as long as you need. Flexible rental terms mean you only pay for the time you use, whether that's a weekend visit or a months-long recovery.",
  },
  {
    n: "04",
    title: "We pick it up",
    body: "When you're done, schedule a pickup and we'll remove everything and haul it away. No storage, no disposal, no hassle on your end.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="pt-36 pb-24 bg-charcoal text-white min-h-screen">
      <div className="container-x">
        <p className="overline text-amber">How It Works</p>
        <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">Access in four simple steps</h1>
        <p className="text-white/70 max-w-2xl text-lg">
          We handle the heavy lifting so you can focus on getting where you need to go.
          From your first call to final pickup, here's what to expect.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mt-16">
          {steps.map((s) => (
            <div key={s.n} className="bg-charcoal-light border border-white/10 rounded-2xl p-8">
              <span className="overline text-amber">{s.n}</span>
              <h2 className="text-2xl font-bold mt-3 mb-3">{s.title}</h2>
              <p className="text-white/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/ramps" className="btn-amber">Browse ramps</Link>
          <Link href="/contact" className="btn-outline">Ask a question</Link>
        </div>
      </div>
    </main>
  );
}
