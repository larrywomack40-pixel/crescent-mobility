'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const STATUS_STYLES = {
  pending: 'bg-amber/20 text-amber',
  confirmed: 'bg-blue-500/20 text-blue-300',
  active: 'bg-green-500/20 text-green-300',
  completed: 'bg-white/10 text-white/60',
  cancelled: 'bg-red-500/20 text-red-300',
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (prof && prof.role === 'admin') {
        router.push('/admin');
        return;
      }
      setProfile(prof || { email: user.email });
      const { data: bks } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookings(bks || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <p className="text-white/60">Loading your dashboard…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="overline text-amber">My Account</p>
            <h1 className="mt-2 font-jost text-4xl font-light">
              Welcome{profile?.full_name ? ', ' + profile.full_name : ''}
            </h1>
            <p className="mt-1 text-sm text-white/60">{profile?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/ramps" className="btn-amber">Browse ramps</Link>
            <button onClick={signOut} className="btn-outline">Sign out</button>
          </div>
        </div>

        <section>
          <h2 className="overline text-white/70 mb-5">Your rentals</h2>
          {bookings.length === 0 ? (
            <div className="border border-white/10 bg-charcoal-light p-10 text-center">
              <p className="text-white/60">You have no rentals yet.</p>
              <Link href="/ramps" className="btn-amber mt-5 inline-flex">Find a ramp</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border border-white/10 bg-charcoal-light p-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-jost text-lg">{b.customer_name || 'Rental'}</p>
                    <p className="text-sm text-white/60">
                      {b.start_date} → {b.end_date} · {b.delivery_city || 'Pickup'}
                    </p>
                  </div>
                  <span className={'px-3 py-1 text-xs uppercase tracking-widest ' + (STATUS_STYLES[b.status] || 'bg-white/10 text-white/60')}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
