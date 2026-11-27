import { NextResponse } from "next/server";
import { mailConfigured, sendEnquiryMail, type EnquiryMail } from "@/lib/mail";

export const runtime = "nodejs";

/*
 * Receives the Enquire popup and the offer popup, and emails each one to ENQUIRY_TO
 * through the Gmail SMTP settings in .env.local.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Could not read the form. Please try again." }, { status: 400 });
  }

  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const isOffer = body.type === "offer";
  const enquiry: EnquiryMail = {
    type: isOffer ? "offer" : "enquiry",
    piece: text(body.piece, 80),
    // Offer popup only: showroom visit slot and the categories they ticked.
    visitDate: text(body.visitDate, 10),
    visitTime: text(body.visitTime, 24),
    interests: Array.isArray(body.interests) ? body.interests.map((v) => text(v, 60)).filter(Boolean).slice(0, 10) : [],
    name: text(body.name, 80),
    phone: text(body.phone, 16),
    email: text(body.email, 120),
    message: text(body.message, 1000),
    receivedAt: new Date().toISOString(),
  };

  if (!isOffer && !enquiry.name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (enquiry.phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Please enter a 10-digit mobile number." }, { status: 400 });
  }
  if (isOffer && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(enquiry.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  console.log("[enquiry]", JSON.stringify(enquiry));

  if (!mailConfigured()) {
    console.error("[enquiry] mail is not configured: set SMTP_* and ENQUIRY_TO in .env.local");
    return NextResponse.json({ error: "Sorry, we could not send your details right now. Please call the showroom." }, { status: 500 });
  }
  try {
    await sendEnquiryMail(enquiry);
  } catch (err) {
    console.error("[enquiry] email failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Sorry, we could not send your details right now. Please try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
