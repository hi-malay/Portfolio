import { siGithub, siInstagram, siX } from "simple-icons";

type P = { size?: number };

const stroke = (size: number, d: string) => (
	<svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width={size}>
		<path d={d} />
	</svg>
);

export const ArrowUpRight = ({ size = 18 }: P) => stroke(size, "M7 17 17 7M8 7h9v9");
export const ArrowUp = ({ size = 18 }: P) => stroke(size, "M12 19V5M5 12l7-7 7 7");
export const Close = ({ size = 22 }: P) => stroke(size, "M6 6l12 12M18 6 6 18");
export const Copy = ({ size = 20 }: P) => stroke(size, "M8 8h12v12H8zM16 8V4H4v12h4");
export const Moon = ({ size = 20 }: P) => stroke(size, "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z");
export const Sun = ({ size = 20 }: P) =>
	stroke(size, "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z");
export const FileText = ({ size = 20 }: P) => stroke(size, "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6");

// simple-icons dropped LinkedIn at LinkedIn's request, so its path lives here.
const LINKEDIN =
	"M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";

const BRAND: Record<string, { label: string; path: string }> = {
	github: { label: "GitHub", path: siGithub.path },
	instagram: { label: "Instagram", path: siInstagram.path },
	linkedin: { label: "LinkedIn", path: LINKEDIN },
	x: { label: "X", path: siX.path },
};

export const brandLabel = (platform: string) => BRAND[platform]?.label ?? platform;

export function Brand({ platform, size = 18 }: P & { platform: string }) {
	const icon = BRAND[platform];
	if (!icon) return null;
	return (
		<svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
			<path d={icon.path} />
		</svg>
	);
}
