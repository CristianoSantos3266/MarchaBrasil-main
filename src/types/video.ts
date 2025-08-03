export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  uploadedAt: string;
  protestId?: string; // Optional link to protest event
  protestTitle?: string;
  city: string;
  state: string;
  country: string;
  uploaderName?: string; // Anonymous by default
  status: VideoStatus;
  moderationNote?: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  isLive?: boolean;
  liveStreamUrl?: string;
  // YouTube integration
  isYouTube?: boolean;
  youtubeId?: string;
  originalYoutubeUrl?: string;
  source: 'upload' | 'youtube';
}

export type VideoStatus = 
  | 'pending'     // Waiting for moderation
  | 'approved'    // Available to public
  | 'rejected'    // Rejected by moderators
  | 'reported';   // Reported by users, needs review

export interface VideoUploadData {
  title: string;
  description: string;
  videoFile: File;
  thumbnailFile?: File;
  protestId?: string;
  city: string;
  state: string;
  tags: string[];
  uploaderName?: string;
}

export interface VideoModerationAction {
  videoId: string;
  action: 'approve' | 'reject' | 'request_changes';
  moderatorNote?: string;
  moderatorId: string;
  timestamp: string;
}

export interface VideoSearchFilters {
  state?: string;
  city?: string;
  protestId?: string;
  status?: VideoStatus;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  searchQuery?: string;
}