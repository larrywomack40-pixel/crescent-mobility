import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY in your environment variables.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  try {
    const body = await request.json();
    const {
      rampName = 'Ramp rental',
      days = 1,
      dailyRate = 2500,
      customerEmail,
      bookingId,
    } = body;

    const origin = request.headers.get('origin') || 'https://crescent-mobility.vercel.app';
    const quantity = Math.max(1, parseInt(days, 10) || 1);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: rampName + ' (rental)' },
            unit_amount: parseInt(dailyRate, 10) || 2500,
          },
          quantity,
        },
      ],
      metadata: { bookingId: bookingId || '' },
      success_url: origin + '/dashboard?checkout=success',
      cancel_url: origin + '/ramps?checkout=cancelled',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
