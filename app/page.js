import Link from 'next/link';
import { supabase } from '../lib/supabase';

export const revalidate = 60;

async function getFeaturedRamps() {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, short_description, length_in, weight_capacity_lb')
    .eq('status', 'active')
    .limit(3);
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

function ValueProps() {
  const items = [
    { title: 'Delivered & Set Up', body: 'We bring it, place it, and make sure it fits your space.' },
    { title: 'Flexible Rentals', body: 'Daily, weekly, or monthly terms with no long-term lock-in.' },
    { title: 'Rated & Reliable', body: 'Every ramp is inspected and rated for safe weight capacity.' }
  ];
  return (
    <section className="bg-charcoal">
      <div className="container-x grid gap-8 py-20 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-white/10 bg-charcoal-light p-8">
            <div className="mb-5 h-1 w-12 bg-amber" />
            <h3 className="text-xl font-semibold uppercase tracking-wide text-white">{it.title}</h3>
            <p className="mt-3 text-white/60">{it.body}</p>
          </div>
        ))}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ramps.map((r) => (
            <Link
              key={r.id}
              href={`/ramps/${r.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light transition hover:border-amber/60"
            >
              <div className="aspect-square bg-gradient-to-tr from-charcoal to-charcoal-light" />
              <div className="p-6">
                <h3 className="text-lg font-semibold uppercase tracking-wide text-white group-hover:text-amber">{r.name}</h3>
                <p className="mt-2 text-sm text-white/55">{r.short_description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Up to {r.weight_capacity_lb} lb</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Marquee />
      <FeaturedRamps />
    </>
  );
}
