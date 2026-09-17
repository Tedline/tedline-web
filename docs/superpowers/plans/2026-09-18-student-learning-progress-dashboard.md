# Student Learning Progress Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, dark-mode and RTL-compatible Student Learning Progress Dashboard at `/dashboard/reports` featuring 4 interactive charts (Overall Completion gauge, Content-Type breakdown, GitHub-style Activity Heatmap, and Learning Velocity curve), lookback timeframe filtering, and seamless navigation integration.

**Architecture:** A page orchestrator (`pages/dashboard/reports.vue`) manages authentication checks and API interactions with `/api/course/dashboard/learning-stats/?days=`, delegating presentation to 5 focused components in `components/dashboard/reports/`. ApexCharts (`vue3-apexcharts`) powers numerical visualizations inside `<ClientOnly>`, while a native responsive Vue/Tailwind grid handles the daily activity heatmap with Jalali date tooltips.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS v4, `@nuxt/ui` v3, `apexcharts`, `vue3-apexcharts`, `moment-jalaali`, `@nuxtjs/i18n`.

**Spec:** `docs/superpowers/specs/2026-09-18-student-learning-progress-dashboard-design.md`

## Global Constraints

- **Route**: `/dashboard/reports`
- **Layout**: `layout: 'dashboard'`
- **Auth Guard**: Required authentication (`useUserStore().isAuthenticated`), redirecting unauthenticated users to `/auth/signIn?redirect=/dashboard/reports`.
- **RTL & Jalali**: Support Persian RTL layout and localized Persian numbers and dates (`moment-jalaali`) when `locale === 'fa'`.
- **Color Mode**: Compatible with light mode and dark mode classes (`dark:bg-stone-900/50`, `dark:border-white/10`).
- **No SSR Chart Errors**: All ApexCharts renderings must be client-only.

---

### Task 1: Charting Dependencies & Nuxt Client Plugin Setup

**Files:**
- Modify: `package.json`
- Create: `plugins/apexcharts.client.ts`

**Interfaces:**
- Consumes: `npm:apexcharts`, `npm:vue3-apexcharts`
- Produces: Globally registered `<apexchart>` component on the client

- [ ] **Step 1: Install `apexcharts` and `vue3-apexcharts`**

Run:
```bash
npm install apexcharts vue3-apexcharts
```

- [ ] **Step 2: Create the Nuxt client-only plugin**

Create `plugins/apexcharts.client.ts`:
```typescript
import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts)
})
```

- [ ] **Step 3: Verify plugin loads without error**

Run: `npx nuxi prepare`
Expected: Nuxt types generated successfully with no TypeScript errors.

- [ ] **Step 4: Commit changes**

```bash
git add package.json package-lock.json plugins/apexcharts.client.ts
git commit -m "feat(reports): install apexcharts and register client plugin"
```

---

### Task 2: Localization Strings (Persian & English)

**Files:**
- Modify: `locales/fa.json`
- Modify: `locales/en.json`

**Interfaces:**
- Produces: `$t('reports.*')` translation namespace

- [ ] **Step 1: Add `reports` dictionary to `locales/fa.json`**

