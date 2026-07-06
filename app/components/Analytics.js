'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';

// Privacy-friendly, aggregate analytics.
// We record page path, referrer domain, and device type only.
// No IP addresses, cookies, or personal identifiers are stored.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    let referrerDomain = null;
    try {
      if (document.referrer) {
        const u = new URL(document.referrer);
        if (u.hostname !== window.location.hostname) {
          referrerDomain = u.hostname;
        }
      }
    } catch (e) {}
    const deviceType = window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';

    supabase.from('analytics_events').insert({
      event_type: 'page_view',
      page_path: pathname,
      referrer_domain: referrerDomain,
      device_type: deviceType,
    }).then(() => {}, () => {});
  }, [pathname]);

  return null;
}
