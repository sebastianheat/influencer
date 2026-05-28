export type Platform = "instagram" | "tiktok" | "youtube" | "twitch";

export type CampaignStatus = "draft" | "active" | "review" | "completed";

export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "accepted"
  | "rejected";

export type CollabType = "ugc" | "post" | "reel" | "story" | "clip" | "affiliate";

/* Free-form niche label (Montu uses many categories). */
export type Niche = string;

export interface TopPost {
  caption: string;
  cover: string; // gradient class for the thumbnail
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  views: number;
  engagement: number; // %
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: Niche[];
  platforms: Platform[];
  followers: number;
  engagement: number; // %
  location: string;
  rating: number; // 0-5
  priceFrom: number; // por colaboración
  bio: string;
  verified: boolean;
  completedCampaigns: number;

  /* Montu-style fields */
  age: number | null;
  region: string | null;
  comuna: string | null;
  igFollowers: number | null;
  ttFollowers: number | null;
  reviewScore: number | null; // 0-5 or null when no reviews
  reach: number; // promedio
  audience: { male: number; female: number; other: number };
  topPosts: TopPost[];
}

export interface Campaign {
  id: string;
  title: string;
  brand: string;
  brandLogo: string;
  status: CampaignStatus;
  niche: Niche;
  collabTypes: CollabType[];
  platforms: Platform[];
  budget: number;
  payPerCreator: number;
  spots: number;
  filled: number;
  applicants: number;
  deadline: string; // ISO
  createdAt: string;
  cover: string; // gradient class
  brief: string;
  deliverables: string[];
  requirements: string[];
  minFollowers: number;
  tag: string; // "Orgánico", "Pagado", "Afiliación"
}

export type OdtStatus =
  | "pending_payment"
  | "paid"
  | "content_submitted"
  | "released"
  | "rejected";

export interface Application {
  id: string;
  campaignId: string;
  influencerId: string;
  status: ApplicationStatus;
  appliedAt: string;
  message: string;
  proposedRate: number;
  odtStatus?: OdtStatus | null;
  brandAmount?: number | null;
  creatorAmount?: number | null;
  contentUrl?: string | null;
  rejectionReason?: string | null;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "brand" | "creator" | "admin";
  joinedAt: string;
  status: "active" | "pending" | "suspended";
  avatar: string;
}
