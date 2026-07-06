import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FALLBACKS = {
  'aluminum-folding-ramp-6ft':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=75',
  'threshold-ramp-2in':
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=75',
  'modular-ramp-system-10ft':
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75',
};
const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=75';

function imgFor(p) {
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0]) return p.images[0];
  return FALLBACKS[p.slug] || DEFAULT_IMG;
}

export default async function RampDetailPage({ params }) {
  const { slug } = params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) notFound();

  const specs = [
    ['Material', product.material],
    ['Length', product.length_in ? `${product.length_in} in` : null],
    ['Weight capacity', product.weight_capacity_lb ? `${product.weight_capacity_lb} lb` : null],
  ].filter(([, v]) => v);

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <section className="container-x pt-36 pb-24">
        <Link
          href="/ramps"
          className="nav-link mb-10 inline-flex items-center gap-2 text-sm text-white/60 hover:text-amber"
        >
          <span aria-hidden>&larr;</span> All ramps
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgFor(product)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="overline text-amber">Crescent Mobility</p>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight md:text-5xl">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="mt-4 text-lg text-white/70">{product.short_description}</p>
            )}

            {product.description && (
              <p className="mt-6 leading-relaxed text-white/60">{product.description}</p>
            )}

            {specs.length > 0 && (
              <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</dt>
                    <dd className="text-sm font-semibold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/book?slug=${product.slug}`} className="btn-amber">
                Rent this ramp
              </Link>
              <Link href="/how-it-works" className="btn-outline">
                How it works
              </Link>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
              Delivered, installed &amp; picked up
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
