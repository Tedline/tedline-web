# Student Learning Progress & Analytics Dashboard Design Specification

- **Date**: 2026-09-18
- **Route**: `/dashboard/reports`
- **Layout**: `dashboard`
- **Status**: Approved by User

---

## 1. Overview & Context

The backend implements a learning analytics endpoint (`GET /api/course/dashboard/learning-stats/`) that records timestamped student progress across course boxes (video, audio, file downloads, and quizzes). This specification describes the frontend architecture, components, and data visualizations for the student learning analytics dashboard in `tedline-web`.

The dashboard is accessible to authenticated users via the "Reports" navigation button in `components/layout/Slideshow.vue` (and mobile bottom navigation), styled in harmony with Tedline's modern dark/light UI design system.

---

## 2. Architecture & Component Structure

### 2.1 File Structure
```
pages/
└── dashboard/
    └── reports.vue                          # Main page orchestrator: auth guard, API fetch, layout & state
components/
└── dashboard/
    └── reports/
        ├── TimeframeFilter.vue              # Lookback selector (30, 90, 180, 365 days)
        ├── OverallCompletionCard.vue        # Gauge / Radial bar + lesson & course completion KPIs
        ├── ContentTypeDistributionCard.vue  # Donut chart + progress bars for Video, Audio, File, Quiz
        ├── StudyActivityHeatmap.vue         # GitHub-style daily activity grid with Jalali/RTL tooltips
        ├── LearningVelocityCard.vue         # Cumulative velocity area chart + daily completion bars
        └── ReportsSkeleton.vue              # Clean placeholder skeleton matching layout
plugins/
└── apexcharts.client.ts                     # Nuxt client-only registration for vue3-apexcharts
```

### 2.2 Navigation Integration
- **`components/layout/Slideshow.vue`**:
  - Update `Reports` navigation item: `{ name: 'Reports', href: '/dashboard/reports', icon: ChartPieIcon, current: false }`.
  - Active state matches `/dashboard/reports` route.
- **`components/layout/BottomNavigation.vue`**:
  - Keep responsive layout compatible; ensure bottom bar doesn't obstruct dashboard charts on mobile.

---

## 3. Data Contracts & TypeScript Interfaces

```typescript
export interface ContentTypeStat {
  completed: number
  total: number
  percent: number // e.g. 75.0
}

export interface ContentTypeDistribution {
  video: ContentTypeStat
  audio: ContentTypeStat
  file: ContentTypeStat
  quiz: ContentTypeStat
}

export interface OverallCompletion {
  total_enrolled_courses: number
  completed_courses: number
  in_progress_courses: number
  total_boxes: number
  completed_boxes: number
  overall_percentage: number // e.g. 63.3
}

export interface LearningVelocityItem {
  date: string // ISO date format "YYYY-MM-DD"
  daily_completed: number
  cumulative_completed: number
}

export interface LearningDashboardStatsResponse {
  overall_completion: OverallCompletion
  content_type_distribution: ContentTypeDistribution
  activity_heatmap: Record<string, number> // e.g. { "2026-09-10": 2, "2026-09-11": 5 }
  learning_velocity: LearningVelocityItem[]
}
```

---

## 4. Detailed Component & Chart Specifications

### 4.1 Page Orchestrator (`pages/dashboard/reports.vue`)
- **Layout**: `definePageMeta({ layout: 'dashboard' })`.
- **Authentication Guard**:
  - Checks `userStore.isAuthenticated`. If false, redirects to `/auth/signIn?redirect=/dashboard/reports`.
- **Data Fetching**:
  - Uses `useApi(true)` calling `course/dashboard/learning-stats/?days=${days}`.
  - Reactive fetch triggered when `selectedDays` changes.
- **Client-Side Wrapping**:
  - Wrapped inside `<ClientOnly>` to ensure chart rendering occurs safely in the browser.

### 4.2 Timeframe Filter (`TimeframeFilter.vue`)
- **Options**:
  - 30 Days (`30`)
  - 90 Days (`90`)
  - 180 Days (`180`)
  - 1 Year (`365`) - default
