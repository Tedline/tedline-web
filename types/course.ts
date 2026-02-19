import type { Teacher } from './teacher'
import type { Institute } from './Institute'
import type { Session } from './session'

export interface CourseListItem {
  id: number
  title: string
  progress_percent: string
  registered: boolean | string
  description: string
  price: number
  discount: number | null
  duration: number
  image: string
  is_finished: boolean | null
  is_published: boolean | null
  teacher: Teacher
  institute: Institute
  session: Session[]
}

export interface CourseDetail extends CourseListItem {
  skill: Skill[]
  teachers: Teacher[]
  prerequisite: CourseListItem[]
  registered: boolean
}

export interface Skill {
  id: number
  title: string
}

export interface DiscountCode {
  valid: boolean
  is_percentage: boolean
  amount: number
}

export interface Category {
  id: number
  title: string
}