import './globals.css';
import { Suspense } from 'react';
import Chrome from './components/Chrome';
import Analytics from './components/Analytics';

export const metadata = {
  title: 'Crescent Mobility | Ramp & Scooter Rentals',
  description: 'Dependable, ready-to-roll access ramps and mobility rentals. Delivered, set up, and built to endure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-charcoal text-white">
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
