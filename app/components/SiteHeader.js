'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const ANNOUNCEMENTS = [
  'Free delivery & setup on every ramp rental',
  'Flexible daily, weekly & monthly terms',
  'Ramps inspected & rated for safe weight capacity'
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [msg, setMsg] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="bg-amber text-center text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
        <div className="container-x py-2">{ANNOUNCEMENTS[msg]}</div>
      </div>
      <header className={`transition-colors duration-300 ${scrolled ? 'bg-charcoal/95 shadow-lg backdrop-blur' : 'bg-transparent'}`}>
        <div className="container-x flex h-20 items-center justify-between">
          <Link href="/" className="text-xl font-bold uppercase tracking-[0.2em] text-white">
            Crescent<span className="text-amber">Mobility</span>
          </Link>
          <nav className="hidden items-center gap-9 md:flex">
            <Link href="/ramps" className="nav-link text-white hover:text-amber">Ramps</Link>
            <Link href="/how-it-works" className="nav-link text-white hover:text-amber">How It Works</Link>
            <Link href="/about" className="nav-link text-white hover:text-amber">About</Link>
          </nav>
          <Link href="/ramps" className="btn-amber text-xs">Rent a Ramp</Link>
        </div>
      </header>
    </div>
  );
}
