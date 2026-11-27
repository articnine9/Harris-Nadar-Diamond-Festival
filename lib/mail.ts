import nodemailer from "nodemailer";

/** Gmail SMTP, configured in .env.local (see .env.example). Server-side only: never import from a client component. */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // STARTTLS on 587
  requireTLS: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ENQUIRY_TO);

export type EnquiryMail = {
  type: "offer" | "enquiry";
  piece: string;
  visitDate: string;
  visitTime: string;
  interests: string[];
  name: string;
  phone: string;
  email: string;
  message: string;
  receivedAt: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const prettyDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

export async function sendEnquiryMail(e: EnquiryMail) {
  const isOffer = e.type === "offer";
  const subject = oneLine(isOffer
    ? `Festival offer: ${e.phone}${e.email ? ` · ${e.email}` : ""}`
    : `Enquiry: ${e.piece} · ${e.name}`);

  const rows: [string, string][] = [
    ...(e.name ? [["Name", e.name] as [string, string]] : []),
    ["Mobile", e.phone],
    ...(e.email ? [["Email", e.email] as [string, string]] : []),
    ...(!isOffer ? [["Piece", e.piece] as [string, string]] : []),
    ...(e.visitDate ? [["Visit date", prettyDate(e.visitDate)] as [string, string]] : []),
    ...(e.visitTime ? [["Visit time", e.visitTime] as [string, string]] : []),
    ...(e.interests.length ? [["Interested in", e.interests.join(", ")] as [string, string]] : []),
    ...(e.message ? [["Message", e.message] as [string, string]] : []),
    ["Received", new Date(e.receivedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
  ];

  const text = [isOffer ? "New festival offer request" : "New product enquiry", "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d1a17">
  <h2 style="margin:0 0 12px;font-weight:normal;color:#8c1d2c">${isOffer ? "New festival offer request" : "New product enquiry"}</h2>
  <table cellpadding="8" style="border-collapse:collapse">
    ${rows.map(([k, v]) => `<tr><td style="color:#6a625a;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee">${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}
  </table>
  <p style="color:#6a625a;font-size:12px">Sent from the Diamond Festival website.</p>
</div>`;

  const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(e.email) ? e.email : undefined;

  await transporter.sendMail({
    from: { name: "Diamond Festival Website", address: process.env.SMTP_USER! },
    to: process.env.ENQUIRY_TO,
    replyTo: validEmail,
    subject,
    text,
    html,
  });
}