```json
  "reports": {
    "badge": "تحلیل یادگیری",
    "title": "گزارش پیشرفت یادگیری",
    "subtitle": "تحلیل جامع روند پیشرفت، مداومت آموزشی و سرعت یادگیری شما در تمامی دوره‌ها",
    "timeframes": {
      "days30": "۳۰ روز اخیر",
      "days90": "۳ ماه اخیر",
      "days180": "۶ ماه اخیر",
      "days365": "۱ سال اخیر"
    },
    "overall": {
      "title": "درصد تکمیل کل آموزش‌ها",
      "subtitle": "میانگین جلسات به پایان رسیده",
      "finishedCourses": "دوره‌های تکمیل شده",
      "inProgressCourses": "دوره‌های در حال یادگیری",
      "totalBoxes": "کل جلسات آموزشی",
      "completedBoxes": "جلسات تکمیل شده",
      "coursesRatio": "{completed} از {total} دوره",
      "boxesRatio": "{completed} از {total} جلسه"
    },
    "contentType": {
      "title": "توزیع انواع محتوا",
      "subtitle": "بررسی تفکیکی روند تکمیل محتواهای آموزشی",
      "video": "ویدیوها",
      "audio": "صوت‌ها",
      "file": "فایل‌ها و جزوات",
      "quiz": "آزمون‌ها و کوئیزها",
      "completedRatio": "{completed} از {total}"
    },
    "heatmap": {
      "title": "نقشه فعالیت یادگیری",
      "subtitle": "فعالیت‌های روزانه تکمیل دروس و جلسات",
      "tooltip": "{count} فعالیت تکمیل شده در {date}",
      "less": "کمتر",
      "more": "بیشتر",
      "weekdays": {
        "sat": "ش",
        "sun": "ی",
        "mon": "د",
        "tue": "س",
        "wed": "چ",
        "thu": "پ",
        "fri": "ج"
      }
    },
    "velocity": {
      "title": "سرعت یادگیری در طول زمان",
      "subtitle": "روند تجمعی جلسات تکمیل شده و شدت یادگیری روزانه",
      "cumulative": "مجموع تکمیل شده (تجمعی)",
      "daily": "تکمیل شده در روز"
    },
    "empty": {
      "title": "هنوز آماری برای نمایش ثبت نشده است",
      "description": "با شروع و تکمیل اولین جلسه از دوره‌های خود، نمودارهای جامع یادگیری در این بخش نمایان می‌شوند.",
      "cta": "کاوش دوره‌ها"
    },
    "error": {
      "title": "خطا در دریافت آمار یادگیری",
      "retry": "تلاش مجدد"
    }
  }
```

- [ ] **Step 2: Add `reports` dictionary to `locales/en.json`**

```json
  "reports": {
    "badge": "Learning Analytics",
    "title": "Learning Progress Report",
    "subtitle": "Comprehensive analysis of your study consistency, progress, and learning velocity across all courses",
    "timeframes": {
      "days30": "Last 30 Days",
      "days90": "Last 3 Months",
      "days180": "Last 6 Months",
      "days365": "Last 1 Year"
    },
    "overall": {
      "title": "Overall Course Completion",
      "subtitle": "Average of completed lessons across all enrolled courses",
      "finishedCourses": "Completed Courses",
      "inProgressCourses": "In-Progress Courses",
      "totalBoxes": "Total Lessons",
      "completedBoxes": "Completed Lessons",
      "coursesRatio": "{completed} of {total} courses",
      "boxesRatio": "{completed} of {total} lessons"
    },
    "contentType": {
      "title": "Content-Type Distribution",
      "subtitle": "Detailed breakdown of completed learning media",
      "video": "Videos",
      "audio": "Audios",
      "file": "Files & Docs",
      "quiz": "Quizzes & Tests",
      "completedRatio": "{completed} of {total}"
    },
    "heatmap": {
      "title": "Study Activity Heatmap",
      "subtitle": "Daily lesson completions and study momentum",
      "tooltip": "{count} activities completed on {date}",
      "less": "Less",
      "more": "More",
      "weekdays": {
        "sat": "Sat",
        "sun": "Sun",
        "mon": "Mon",
        "tue": "Tue",
        "wed": "Wed",
        "thu": "Thu",
        "fri": "Fri"
      }
    },
    "velocity": {
      "title": "Learning Velocity Over Time",
      "subtitle": "Cumulative completed lessons and daily study momentum",
      "cumulative": "Cumulative Completed",
      "daily": "Daily Completed"
    },
    "empty": {
      "title": "No learning stats available yet",
      "description": "Start completing your course lessons to unlock your comprehensive progress analytics and velocity trends.",
      "cta": "Explore Courses"
    },
    "error": {
      "title": "Failed to load learning statistics",
      "retry": "Try Again"
    }
  }
```

- [ ] **Step 3: Verify JSON validity**

Run: `node -e "JSON.parse(require('fs').readFileSync('locales/fa.json')); JSON.parse(require('fs').readFileSync('locales/en.json')); console.log('JSON Valid!')"`
Expected: `JSON Valid!`

