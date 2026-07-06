import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Crescent Mobility | Ramp & Scooter Rentals',
  description: 'Dependable, ready-to-roll access ramps and mobility rentals. Delivered, set up, and built to endure.'
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold uppercase tracking-widest text-cream">
          Crescent<span className="text-gold">Mobility</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/ramps" className="font-display text-sm uppercase tracking-wide text-cream/80 hover:text-gold">Ramps</Link>
          <Link href="/how-it-works" className="font-display text-sm uppercase tracking-wide text-cream/80 hover:text-gold">How It Works</Link>
          <Link href="/about" className="font-display text-sm uppercase tracking-wide text-cream/80 hover:text-gold">About</Link>
        </nav>
        <Link href="/ramps" className="btn-gold text-sm">Rent a Ramp</Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark">
      <div className="container-x flex flex-col gap-4 py-10 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg uppercase tracking-widest text-cream">Crescent<span className="text-gold">Mobility</span></p>
        <p>&copy; {new Date().getFullYear()} Crescent Mobility. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
