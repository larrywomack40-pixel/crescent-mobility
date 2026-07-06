import Link from "next/link";

export const metadata = { title: "Contact | Crescent Mobility" };

export default function ContactPage() {
  return (
    <main className="pt-36 pb-24 bg-charcoal text-white min-h-screen">
      <div className="container-x">
        <p className="overline text-amber">Get In Touch</p>
        <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">We're here to help</h1>
        <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
          Questions about sizing, delivery, or availability? Reach out and a real
          person will get back to you quickly. We'll help you find the right ramp and
          schedule delivery on your timeline.
        </p>
        <div className="grid gap-6 md:grid-cols-2 mt-16">
          <a href="tel:+15042057517" className="block bg-charcoal-light border border-white/10 rounded-2xl p-8 hover:border-amber transition-colors">
            <span className="overline text-amber">Call or Text</span>
            <p className="text-2xl font-bold mt-3">(504) 205-7517</p>
            <p className="text-white/60 mt-2">Mon-Sat, 8am-6pm</p>
          </a>
          <a href="mailto:hello@crescent-mobility.com" className="block bg-charcoal-light border border-white/10 rounded-2xl p-8 hover:border-amber transition-colors">
            <span className="overline text-amber">Email</span>
            <p className="text-2xl font-bold mt-3 break-all">hello@crescent-mobility.com</p>
            <p className="text-white/60 mt-2">We reply within one business day</p>
          </a>
        </div>
        <div className="mt-16 bg-charcoal-light border border-white/10 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-3">Serving the greater New Orleans area</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl">
            We deliver, set up, and remove ramps throughout the region. Ready to get
            started? Browse our ramps and reserve online, or give us a call and we'll
            handle the rest.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/ramps" className="btn-amber">Browse ramps</Link>
            <Link href="/how-it-works" className="btn-outline">How it works</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
