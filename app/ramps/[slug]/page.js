import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export const revalidate = 60;

async function getRamp(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, short_description, material, length_in, weight_capacity_lb, product_variants ( id, name, rental_rates ( period, price_cents, deposit_cents ) )')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

function money(cents) {
  return '$' + (cents / 100).toFixed(0);
}

export default async function RampDetailPage({ params }) {
  const ramp = await getRamp(params.slug);
  if (!ramp) notFound();

  const rates = ramp.product_variants?.[0]?.rental_rates || [];
  const order = { daily: 0, weekly: 1, monthly: 2 };
  rates.sort((a, b) => order[a.period] - order[b.period]);

  return (
    <div className="bg-navy-dark">
      <div className="container-x py-16">
        <Link href="/ramps" className="font-display text-sm uppercase tracking-wide text-cream/50 hover:text-gold">&larr; Back to Ramps</Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-tr from-navy-light to-navy" />

          <div>
            <h1 className="font-display text-4xl font-bold uppercase text-cream">{ramp.name}</h1>
            <p className="mt-4 text-lg text-cream/70">{ramp.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6 text-sm">
              <div><dt className="text-cream/40 uppercase tracking-wide">Material</dt><dd className="mt-1 text-cream">{ramp.material}</dd></div>
              <div><dt className="text-cream/40 uppercase tracking-wide">Length</dt><dd className="mt-1 text-cream">{ramp.length_in} in</dd></div>
              <div><dt className="text-cream/40 uppercase tracking-wide">Weight Capacity</dt><dd className="mt-1 text-cream">{ramp.weight_capacity_lb} lb</dd></div>
            </dl>

            <h2 className="mt-8 font-display text-xl uppercase tracking-wide text-gold">Rental Rates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {rates.map((rate) => (
                <div key={rate.period} className="rounded-xl border border-white/10 bg-navy-light/30 p-5 text-center">
                  <p className="font-display text-xs uppercase tracking-widest text-cream/50">{rate.period}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-cream">{money(rate.price_cents)}</p>
                  <p className="mt-1 text-xs text-cream/40">+ {money(rate.deposit_cents)} deposit</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/reserve?ramp=${ramp.slug}`} className="btn-gold">Reserve This Ramp</Link>
              <Link href="/how-it-works" className="btn-outline">How It Works</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
