import axios from "axios";
import * as cheerio from "cheerio";

export interface InternshipRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  postedDate: string;
  applicants: number;
  matchScore?: number;
  applyUrl?: string;
  source: string;
}

interface InternshipSearchParams {
  keyword?: string;
  location?: string;
  limit?: number;
}

const SCRAPE_TIMEOUT_MS = 12000;

const makeId = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const safeText = (value?: string): string => (value ?? "").trim();

const DEVELOPMENT_KEYWORDS = [
  "developer",
  "software",
  "web",
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "full stack",
  "full-stack",
  "react",
  "node",
  "javascript",
  "typescript",
  "python",
  "java",
  "artificial intelligence",
  "machine learning",
  "machine-learning",
  "ml",
  "api",
  "engineering",
  "sde",
];

const NON_TECH_DEVELOPMENT_PHRASES = [
  "business development",
  "sales development",
  "market development",
  "brand development",
  "partnership development",
];

const isDevelopmentInternship = (internship: InternshipRecord): boolean => {
  const haystack = `${internship.title} ${internship.skills.join(" ")}`.toLowerCase();

  if (NON_TECH_DEVELOPMENT_PHRASES.some((phrase) => haystack.includes(phrase))) {
    return false;
  }

  return DEVELOPMENT_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

const dedupeInternships = (
  internships: InternshipRecord[],
): InternshipRecord[] => {
  const seen = new Set<string>();
  const unique: InternshipRecord[] = [];

  for (const internship of internships) {
    const key =
      internship.applyUrl ?? `${internship.id}-${internship.location}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(internship);
  }

  return unique;
};

const normalize = (
  internship: InternshipRecord,
  params: InternshipSearchParams,
): InternshipRecord | null => {
  const keyword = safeText(params.keyword).toLowerCase();
  const location = safeText(params.location).toLowerCase();

  const matchesKeyword =
    !keyword ||
    internship.title.toLowerCase().includes(keyword) ||
    internship.company.toLowerCase().includes(keyword) ||
    internship.skills.some((skill) => skill.toLowerCase().includes(keyword));

  const matchesLocation =
    !location ||
    location === "all" ||
    internship.location.toLowerCase().includes(location);

  if (!matchesKeyword || !matchesLocation) {
    return null;
  }

  return internship;
};

const scrapeInternshalaPage = async (url: string): Promise<InternshipRecord[]> => {
  const { data } = await axios.get<string>(url, {
    timeout: SCRAPE_TIMEOUT_MS,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const $ = cheerio.load(data);
  const records: InternshipRecord[] = [];

  $(".individual_internship").each((_, el) => {
    const card = $(el);

    const title =
      safeText(card.find(".job-title-href").first().text()) ||
      safeText(card.find("h3").first().text());
    const company =
      safeText(card.find(".company-name").first().text()) ||
      "Unknown Company";
    const locationValues = card
      .find(".locations a, .location_link")
      .map((__, node) => safeText($(node).text()))
      .get()
      .filter(Boolean);
    const location =
      locationValues.length > 0 ? locationValues.join(", ") : "Remote";
    const stipend =
      safeText(card.find(".stipend").first().text()) || "Not disclosed";
    const duration =
      safeText(card.find(".other_detail_item .item_body").first().text()) ||
      "Not specified";
    const postedDate =
      safeText(card.find(".status-success").first().text()) ||
      safeText(card.find(".status-info").first().text()) ||
      "Recently posted";
    const skills = card
      .find(".round_tabs_container .round_tabs")
      .map((__, node) => safeText($(node).text()))
      .get()
      .filter(Boolean)
      .slice(0, 8);

    const href =
      card.find("a.job-title-href").attr("href") ??
      card.find("a.view_detail_button").attr("href");
    const applyUrl = href
      ? href.startsWith("http")
        ? href
        : `https://internshala.com${href}`
      : undefined;

    if (!title) {
      return;
    }

    const internship: InternshipRecord = {
      id: makeId(`${title}-${company}`),
      title,
      company,
      location,
      type: location.toLowerCase().includes("remote") ? "Remote" : "On-site",
      duration,
      stipend,
      skills,
      postedDate,
      applicants: 0,
      source: "internshala",
    };

    if (applyUrl) {
      internship.applyUrl = applyUrl;
    }

    records.push(internship);
  });

  return dedupeInternships(records);
};

const scrapeInternshala = async (): Promise<InternshipRecord[]> => {
  const urls = [
    "https://internshala.com/internships",
    "https://internshala.com/web-development-internship",
    "https://internshala.com/software-development-internship",
    "https://internshala.com/front-end-development-internship",
    "https://internshala.com/back-end-development-internship",
    "https://internshala.com/full-stack-development-internship",
  ];

  const settled = await Promise.allSettled(
    urls.map((url) => scrapeInternshalaPage(url)),
  );

  const combined: InternshipRecord[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") {
      combined.push(...result.value);
    }
  }

  return dedupeInternships(combined);
};

const fallbackInternships = (): InternshipRecord[] => [
  {
    id: "fallback-frontend-intern",
    title: "Frontend Developer Intern",
    company: "Sample Tech",
    location: "Remote",
    type: "Remote",
    duration: "3 months",
    stipend: "Not disclosed",
    skills: ["React", "TypeScript", "Tailwind"],
    postedDate: "Recently posted",
    applicants: 0,
    source: "fallback",
  },
];

export const internshipScraperService = {
  search: async (
    params: InternshipSearchParams,
  ): Promise<{ internships: InternshipRecord[]; sourceWarnings: string[] }> => {
    const warnings: string[] = [];
    const limit = Math.min(Math.max(params.limit ?? 25, 1), 100);

    let internships: InternshipRecord[] = [];

    try {
      internships = await scrapeInternshala();
      if (internships.length === 0) {
        warnings.push("No internships were parsed from Internshala right now.");
      }
    } catch (error) {
      console.error("Internshala scraping failed:", error);
      warnings.push("Internshala source is currently unavailable.");
    }

    if (internships.length === 0) {
      internships = fallbackInternships();
      warnings.push("Showing fallback data because no live listings were fetched.");
    }

    const filtered = dedupeInternships(internships)
      .map((item) => normalize(item, params))
      .filter((item): item is InternshipRecord => Boolean(item));

    // When no explicit keyword is provided, show development-focused roles first.
    const prioritized = params.keyword
      ? filtered
      : [
          ...filtered.filter((item) => isDevelopmentInternship(item)),
          ...filtered.filter((item) => !isDevelopmentInternship(item)),
        ];

    const limited = prioritized.slice(0, limit);

    return {
      internships: limited,
      sourceWarnings: warnings,
    };
  },
};
