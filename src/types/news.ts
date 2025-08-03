export interface NewsPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image_url?: string
  video_url?: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
  published_at?: string
  view_count?: number
}

export interface CreateNewsPost {
  title: string
  content: string
  excerpt?: string
  image_url?: string
  video_url?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface UpdateNewsPost {
  title?: string
  content?: string
  excerpt?: string
  image_url?: string
  video_url?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'archived'
}

export interface NewsFilters {
  tag?: string
  status?: 'draft' | 'published' | 'archived'
  author_id?: string
}