- [ ] **Step 4: Commit changes**

```bash
git add locales/fa.json locales/en.json
git commit -m "feat(reports): add Persian and English translations for reports dashboard"
```

---

### Task 3: Timeframe Filter Component

**Files:**
- Create: `components/dashboard/reports/TimeframeFilter.vue`

**Interfaces:**
- Props: `modelValue: number` (e.g. 30, 90, 180, 365), `loading?: boolean`
- Emits: `update:modelValue(value: number)`

- [ ] **Step 1: Implement `components/dashboard/reports/TimeframeFilter.vue`**

Support pills for 30, 90, 180, 365 days. Use active styling (`bg-blue-600 text-white shadow-sm` vs `text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`). Disable while loading.

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/TimeframeFilter.vue
git commit -m "feat(reports): add TimeframeFilter component"
```

---

### Task 4: Overall Completion Card Component

**Files:**
- Create: `components/dashboard/reports/OverallCompletionCard.vue`

**Interfaces:**
- Props: `data: OverallCompletion` (from spec TypeScript interface)
- Visuals: ApexCharts RadialBar semi-circle gauge displaying `overall_percentage`, stat pills for courses and lessons.

- [ ] **Step 1: Implement `components/dashboard/reports/OverallCompletionCard.vue`**

- Compute radial bar options responding to dark mode (`colorMode.value === 'dark'`).
- Display KPI grid:
  - Finished Courses / Total Enrolled Courses
  - In-Progress Courses
  - Completed Lessons / Total Lessons
- Format numbers using `Intl.NumberFormat(locale.value)`.

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/OverallCompletionCard.vue
git commit -m "feat(reports): add OverallCompletionCard component with radial gauge"
```

---

### Task 5: Content-Type Distribution Card Component

**Files:**
- Create: `components/dashboard/reports/ContentTypeDistributionCard.vue`

**Interfaces:**
- Props: `data: ContentTypeDistribution` (video, audio, file, quiz)
- Visuals: ApexCharts Donut chart + breakdown cards with progress bars for 🎥 Video, 🎧 Audio, 📄 File, 📝 Quiz.

- [ ] **Step 1: Implement `components/dashboard/reports/ContentTypeDistributionCard.vue`**

- ApexCharts Donut with series `[video.completed, audio.completed, file.completed, quiz.completed]`, custom colors:
  - Video: `#3b82f6` (Blue)
  - Audio: `#8b5cf6` (Purple)
  - File: `#f59e0b` (Amber)
  - Quiz: `#10b981` (Emerald)
- List items showing icon, title, ratio (`completed` / `total`), percentage, and a mini progress bar.

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/ContentTypeDistributionCard.vue
git commit -m "feat(reports): add ContentTypeDistributionCard component with donut chart"
```

---

### Task 6: Study Activity Heatmap Component

**Files:**
- Create: `components/dashboard/reports/StudyActivityHeatmap.vue`

**Interfaces:**
- Props: `activityHeatmap: Record<string, number>`, `days: number`
- Visuals: Responsive week-by-week contribution grid with 4 intensity levels, Jalali/Gregorian tooltips, weekday indicators, month labels, and legend.

- [ ] **Step 1: Implement `components/dashboard/reports/StudyActivityHeatmap.vue`**

- Generate calendar days sequence for the past `days` count.
- Group into columns of 7 days (Saturday to Friday for Persian RTL, or Sunday to Saturday).
- Determine cell color class:
  - 0: `bg-gray-100 dark:bg-white/5`
  - 1-2: `bg-emerald-200 dark:bg-emerald-900/60`
  - 3-5: `bg-emerald-400 dark:bg-emerald-600`
  - 6+: `bg-emerald-600 dark:bg-emerald-400`
- Format date in tooltip with `moment(date).format('jYYYY/jMM/jDD')` when `locale === 'fa'`, or standard date when `en`.
- Include floating tooltip on hover and legend at bottom.

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/StudyActivityHeatmap.vue
git commit -m "feat(reports): add StudyActivityHeatmap component"
```

