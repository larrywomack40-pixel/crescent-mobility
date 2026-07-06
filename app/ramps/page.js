import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export const revalidate = 60;

export const metadata = {
  title: 'Ramps | Crescent Mobility',
  description: 'Browse our full range of rental access ramps.'
};

async function getRamps() {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, short_description, material, length_in, weight_capacity_lb')
    .eq('status', 'active')
    .order('name');
  if (error) return [];
  return data || [];
}

export default async function RampsPage() {
  const ramps = await getRamps();
  return (
    <div className="bg-navy-dark">
      <div className="container-x py-16">
        <p className="mb-3 font-display text-sm uppercase tracking-[0.3em] text-gold">Rental Catalog</p>
        <h1 className="font-display text-4xl font-bold uppercase text-cream md:text-5xl">Access Ramps</h1>
        <p className="mt-4 max-w-xl text-cream/70">
          Every ramp is inspected, rated, and ready to roll. Pick the size that fits, and we'll handle delivery and setup.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ramps.length === 0 && (
            <p className="text-cream/50">No ramps available right now. Check back soon.</p>
          )}
          {ramps.map((r) => (
            <Link key={r.id} href={`/ramps/${r.slug}`} className="group flex flex-col rounded-xl border border-white/10 bg-navy-light/30 p-6 transition hover:border-gold/60">
              <div className="mb-5 aspect-square rounded-lg bg-gradient-to-tr from-navy-light to-navy" />
              <h2 className="font-display text-lg uppercase tracking-wide text-cream group-hover:text-gold">{r.name}</h2>
              <p className="mt-2 flex-1 text-sm text-cream/60">{r.short_description}</p>
              <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-wide text-cream/40">
                <span>{r.material}</span>
                <span>Up to {r.weight_capacity_lb} lb</span>
              </div>
              <span className="mt-5 inline-block font-display text-sm uppercase tracking-wide text-gold">View & Rent &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
