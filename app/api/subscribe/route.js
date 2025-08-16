// app/api/subscribe/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, firstName, tags = [] } = await req.json();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID; // create an Audience in Resend & copy its ID

    if (!RESEND_API_KEY || !AUDIENCE_ID) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    // Create/add contact to your Resend Audience with tags
    const res = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: firstName || undefined,
        unsubscribed: false,
        tags: tags.length > 0 ? tags : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || "Failed to add contact." }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
