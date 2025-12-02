import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const text = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ Checkout session completed:", event.data.object);
      break;
    case "payment_intent.succeeded":
      console.log("✅ Payment succeeded:", event.data.object);
      break;
    case "payment_intent.payment_failed":
      console.log("❌ Payment failed:", event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