- **Styling**: Pill button group with active background highlight (`bg-blue-600 text-white` vs `text-gray-600 dark:text-gray-300`). Emits `update:modelValue`.

### 4.3 Overall Completion Card (`OverallCompletionCard.vue`)
- **Data**: `overall_completion`
- **Visuals**:
  - **Radial Bar / Semi-Circle Gauge**: ApexCharts RadialBar showing `overall_percentage` with vibrant gradient (e.g. `#3b82f6` to `#10b981`).
  - **KPI Metrics Grid**:
    - Finished Courses: `completed_courses / total_enrolled_courses`
    - In-Progress Courses: `in_progress_courses`
    - Lessons Finished: `completed_boxes / total_boxes`
- **Visual Style**: Rounded card (`rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6`).

### 4.4 Content-Type Distribution Card (`ContentTypeDistributionCard.vue`)
- **Data**: `content_type_distribution`
- **Visuals**:
  - **Donut Chart**: Proportion of completed items by category:
    - 🎥 Video (`#3b82f6` - Blue)
    - 🎧 Audio (`#8b5cf6` - Purple)
    - 📄 File (`#f59e0b` - Amber)
    - 📝 Quiz (`#10b981` - Emerald)
  - **Detailed Media Cards**:
    - Each media type displays icon, title, completed / total ratio, percentage, and a mini progress bar.

### 4.5 Study Activity Heatmap (`StudyActivityHeatmap.vue`)
- **Data**: `activity_heatmap` (`Record<string, number>`)
- **Implementation**: Native responsive Vue / Tailwind grid (columns = weeks, rows = 7 days).
- **Color Scale**:
  - 0 completions: `bg-gray-100 dark:bg-white/5`
  - 1–2 completions: `bg-emerald-200 dark:bg-emerald-900/70`
  - 3–5 completions: `bg-emerald-400 dark:bg-emerald-600`
  - 6+ completions: `bg-emerald-600 dark:bg-emerald-400`
- **Features**:
  - Jalali date formatting via `moment-jalaali` for `fa` locale and Gregorian for `en`.
  - Floating hover tooltip showing: *`"{count} فعالیت در تاریخ {date} تکمیل شد"`*.
  - Month indicators across the top and day initials (ش, ی, د... / S, M, T...) on the side.
  - Less-to-More legend at the bottom.

### 4.6 Learning Velocity Card (`LearningVelocityCard.vue`)
- **Data**: `learning_velocity` (`LearningVelocityItem[]`)
- **Visuals**:
  - ApexCharts Mixed / Area Chart:
    - Area line: `cumulative_completed` with smooth spline curve and soft gradient fill under the line.
    - Bar or dashed line: `daily_completed` showcasing study spikes.
  - Time axis with localized date labels.
  - Theme-aware grid lines, tooltip styling, and typography matching Tedline IRANSansX.

---

## 5. UI/UX States & Error Handling

1. **Loading State (`ReportsSkeleton.vue`)**:
   - Matches the exact dimensions and grid layout of the 4 cards.
   - Smooth animated pulse prevents CLS (Cumulative Layout Shift).
2. **Empty State**:
   - Condition: `overall_completion.total_enrolled_courses === 0` or `overall_completion.completed_boxes === 0`.
   - Card with friendly illustration/icon, encouraging title and copy.
   - Action button linking to `/explore` (کاوش دوره‌ها / Explore Courses).
3. **Error State**:
   - Graceful alert banner with error message and a "تلاش مجدد" (Retry) button.

---

## 6. Localization & RTL

All user-visible text is keyed into `locales/fa.json` and `locales/en.json` under `reports`:
- Header, subtitle, and breadcrumb/badge.
- Timeframe labels (30 روز, 90 روز, 180 روز, 1 سال).
- KPI descriptions and media type labels.
- Heatmap tooltip templates and legend texts.
- Empty and error state texts.
- RTL alignment for grid, card items, and chart tooltips.
