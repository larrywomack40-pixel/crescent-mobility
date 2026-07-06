'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const DAILY_RATE_CENTS = 2500; // $25/day placeholder rate

export default function BookPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [ramps, setRamps] = useState([]);
  const [form, setForm] = useState({
    product_id: '',
    customer_name: '',
    customer_phone: '',
    delivery_city: '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      const { data: prof } = await supabase.from('profiles').select('full_name, phone').eq('id', user.id).single();
      const { data: rs } = await supabase.from('products').select('id, name').eq('status', 'active');
      setRamps(rs || []);
      setForm((f) => ({
        ...f,
        customer_name: prof?.full_name || '',
        customer_phone: prof?.phone || '',
        product_id: rs && rs[0] ? rs[0].id : '',
      }));
      setChecking(false);
    }
    init();
  }, [router]);

  function dayCount() {
    if (!form.start_date || !form.end_date) return 0;
    const a = new Date(form.start_date);
    const b = new Date(form.end_date);
    const d = Math.round((b - a) / 86400000) + 1;
    return d > 0 ? d : 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const days = dayCount();
    if (days < 1) { setError('Please choose a valid date range.'); return; }
    setLoading(true);

    const total = (days * DAILY_RATE_CENTS) / 100;
    const ramp = ramps.find((r) => r.id === form.product_id);

    const { data: booking, error: bErr } = await supabase.from('bookings').insert({
      user_id: user.id,
      product_id: form.product_id || null,
      customer_name: form.customer_name,
      customer_email: user.email,
      customer_phone: form.customer_phone,
      delivery_city: form.delivery_city,
      start_date: form.start_date,
      end_date: form.end_date,
      status: 'pending',
      total_amount: total,
    }).select().single();

    if (bErr) { setError('Could not save booking: ' + bErr.message); setLoading(false); return; }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rampName: ramp ? ramp.name : 'Ramp rental',
        days,
        dailyRate: DAILY_RATE_CENTS,
        customerEmail: user.email,
        bookingId: booking.id,
      }),
    });
    const out = await res.json();
    setLoading(false);
    if (out.url) {
      window.location.href = out.url;
    } else {
      setError(out.error || 'Checkout is not available yet. Your booking was saved as pending — we will confirm by email.');
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <p className="text-white/60">Loading…</p>
      </main>
    );
  }

  const days = dayCount();

  return (
    <main className="min-h-screen bg-charcoal text-white px-6 py-16">
      <div className="max-w-xl mx-auto">
        <p className="overline text-amber">Reserve</p>
        <h1 className="mt-2 font-jost text-4xl font-light">Book a ramp</h1>
        <p className="mt-2 text-sm text-white/60">Choose your ramp and dates. Delivery and setup included.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="overline block mb-2 text-white/70">Ramp</label>
            <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none">
              {ramps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="overline block mb-2 text-white/70">Start date</label>
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
            </div>
            <div>
              <label className="overline block mb-2 text-white/70">End date</label>
              <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
            </div>
          </div>
          <div>
            <label className="overline block mb-2 text-white/70">Name</label>
            <input type="text" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="overline block mb-2 text-white/70">Phone</label>
              <input type="tel" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
            </div>
            <div>
              <label className="overline block mb-2 text-white/70">Delivery city</label>
              <input type="text" value={form.delivery_city} onChange={(e) => setForm({ ...form, delivery_city: e.target.value })}
                className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
            </div>
          </div>

          <div className="border border-white/10 bg-charcoal-light p-4 flex items-center justify-between">
            <span className="text-white/70 text-sm">{days > 0 ? days + ' day(s) × $25' : 'Select dates'}</span>
            <span className="font-jost text-2xl text-amber">{days > 0 ? '$' + (days * 25) : '—'}</span>
          </div>

          {error && <p className="text-sm text-amber">{error}</p>}

          <button type="submit" disabled={loading} className="btn-amber w-full justify-center disabled:opacity-60">
            {loading ? 'Processing…' : 'Continue to payment'}
          </button>
          <p className="text-center text-xs text-white/40">
            <Link href="/dashboard" className="hover:text-amber">View my bookings</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
