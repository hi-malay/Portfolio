import Landing from "@/components/landing/landing";
import { buildProfile, type RemoteExperience, type RemoteSkillGroup } from "@/data/profile";

const DATA_BASE = "https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main";

async function getData(): Promise<{ experiences: RemoteExperience[]; skills: RemoteSkillGroup[] }> {
  try {
    const [expRes, skillRes] = await Promise.all([
      fetch(`${DATA_BASE}/experience.json`, { next: { revalidate: 3600 } }),
      fetch(`${DATA_BASE}/skills.json`, { next: { revalidate: 3600 } }),
    ]);

    if (!expRes.ok || !skillRes.ok) {
      throw new Error(`portfolio-data responded ${expRes.status}/${skillRes.status}`);
    }

    const [experiences, skills] = await Promise.all([expRes.json(), skillRes.json()]);

    return {
      experiences: Array.isArray(experiences) ? experiences : [],
      skills: Array.isArray(skills) ? skills : [],
    };
  } catch (err) {
    // Degrade to the static profile block rather than failing the render.
    console.error("Failed to fetch portfolio data:", err);
    return { experiences: [], skills: [] };
  }
}

export default async function Page() {
  const { experiences, skills } = await getData();

  return <Landing profile={buildProfile(experiences, skills)} />;
}
