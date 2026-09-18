# Multi-Language Notification System Design Specification

## 1. Overview & Objectives

This document specifies the architecture, UI/UX, and technical design for the frontend **Notification System** in the Tedline platform. It supports real-time unread badges, hover and click dropdown popovers on both desktop and mobile, bilingual localization (Persian and English), and a full notifications management page.

### Key Objectives
1. **Desktop Sidebar Notification Bell**: An interactive bell item with an unread badge inside [`components/layout/Slideshow.vue`](file:///Users/saeedshams/Documents/code/vue-nuxt/tedline-web/components/layout/Slideshow.vue) that reveals a floating popover on hover (with a grace-period debounce) and click.
2. **Mobile Header Notification Bell**: An accessible notification bell in [`components/layout/Header.vue`](file:///Users/saeedshams/Documents/code/vue-nuxt/tedline-web/components/layout/Header.vue) for mobile viewports (`lg:hidden`).
3. **Notification Dropdown Popover**: A streamlined list showing the latest 5–10 notifications with category icon badges, localized titles and messages, relative timestamps (Jalali for Persian, Gregorian for English), unread dot indicators, and quick action redirection.
4. **Full Notifications Page**: A dedicated paginated page at `/dashboard/notifications` with filter tabs (All, Unread, Read), manual mark-as-read, and empty states.
5. **Pinia State & Polling**: Centralized reactive notification store with periodic unread count synchronization (every 60 seconds) when authenticated.

---

## 2. Backend Contract & API Endpoints

All endpoints use base prefix `/api/notifications/` and require JWT Bearer authorization (`useApi(true)`).

### 2.1 Backend Behaviors
1. **Bilingual Localization**: `useApi` automatically passes the `Accept-Language` header (`fa` or `en`). The backend returns localized `title` and `message` strings for the requested locale, while also providing `title_fa`, `title_en`, `message_fa`, and `message_en`.
2. **Unread-First Ordering**: The backend returns notifications ordered by `is_read ASC, created_at DESC`.
3. **Automatic Read-On-Fetch**: Calling `GET /api/notifications/` automatically marks returned unread notifications as `is_read=True` in the database. In the immediate response payload, these items still arrive with `is_read: false` to allow the frontend to render unread accents (blue dot/background tint) during the current session. Subsequent count queries or refetches reflect the updated read state.

### 2.2 Endpoints Summary

| Method | Endpoint | Query / Body | Purpose |
|---|---|---|---|
| `GET` | `/api/notifications/unread-count/` | None | Retrieves current unread counter: `{ unread_count: number }` |
| `GET` | `/api/notifications/` | `?page=1&page_size=10&is_read=` | Paginated notification list with metadata |
| `POST` | `/api/notifications/<id>/mark-read/` | None | Manually marks single notification as read |

---

## 3. TypeScript Interfaces

```typescript
export type NotificationType = 'course' | 'quiz' | 'wallet' | 'ticket' | 'comment' | 'system'

export interface NotificationItem {
  id: number
  title: string
  title_fa: string
  title_en: string
  message: string
  message_fa: string
  message_en: string
  notification_type: NotificationType
  action_url: string | null
  is_read: boolean
  created_at: string // ISO 8601 string, e.g. "2026-09-18T18:00:00Z"
}

export interface NotificationListResponse {
  count: number
  unread_count: number
  total_pages: number
  results: NotificationItem[]
}

export interface UnreadCountResponse {
  unread_count: number
}
```

---

## 4. Architecture & Component Structure

```
tedline-web/
├── stores/
│   └── notifications.ts                    # Pinia store for unread count, popover list, polling
├── components/
│   ├── notifications/
│   │   ├── NotificationBell.vue            # Reusable bell button with badge and trigger events
│   │   └── NotificationDropdown.vue        # Dropdown popover list, category icons, relative times
│   └── layout/
│       ├── Slideshow.vue                   # Desktop sidebar integrating hover flyout bell
│       └── Header.vue                      # Mobile header integrating mobile dropdown bell
├── pages/
│   └── dashboard/
│       └── notifications.vue               # Full notifications page with tabs and pagination
└── locales/
    ├── fa.json                             # Persian translations under "notifications"
    └── en.json                             # English translations under "notifications"
```

---

## 5. Detailed Component Specifications

### 5.1 Pinia Store (`stores/notifications.ts`)
- **State**:
  - `unreadCount`: `number` (default: 0)
  - `recentNotifications`: `NotificationItem[]` (cached latest 8 items for popover)
  - `isLoadingRecent`: `boolean`
  - `isPolling`: `boolean`
- **Actions**:
  - `fetchUnreadCount()`: Calls `GET /api/notifications/unread-count/` if `userStore.isAuthenticated`.
  - `fetchRecent(pageSize = 8)`: Calls `GET /api/notifications/?page=1&page_size=${pageSize}`. Updates `recentNotifications` and synchronizes `unreadCount`.
  - `markAsRead(id: number)`: Optimistically marks notification as `is_read = true` locally and fires `POST /api/notifications/${id}/mark-read/`. Decrements `unreadCount` if greater than zero.
  - `startPolling()` / `stopPolling()`: Sets up an interval (60s) to poll `fetchUnreadCount()`. Stops when user logs out or window becomes hidden.

### 5.2 Notification Bell & Hover Popover (`NotificationBell.vue` & `NotificationDropdown.vue`)
- **Desktop Sidebar (`Slideshow.vue`)**:
  - Integrated in top navigation list above or beside main links.
  - Shows bell icon (`BellIcon`) with an active indicator badge (`unreadCount > 0`, displaying up to `99+`).
  - **Hover Behavior**:
    - Opens immediately on `mouseenter`.
    - 200ms grace period timeout on `mouseleave` to allow mouse transit across borders without premature closing.
    - Position: Flies out toward screen interior (`ltr:left-full ltr:ml-3 rtl:right-full rtl:mr-3 top-0`).
    - Styled with `rounded-3xl border border-gray-200 bg-white/95 dark:border-white/10 dark:bg-stone-900/95 backdrop-blur-xl shadow-2xl z-[100] w-80 sm:w-96`.
- **Mobile Header (`Header.vue`)**:
  - Rendered in mobile top bar (`lg:hidden`).
  - Toggles dropdown menu on click, anchored below the header (`top-full mt-2 left-4 right-4 max-w-md mx-auto`).

### 5.3 Category Icon & Type Mapping
| Type | Icon (`@heroicons/vue/24/outline`) | Background / Text Palette |
|---|---|---|
| `course` | `AcademicCapIcon` | `bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400` |
| `quiz` | `ClipboardDocumentCheckIcon` | `bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400` |
| `comment` | `ChatBubbleLeftRightIcon` | `bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400` |
| `wallet` | `CreditCardIcon` | `bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400` |
| `ticket` | `LifebuoyIcon` | `bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400` |
| `system` | `BellIcon` | `bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400` |

### 5.4 Relative Time Formatting
- Computed relative timestamp formatted in current active locale:
  - Persian (`fa`): e.g., "۵ دقیقه پیش", "۲ ساعت پیش", "دیروز", "۳ روز پیش" using `moment-jalaali` or localized time diff.
  - English (`en`): e.g., "5m ago", "2h ago", "yesterday", "3d ago".

### 5.5 Full Notifications Page (`pages/dashboard/notifications.vue`)
- Layout: `dashboard`
- Auth Guard: Redirects to `/auth/signIn?redirect=/dashboard/notifications` if not authenticated.
- Header: Hero card matching Tedline dashboard styling with glow effects, title, subtitle, and total count.
- Filter Tabs:
  - All (`$t('notifications.tabs.all')`)
  - Unread (`$t('notifications.tabs.unread')` with filter `is_read=false`)
  - Read (`$t('notifications.tabs.read')` with filter `is_read=true`)
- Pagination: Page navigation buttons (`page`, `total_pages`).
- Item Actions:
  - Clickable card that navigates to `action_url` if present.
  - Action button to mark as read if `is_read` is false.
- Empty State: Friendly visual with icon and localized empty copy.

---

## 6. Localization (I18n)

Keys added to `locales/fa.json` and `locales/en.json` under `notifications`:
- Header labels: `title`, `subtitle`, `badge`, `unreadCount`
- Tabs: `all`, `unread`, `read`
- Types: `course`, `quiz`, `comment`, `wallet`, `ticket`, `system`
- Actions: `viewAll`, `markAsRead`, `viewDetails`
- Empty states: `emptyTitle`, `emptyDescription`
- Time formatting units: minutes, hours, days, just now

---

## 7. Verification Plan

1. **Unit & Type Verification**:
   - Run `npx nuxi prepare` to ensure types generate with 0 errors.
   - Run `npm run build` to verify clean production compilation with 0 hydration or SSR mismatches.
2. **Visual & Interaction Verification**:
   - Desktop hover flyout in `Slideshow.vue` opens smoothly without flickering and dismisses cleanly.
   - Mobile dropdown in `Header.vue` opens and closes reliably.
   - Unread badge counter renders correct counts (and `99+` for large values).
   - Empty state displays correctly when no notifications are present.
   - Full page pagination and filter tabs update results reactively.
