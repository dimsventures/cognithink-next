export interface Article {
  id: number
  slug: string
  title: string
  content: string
  badge: string | null
  description: string | null
  read_time: string | null
  urgensi: number
  is_published: boolean
  published_at: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: number
  email: string
  confirmed: boolean
  created_at: string
}

export interface ArticleView {
  id: number
  article_id: number
  ip_hash: string | null
  read_time_seconds: number | null
  created_at: string
}

export interface ArticleFormData {
  title: string
  slug: string
  content: string
  badge: string
  description: string
  read_time: string
  urgensi: number
  is_published: boolean
}
