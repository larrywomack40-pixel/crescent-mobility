'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const TABS = ['Overview', 'Media', 'Bookings', 'Customers', 'Banner', 'Analytics'];

const MEDIA_SLOTS = [
  { slot: 'hero_video', label: 'Home hero background', kind: 'video' },
  { slot: 'hero_image', label: 'Home hero fallback image', kind: 'image' },
  { slot: 'about_image', label: 'About / rich-text image', kind: 'image' },
  { slot: 'cta_image', label: 'CTA banner image', kind: 'image' },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="border border-white/10 bg-charcoal-light p-6">
      <p className="overline text-white/50">{label}</p>
      <p className="mt-3 font-jost text-4xl font-light text-amber">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState('Overview');

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [media, setMedia] = useState([]);
  const [banner, setBanner] = useState({ message: '', type: 'info', link_url: '', link_text: '', active: false });
  const [events, setEvents] = useState([]);

  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    const [bk, cu, md, bn, ev] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('site_media').select('*'),
      supabase.from('site_banner').select('*').eq('id', 1).single(),
      supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(500),
    ]);
    setBookings(bk.data || []);
    setCustomers(cu.data || []);
    setMedia(md.data || []);
    if (bn.data) setBanner(bn.data);
    setEvents(ev.data || []);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!prof || prof.role !== 'admin') { router.push('/dashboard'); return; }
      setAuthorized(true);
      await loadData();
      setLoading(false);
    }
    init();
  }, [router, loadData]);

  async function handleUpload(slotDef, file) {
    if (!file) return;
    setUploadingSlot(slotDef.slot);
    setNotice('');
    const ext = file.name.split('.').pop();
    const path = slotDef.slot + '-' + Date.now() + '.' + ext;
    const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (upErr) { setNotice('Upload failed: ' + upErr.message); setUploadingSlot(null); return; }
    const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: dbErr } = await supabase.from('site_media').upsert({
      slot: slotDef.slot,
      kind: slotDef.kind,
      storage_path: path,
      public_url: pub.publicUrl,
      title: file.name,
      uploaded_by: user.id,
    }, { onConflict: 'slot' });
    if (dbErr) { setNotice('Saved file but DB update failed: ' + dbErr.message); }
    else { setNotice(slotDef.label + ' updated.'); }
    setUploadingSlot(null);
    await loadData();
  }

  async function saveBanner() {
    setNotice('');
    const { error } = await supabase.from('site_banner').upsert({ id: 1, ...banner, updated_at: new Date().toISOString() });
    setNotice(error ? 'Banner save failed: ' + error.message : 'Banner saved.');
  }

  async function updateBookingStatus(id, status) {
    await supabase.from('bookings').update({ status }).eq('id', id);
    await loadData();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <p className="text-white/60">Loading admin…</p>
      </main>
    );
  }
  if (!authorized) return null;

  const mediaBySlot = Object.fromEntries(media.map((m) => [m.slot, m]));
  const pageViews = events.filter((e) => e.event_type === 'page_view').length;
  const topPages = Object.entries(
    events.reduce((acc, e) => { acc[e.page_path] = (acc[e.page_path] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topSources = Object.entries(
    events.reduce((acc, e) => { const k = e.referrer_domain || 'direct'; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="overline text-amber">Crescent Mobility</p>
          <h1 className="font-jost text-2xl font-light">Admin Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="btn-outline">View site</Link>
          <button onClick={signOut} className="btn-outline">Sign out</button>
        </div>
      </header>

      <nav className="px-6 border-b border-white/10 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={'py-4 px-4 text-sm uppercase tracking-widest transition ' + (tab === t ? 'text-amber border-b-2 border-amber' : 'text-white/50 hover:text-white')}
          >
            {t}
          </button>
        ))}
      </nav>

      {notice && (
        <div className="mx-6 mt-4 border border-amber/40 bg-amber/10 text-amber px-4 py-2 text-sm">{notice}</div>
      )}

      <div className="p-6 max-w-6xl">
        {tab === 'Overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total bookings" value={bookings.length} />
            <StatCard label="Pending" value={bookings.filter((b) => b.status === 'pending').length} hint="Need action" />
            <StatCard label="Customers" value={customers.filter((c) => c.role === 'customer').length} />
            <StatCard label="Page views" value={pageViews} hint="Last 500 events" />
          </div>
        )}

        {tab === 'Media' && (
          <div className="space-y-6">
            <p className="text-sm text-white/60 max-w-2xl">
              Upload images and videos, then assign them to a location on the site. The home page hero will use the uploaded video automatically.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {MEDIA_SLOTS.map((s) => {
                const current = mediaBySlot[s.slot];
                return (
                  <div key={s.slot} className="border border-white/10 bg-charcoal-light p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-jost text-lg">{s.label}</p>
                      <span className="overline text-white/40">{s.kind}</span>
                    </div>
                    {current ? (
                      current.kind === 'video' ? (
                        <video src={current.public_url} className="w-full h-40 object-cover mb-3" muted controls />
                      ) : (
                        <img src={current.public_url} alt={s.label} className="w-full h-40 object-cover mb-3" />
                      )
                    ) : (
                      <div className="w-full h-40 bg-charcoal-dark flex items-center justify-center text-white/30 mb-3 text-sm">
                        No {s.kind} set
                      </div>
                    )}
                    <label className="btn-outline cursor-pointer inline-flex">
                      {uploadingSlot === s.slot ? 'Uploading…' : (current ? 'Replace' : 'Upload')}
                      <input
                        type="file"
                        accept={s.kind === 'video' ? 'video/*' : 'image/*'}
                        className="hidden"
                        onChange={(e) => handleUpload(s, e.target.files[0])}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'Bookings' && (
          <div className="overflow-x-auto">
            {bookings.length === 0 ? (
              <p className="text-white/50">No bookings yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/50 overline border-b border-white/10">
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Dates</th>
                    <th className="py-3 pr-4">City</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">{b.customer_name}<br /><span className="text-white/40">{b.customer_email}</span></td>
                      <td className="py-3 pr-4">{b.start_date} → {b.end_date}</td>
                      <td className="py-3 pr-4">{b.delivery_city}</td>
                      <td className="py-3 pr-4">{b.status}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                          className="bg-charcoal border border-white/15 px-2 py-1 text-white"
                        >
                          {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'Customers' && (
          <div className="overflow-x-auto">
            {customers.length === 0 ? (
              <p className="text-white/50">No customers yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/50 overline border-b border-white/10">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">City</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">{c.full_name || '—'}</td>
                      <td className="py-3 pr-4">{c.email}</td>
                      <td className="py-3 pr-4">{c.phone || '—'}</td>
                      <td className="py-3 pr-4">{c.city || '—'}</td>
                      <td className="py-3 pr-4">{c.role}</td>
                      <td className="py-3 pr-4">{c.created_at ? c.created_at.slice(0, 10) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'Banner' && (
          <div className="max-w-xl space-y-5">
            <p className="text-sm text-white/60">Control the announcement bar shown at the top of the site.</p>
            <div>
              <label className="overline block mb-2 text-white/70">Message</label>
              <input value={banner.message || ''} onChange={(e) => setBanner({ ...banner, message: e.target.value })}
                className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="overline block mb-2 text-white/70">Link URL</label>
                <input value={banner.link_url || ''} onChange={(e) => setBanner({ ...banner, link_url: e.target.value })}
                  className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
              </div>
              <div>
                <label className="overline block mb-2 text-white/70">Link text</label>
                <input value={banner.link_text || ''} onChange={(e) => setBanner({ ...banner, link_text: e.target.value })}
                  className="w-full bg-charcoal-light border border-white/15 px-4 py-3 text-white focus:border-amber outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={!!banner.active} onChange={(e) => setBanner({ ...banner, active: e.target.checked })} />
              Show banner on site
            </label>
            <button onClick={saveBanner} className="btn-amber">Save banner</button>
          </div>
        )}

        {tab === 'Analytics' && (
          <div className="space-y-8">
            <p className="text-sm text-white/60 max-w-2xl">
              Privacy-friendly, aggregate analytics. We record page views, traffic sources, and device type — no IP addresses or personal identifiers are stored.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Page views" value={pageViews} />
              <StatCard label="Mobile" value={events.filter((e) => e.device_type === 'mobile').length} />
              <StatCard label="Desktop" value={events.filter((e) => e.device_type === 'desktop').length} />
              <StatCard label="Countries" value={new Set(events.map((e) => e.country).filter(Boolean)).size} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 bg-charcoal-light p-5">
                <p className="overline text-white/50 mb-4">Top pages</p>
                {topPages.length === 0 ? <p className="text-white/40 text-sm">No data yet.</p> : topPages.map(([p, n]) => (
                  <div key={p} className="flex justify-between py-1 text-sm"><span className="text-white/70">{p}</span><span className="text-amber">{n}</span></div>
                ))}
              </div>
              <div className="border border-white/10 bg-charcoal-light p-5">
                <p className="overline text-white/50 mb-4">Top sources</p>
                {topSources.length === 0 ? <p className="text-white/40 text-sm">No data yet.</p> : topSources.map(([p, n]) => (
                  <div key={p} className="flex justify-between py-1 text-sm"><span className="text-white/70">{p}</span><span className="text-amber">{n}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
