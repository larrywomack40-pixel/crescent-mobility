'use client';

import Link from 'next/link';

export default function SiteFooter() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="relative bg-charcoal-dark">
      <div className="h-3 w-full bg-amber" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 55%)' }} />
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
              Crescent<span className="text-amber">Mobility</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Dependable, ready-to-roll access ramps delivered, set up, and built to endure. Scooter rentals coming soon.
            </p>
          </div>
          <div>
            <p className="overline text-xs text-amber">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/ramps" className="hover:text-amber">Ramps</Link></li>
              <li><Link href="/how-it-works" className="hover:text-amber">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-amber">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="overline text-xs text-amber">Support</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-amber">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-amber">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Crescent Mobility. All rights reserved.</p>
          <button onClick={scrollTop} className="nav-link text-white/70 hover:text-amber">Back to top &uarr;</button>
        </div>
      </div>
    </footer>
  );
}
