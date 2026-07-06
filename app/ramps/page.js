import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Licensed Unsplash fallbacks (free to use) keyed by slug, with a generic default.
const FALLBACKS = {
  'aluminum-folding-ramp-6ft':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=70',
  'threshold-ramp-2in':
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=70',
  'modular-ramp-system-10ft':
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=70',
};
const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=70';

function imgFor(p) {
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0]) return p.images[0];
  return FALLBACKS[p.slug] || DEFAULT_IMG;
}

export default async function RampsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at');

  const list = products || [];

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <section className="container-x pt-36 pb-16">
        <p className="overline text-amber">Crescent Mobility</p>
        <h1 className="mt-4 text-5xl font-bold uppercase tracking-tight md:text-6xl">
          Access Ramps
        </h1>
        <p className="mt-4 max-w-xl text-white/70">
          Every ramp is inspected, rated, and ready to roll. Pick the size that fits, and we&apos;ll
          handle delivery and setup.
        </p>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/ramps/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light transition hover:border-amber/60 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgFor(p)}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-lg font-semibold uppercase tracking-wide text-white group-hover:text-amber">
                  {p.name}
                </h2>
                {p.short_description && (
                  <p className="mt-2 text-sm text-white/60">{p.short_description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-6 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span>{p.material}</span>
                  {p.weight_capacity_lb && <span>Up to {p.weight_capacity_lb} lb</span>}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber">
                  View details
                  <span aria-hidden className="transition group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {list.length === 0 && (
          <p className="text-white/60">No ramps available right now. Check back soon.</p>
        )}
      </section>
    </main>
  );
}
