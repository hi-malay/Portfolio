// Every external URL the site points at, in one place.
//
// `vanity` renders in the UI; `canonical` goes in machine-readable metadata
// (JSON-LD sameAs, the markdown response, llms.txt) so crawlers resolve
// identity without following a redirect. `canonical: null` means vanity-only —
// no verified profile URL yet.

export const SITE = "https://malaymishra.com";
export const EMAIL = "hi.malay879@gmail.com";
export const RESUME = "https://cv.malaymishra.com";

// Google Calendar appointment schedule. The /u/0/ segment Google shows in your
// own address bar is an account index — it resolves against whichever Google
// account the *visitor* happens to have first, so it's left off here.
export const MEETING =
	"https://calendar.google.com/calendar/appointments/schedules/AcZssZ27N3UjChgP1G7QwFMv0pwpVRNMRnGYaKhy5jQcY23c82hZZ1QHRgilbs-ei9YwGZwx3QAdgHzX";

export interface SocialLink {
	canonical: string | null;
	platform: string;
	vanity: string;
}

export const social: SocialLink[] = [
	{ canonical: "https://linkedin.com/in/mmalay", platform: "linkedin", vanity: "https://in.malaymishra.com" },
	{ canonical: "https://github.com/hi-malay", platform: "github", vanity: "https://git.malaymishra.com" },
	{ canonical: "https://instagram.com/hi.malay.a", platform: "instagram", vanity: "https://ig.malaymishra.com" },
	{ canonical: null, platform: "x", vanity: "https://x.malaymishra.com" },
];

/** Profile URLs safe to hand a crawler — skips vanity-only entries. */
export const canonicalSocial = social.flatMap((s) => (s.canonical ? [s.canonical] : []));