---

### Task 7: Learning Velocity Card Component

**Files:**
- Create: `components/dashboard/reports/LearningVelocityCard.vue`

**Interfaces:**
- Props: `velocity: LearningVelocityItem[]`
- Visuals: ApexCharts smooth Area/Line chart for `cumulative_completed` with `daily_completed` secondary data, dark mode support, and Jalali date axis.

- [ ] **Step 1: Implement `components/dashboard/reports/LearningVelocityCard.vue`**

- Build area chart series:
  - Series 1: "مجموع تکمیل شده" (`cumulative_completed`)
  - Series 2: "تکمیل روزانه" (`daily_completed`)
- X-axis format: Convert dates using `moment-jalaali` for `fa` locale.
- Reactive dark mode grid colors and tooltips.

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/LearningVelocityCard.vue
git commit -m "feat(reports): add LearningVelocityCard component"
```

---

### Task 8: Skeleton Placeholder & Empty State Component

**Files:**
- Create: `components/dashboard/reports/ReportsSkeleton.vue`

**Interfaces:**
- Visuals: Placeholder layout matching the exact geometry of the 4 cards and header.

- [ ] **Step 1: Implement `components/dashboard/reports/ReportsSkeleton.vue`**

- Replicates the 2x2 grid structure with animated pulsing placeholders (`bg-gray-200/70 dark:bg-white/5 animate-pulse rounded-2xl`).

- [ ] **Step 2: Commit changes**

```bash
git add components/dashboard/reports/ReportsSkeleton.vue
git commit -m "feat(reports): add ReportsSkeleton placeholder component"
```

---

### Task 9: Main Page Orchestrator & Navigation Integration

**Files:**
- Create: `pages/dashboard/reports.vue`
- Modify: `components/layout/Slideshow.vue`

**Interfaces:**
- Consumes: `useApi(true)`, `useUserStore()`, child report components
- Produces: Accessible `/dashboard/reports` route wired into desktop Slideshow and mobile layout

- [ ] **Step 1: Implement `pages/dashboard/reports.vue`**

- Set `definePageMeta({ layout: 'dashboard' })`.
- Auth guard: redirect to `/auth/signIn?redirect=/dashboard/reports` if unauthenticated.
- Reactive `selectedDays = ref(365)` fetching `course/dashboard/learning-stats/?days=${selectedDays.value}` via `useApi(true)`.
- Conditional rendering:
  - `loading`: `<ReportsSkeleton />`
  - `error`: Error alert with retry button
  - Empty state (`total_enrolled_courses === 0` or `completed_boxes === 0`): Motivational empty card with link to `/explore`
  - Ready: Render `TimeframeFilter`, `OverallCompletionCard`, `ContentTypeDistributionCard`, `StudyActivityHeatmap`, `LearningVelocityCard` inside `<ClientOnly>`.

- [ ] **Step 2: Update `components/layout/Slideshow.vue`**

- Update navigation entry:
  ```javascript
  { name: 'Reports', href: '/dashboard/reports', icon: ChartPieIcon, current: false }
  ```
- Ensure active class triggers properly when route starts with `/dashboard/reports`.

- [ ] **Step 3: Commit changes**

```bash
git add pages/dashboard/reports.vue components/layout/Slideshow.vue
git commit -m "feat(reports): add main reports page orchestrator and wire slideshow navigation"
```

---

### Task 10: End-to-End Build Verification & Polishing

**Files:**
- Verify: Full codebase

- [ ] **Step 1: Run Nuxt prepare / typecheck / build**

Run:
```bash
npm run build
```
Verify exit code 0 and zero bundling or import errors.

- [ ] **Step 2: Verify RTL, Dark Mode, and Edge Cases**

Check that:
- Persian RTL layout aligns correctly.
- Dark mode classes toggle without visual glitches.
- Empty states handle 0 values cleanly without division by zero errors.

- [ ] **Step 3: Final Commit & Summary**

```bash
git add -A
git commit -m "feat(reports): complete learning progress dashboard implementation"
```
