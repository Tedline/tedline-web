import type { Teacher } from './teacher'
import type { Institute } from './Institute'
import type { Session } from './session'

export interface CourseListItem {
  id: number
  title: string
  progress_percent: string
  registered: string
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