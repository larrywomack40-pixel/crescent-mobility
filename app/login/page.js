'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (profile && profile.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <main className="min-h-screen bg-charcoal text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="overline text-amber">Crescent Mobility</Link>
          <h1 className="mt-4 font-jost text-4xl font-light">Welcome back</h1>
          <p className="mt-2 text-sm text-white/60">Sign in to manage your rentals.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="overline block mb-2 text-white/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal-light border border-white/15 rounded-none px-4 py-3 text-white focus:border-amber outline-none transition"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-amber w-full justify-center disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-white/60">
          New here?{' '}
          <Link href="/signup" className="text-amber hover:underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
