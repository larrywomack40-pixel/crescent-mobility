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
    <section className="relative overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-light/40 via-navy to-navy-dark" />
      <div className="container-x relative grid gap-10 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <p className="mb-4 font-display text-sm uppercase tracking-[0.3em] text-gold">Ramp Rentals, Made Simple</p>
          <h1 className="font-display text-5xl font-bold uppercase leading-tight text-cream md:text-6xl">
            Access that's<br /><span className="text-gold">built to endure</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-cream/70">
            Sturdy, ready-to-roll ramps delivered and set up at your door. Rent by the day, week, or month.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/ramps" className="btn-gold">Browse Ramps</Link>
            <Link href="/how-it-works" className="btn-outline">How It Works</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-gradient-to-tr from-navy-light to-navy shadow-2xl" />
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
    <section className="border-y border-white/10 bg-navy">
      <div className="container-x grid gap-8 py-16 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-white/5 bg-navy-light/40 p-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-gold">{it.title}</h3>
            <p className="mt-3 text-cream/70">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function FeaturedRamps() {
  const ramps = await getFeaturedRamps();
  return (
    <section className="bg-navy-dark">
      <div className="container-x py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold uppercase text-cream md:text-4xl">Popular Ramps</h2>
          <Link href="/ramps" className="font-display text-sm uppercase tracking-wide text-gold hover:underline">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ramps.map((r) => (
            <Link key={r.id} href={`/ramps/${r.slug}`} className="group rounded-xl border border-white/10 bg-navy-light/30 p-6 transition hover:border-gold/60">
              <div className="mb-5 aspect-square rounded-lg bg-gradient-to-tr from-navy-light to-navy" />
              <h3 className="font-display text-lg uppercase tracking-wide text-cream group-hover:text-gold">{r.name}</h3>
              <p className="mt-2 text-sm text-cream/60">{r.short_description}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-cream/40">Up to {r.weight_capacity_lb} lb</p>
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
      <FeaturedRamps />
    </>
  );
}
