export type Platform = "instagram" | "tiktok" | "youtube" | "twitch";

export type CampaignStatus = "draft" | "active" | "review" | "completed";

export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "accepted"
  | "rejected";

export type CollabType = "ugc" | "post" | "reel" | "story" | "clip" | "affiliate";

export type Niche =
  | "Moda"
  | "Belleza"
  | "Fitness"
  | "Gaming"
  | "Tecnología"
  | "Comida"
  | "Viajes"
  | "Lifestyle"
  | "Finanzas"
  | "Música";

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
}

export interface Application {
  id: string;
  campaignId: string;
  influencerId: string;
  status: ApplicationStatus;
  appliedAt: string;
  message: string;
  proposedRate: number;
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
