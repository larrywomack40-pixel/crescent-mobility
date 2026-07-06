import Link from 'next/link';
import { supabase } from '../lib/supabase';

export const revalidate = 60;

async function getFeaturedRamps() {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, short_description, length_in, weight_capacity_lb')
    .eq('status', 'active')
    .limit(4);
  if (error) return [];
  return data || [];
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/30" />
      <div className="container-x relative z-10 pt-28">
        <div className="max-w-2xl">
          <p className="overline text-2xl text-white">Ramp Rentals, Made Simple</p>
          <h1 className="mt-6 text-5xl font-semibold uppercase leading-[1.05] tracking-wide text-white md:text-7xl">
            Access that&rsquo;s built to endure
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/75">
            Sturdy, ready-to-roll ramps delivered and set up at your door. Rent by the day, week, or month.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/ramps" className="btn-amber">Browse Ramps</Link>
            <Link href="/how-it-works" className="btn-outline text-white hover:text-charcoal">How It Works</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTiles() {
  const tiles = [
    { title: 'Folding Ramps', href: '/ramps?type=folding', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
    { title: 'Threshold Ramps', href: '/ramps?type=threshold', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
    { title: 'Modular Systems', href: '/ramps?type=modular', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80' },
    { title: 'Accessories', href: '/ramps?type=accessories', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' }
  ];
  return (
    <section className="bg-charcoal">
      <div className="container-x grid gap-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="group relative flex h-96 items-end overflow-hidden rounded-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${t.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
            <div className="relative flex w-full items-center justify-between p-6">
              <span className="text-lg font-semibold uppercase tracking-wide text-white">{t.title}</span>
              <span className="text-amber transition group-hover:translate-x-1">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RichText() {
  return (
    <section className="bg-charcoal">
      <div className="container-x grid gap-10 border-t border-white/10 py-20 md:grid-cols-2 md:items-center">
        <h2 className="text-3xl font-semibold leading-snug text-white md:text-4xl">
          High-quality access equipment for everyday independence. Delivered, installed, and{' '}
          <span className="text-amber underline">built to endure</span>.
        </h2>
        <div className="flex flex-col gap-4 md:items-end">
          <Link href="/how-it-works" className="btn-amber w-full max-w-xs justify-center md:w-auto">How It Works</Link>
          <Link href="/about" className="btn-outline w-full max-w-xs justify-center md:w-auto">About Us</Link>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Delivered', 'Elegant', 'Built to endure', 'Ready to roll'];
  const strip = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-amber py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {strip.map((t, i) => (
          <span key={i} className="mx-6 text-sm font-semibold uppercase tracking-[0.3em] text-charcoal">
            {t} <span className="mx-6">&#9734;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

async function FeaturedRamps() {
  const ramps = await getFeaturedRamps();
  return (
    <section className="bg-charcoal-dark">
      <div className="container-x py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="overline text-sm text-amber">Our Lineup</p>
            <h2 className="mt-3 text-4xl font-semibold uppercase tracking-wide text-white">Popular Ramps</h2>
          </div>
          <Link href="/ramps" className="nav-link text-amber hover:underline">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ramps.map((r, i) => (
            <Link
              key={r.id}
              href={`/ramps/${r.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light transition hover:border-amber/60"
            >
              {i === 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-amber px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal">
                  Popular
                </span>
              )}
              <div className="aspect-square bg-gradient-to-tr from-charcoal to-charcoal-light" />
              <div className="p-6">
                <h3 className="text-lg font-semibold uppercase tracking-wide text-white group-hover:text-amber">{r.name}</h3>
                <p className="mt-2 text-sm text-white/55">{r.short_description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Up to {r.weight_capacity_lb} lb &middot; {r.length_in}&quot;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AmberCTA() {
  return (
    <section className="relative bg-amber">
      <div
        className="absolute -top-8 left-0 h-8 w-full bg-charcoal-dark"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="container-x grid gap-8 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="overline text-sm text-charcoal/70">Ready when you are</p>
          <h2 className="mt-3 text-4xl font-semibold uppercase leading-tight tracking-wide text-charcoal md:text-5xl">
            Get a ramp delivered this week
          </h2>
          <p className="mt-4 max-w-md text-charcoal/80">
            Tell us your space and timeline. We handle delivery, setup, and pickup so you can focus on what matters.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          <Link
            href="/ramps"
            className="inline-flex items-center justify-center rounded-full bg-charcoal px-8 py-3 font-semibold uppercase tracking-wider text-white transition hover:bg-charcoal-dark"
          >
            Browse Ramps
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-charcoal px-8 py-3 font-semibold uppercase tracking-wider text-charcoal transition hover:bg-charcoal hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <RichText />
      <Marquee />
      <FeaturedRamps />
      <AmberCTA />
    </>
  );
}
