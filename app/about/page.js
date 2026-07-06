import Link from "next/link";

export const metadata = { title: "About | Crescent Mobility" };

const values = [
  { title: "Local & responsive", body: "We're based in your community, not a national call center. When you call, you reach the people who deliver and set up your ramp." },
  { title: "Safety first", body: "Every ramp is inspected and rated before it goes out. We install to a safe slope and make sure handrails and surfaces are secure." },
  { title: "No commitment", body: "Rent for exactly as long as you need it, whether that's a weekend or several months. When you're done, we take it back." },
];

export default function AboutPage() {
  return (
    <main className="pt-36 pb-24 bg-charcoal text-white min-h-screen">
      <div className="container-x">
        <p className="overline text-amber">About Us</p>
        <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">Mobility should never wait</h1>
        <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
          Crescent Mobility started with a simple belief: getting in and out of your
          own home shouldn't be a barrier. We provide clean, safe, professionally
          installed access ramps on flexible rental terms, so you or your loved one can
          move freely, whether it's for a short recovery or a lasting need.
        </p>
        <div className="grid gap-6 md:grid-cols-3 mt-16">
          {values.map((v) => (
            <div key={v.title} className="bg-charcoal-light border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-3">{v.title}</h2>
              <p className="text-white/70 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-charcoal-light border border-white/10 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-3">Serving the greater New Orleans area</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl">
            We deliver, set up, and remove ramps throughout the region. Not sure if we
            reach your address? Get in touch and we'll let you know right away.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/ramps" className="btn-amber">Browse ramps</Link>
            <Link href="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
