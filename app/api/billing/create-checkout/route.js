import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/app/utils/mongoose";
import User from "@/app/models/User";
import {
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

// Add this right after your imports
// const apiKey = process.env.LS_API_KEY;
// if (!apiKey) {
//   throw new Error('LemonSqueezy API key is not configured');
// }

// lemonSqueezySetup({ apiKey });

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.successUrl) {
      return NextResponse.json(
        { error: "Success URL is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const checkoutData = {
      variantId: Number(process.env.LS_VARIANT_ID),
      checkoutOptions: {
        success_url: body.successUrl,
        cancel_url: body.cancelUrl,
      },
      customerOptions: {
        email: user.email,
        name: user.name,
      },
      customData: {
        user_id: user._id.toString(),
      }
    };

    const checkout = await createCheckout(checkoutData);

    if (!checkout?.data?.attributes?.url) {
      return NextResponse.json(
        { error: "Invalid checkout response from LemonSqueezy" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkout.data.attributes.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout", details: error.message },
      { status: 500 }
    );
  }
}
