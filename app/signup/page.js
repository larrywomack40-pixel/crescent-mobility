'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push('/dashboard');
    } else {
      setMessage('Check your email to confirm your account, then sign in.');
    }
  }

  return (
    <main className="min-h-screen bg-charcoal text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="overline text-amber">Crescent Mobility</Link>
          <h1 className="mt-4 font-jost text-4xl font-light">Create your account</h1>
          <p className="mt-2 text-sm text-white/60">Book ramps and track your rentals.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="overline block mb-2 text-white/70">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-charcoal-light border border-white/15 rounded-none px-4 py-3 text-white focus:border-amber outline-none transition"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="overline block mb-2 text-white/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal-light border border-white/15 rounded-none px-4 py-3 text-white focus:border-amber outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="overline block mb-2 text-white/70">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-charcoal-light border border-white/15 rounded-none px-4 py-3 text-white focus:border-amber outline-none transition"
              placeholder="(555) 555-5555"
            />
          </div>
          <div>
            <label className="overline block mb-2 text-white/70">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal-light border border-white/15 rounded-none px-4 py-3 text-white focus:border-amber outline-none transition"
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-amber">{message}</p>}
          <button type="submit" disabled={loading} className="btn-amber w-full justify-center disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link href="/login" className="text-amber hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
