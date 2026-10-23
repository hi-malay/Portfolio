import { DATA_BASE } from "@/data/links";

// PDF lives in portfolio-data so a resume update skips a redeploy.
export const revalidate = 300;

export async function GET() {
  const res = await fetch(`${DATA_BASE}/Malay-Mishra-Resume.pdf`, { next: { revalidate: 300 } });
  if (!res.ok) return new Response("Resume not found", { status: 404 });

  return new Response(await res.arrayBuffer(), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="Malay-Mishra-Resume.pdf"',
    },
  });
}
