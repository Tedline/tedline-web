# Multi-Language Notification System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a responsive, client-side, bilingual (Persian & English) notification system featuring real-time unread count badges, a desktop hover flyout in [`components/layout/Slideshow.vue`](file:///Users/saeedshams/Documents/code/vue-nuxt/tedline-web/components/layout/Slideshow.vue), a mobile header dropdown in [`components/layout/Header.vue`](file:///Users/saeedshams/Documents/code/vue-nuxt/tedline-web/components/layout/Header.vue), and a full notifications page at `/dashboard/notifications`.

**Architecture:** A centralized Pinia store manages unread counts, recent notification cache, and 60-second polling. Modular Vue 3 components render the bell badge and dropdown list with category icon badges and relative timestamps, integrating cleanly into the existing desktop sidebar and mobile header.

**Tech Stack:** Nuxt 3, Vue 3, Pinia, Tailwind CSS v4, `@heroicons/vue`, `@nuxtjs/color-mode`, `moment-jalaali`, `useApi`.

**Spec:** [`docs/superpowers/specs/2026-09-18-notification-system-design.md`](file:///Users/saeedshams/Documents/code/vue-nuxt/tedline-web/docs/superpowers/specs/2026-09-18-notification-system-design.md)

## Global Constraints

- Bilingual localization (Persian `fa` and English `en`) for all user-facing strings under the `notifications` namespace.
- Dark mode compatibility using Tailwind `dark:` variants matching Tedline's theme (`dark:bg-stone-900`, `dark:border-white/10`).
- Desktop hover flyout in `Slideshow.vue` must implement a 200ms grace period on `mouseleave` to prevent flicker when hovering into the popover.
- Layouts: `/dashboard/notifications` must use `layout: 'dashboard'`.
- SSR Safety: Polling, window listeners, and local storage access must check `import.meta.client`.

---

### Task 1: Notification Localization Strings (Persian & English)

**Files:**
- Modify: `locales/fa.json`
- Modify: `locales/en.json`

**Interfaces:**
- Produces: `$t('notifications.*')` translation dictionary in both Persian and English.

- [ ] **Step 1: Update `locales/fa.json` with `notifications` namespace**

Add the complete `notifications` object containing titles, tabs, type names, actions, empty states, and relative time copy.

- [ ] **Step 2: Update `locales/en.json` with `notifications` namespace**

Add the corresponding English translations matching all keys in `fa.json`.

- [ ] **Step 3: Verify JSON validity**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('locales/fa.json')); JSON.parse(require('fs').readFileSync('locales/en.json')); console.log('JSON Valid!')"
```

- [ ] **Step 4: Commit changes**

```bash
git add locales/fa.json locales/en.json
git commit -m "feat(notifications): add Persian and English localization strings"
```

---

### Task 2: Pinia Notification Store & Polling Subsystem

**Files:**
- Create: `stores/notifications.ts`

**Interfaces:**
- Consumes: `useApi(true)`, `useUserStore()`
- Produces: `useNotificationStore()` Pinia store with:
  - `unreadCount: Ref<number>`
  - `recentNotifications: Ref<NotificationItem[]>`
  - `isLoadingRecent: Ref<boolean>`
  - `fetchUnreadCount(): Promise<number>`
  - `fetchRecent(pageSize?: number): Promise<void>`
  - `markAsRead(id: number): Promise<void>`
  - `startPolling(): void`
  - `stopPolling(): void`

- [ ] **Step 1: Implement `stores/notifications.ts`**

Implement the Pinia store with typed interfaces for `NotificationItem`, `NotificationType`, and `NotificationListResponse`.
Add optimistic local update on `markAsRead`, synchronization of `unreadCount`, and a 60-second polling mechanism that guards against SSR and runs only when `userStore.isAuthenticated` is true.

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0, types generated successfully.

- [ ] **Step 3: Commit changes**

```bash
git add stores/notifications.ts
git commit -m "feat(notifications): add notifications Pinia store with polling"
```

---

### Task 3: Notification Dropdown Component

**Files:**
- Create: `components/notifications/NotificationDropdown.vue`

**Interfaces:**
- Consumes: `useNotificationStore()`, `useI18n()`, `useLocalePath()`, `useRouter()`
- Emits: `(e: 'close'): void`
- Visuals: Header with title and unread pill, scrollable list with category icons, title, message snippet, Jalali/Gregorian relative time, unread indicator dot, click to navigate `action_url`, empty state, and footer "View All" link.

- [ ] **Step 1: Implement `components/notifications/NotificationDropdown.vue`**

Implement category icon mapping:
- `course`: `AcademicCapIcon`
- `quiz`: `ClipboardDocumentCheckIcon`
- `comment`: `ChatBubbleLeftRightIcon`
- `wallet`: `CreditCardIcon`
- `ticket`: `LifebuoyIcon`
- `system`: `BellIcon`

Implement localized relative time formatter (e.g. `moment(d).fromNow()` or customized Jalali string for `fa`, and standard relative string for `en`).
Implement click handler that marks item as read, closes the dropdown, and navigates to `action_url` if present.

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0.

- [ ] **Step 3: Commit changes**

```bash
git add components/notifications/NotificationDropdown.vue
git commit -m "feat(notifications): add NotificationDropdown component"
```

---

### Task 4: Notification Bell Button & Hover Popover Wrapper

**Files:**
- Create: `components/notifications/NotificationBell.vue`

**Interfaces:**
- Consumes: `useNotificationStore()`, `NotificationDropdown`
- Props: `mode: 'hover' | 'click'`, `placement: 'sidebar' | 'header'`
- Visuals: Button with `BellIcon`, unread count badge, and floating popover positioned correctly for RTL and LTR.

- [ ] **Step 1: Implement `components/notifications/NotificationBell.vue`**

- If `mode === 'hover'`: Opens on `mouseenter`. On `mouseleave`, starts a 200ms grace timer. If cursor enters popover during the timer, clears timer and stays open.
- If `mode === 'click'`: Toggles on click; closes on outside-click or Escape key.
- Positioning:
  - Sidebar (`placement === 'sidebar'`): `ltr:left-full ltr:ml-3 rtl:right-full rtl:mr-3 top-0`
  - Header (`placement === 'header'`): `top-full mt-2 ltr:right-0 rtl:left-0`
- Badge: Display badge if `unreadCount > 0` (shows `99+` if count > 99).

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0.

- [ ] **Step 3: Commit changes**

```bash
git add components/notifications/NotificationBell.vue
git commit -m "feat(notifications): add NotificationBell component with hover and click support"
```

---

### Task 5: Desktop Sidebar Integration

**Files:**
- Modify: `components/layout/Slideshow.vue`

**Interfaces:**
- Consumes: `components/notifications/NotificationBell.vue`
- Renders: Hover-activated notification bell inside the desktop navigation bar.

- [ ] **Step 1: Integrate `NotificationBell` in `components/layout/Slideshow.vue`**

Add `NotificationBell` with `mode="hover"` and `placement="sidebar"` inside the desktop sidebar navigation area (visible when authenticated).
Start store polling on mount when authenticated.

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0.

- [ ] **Step 3: Commit changes**

```bash
git add components/layout/Slideshow.vue
git commit -m "feat(notifications): integrate hover notification bell in desktop slideshow"
```

---

### Task 6: Mobile Header Integration

**Files:**
- Modify: `components/layout/Header.vue`

**Interfaces:**
- Consumes: `components/notifications/NotificationBell.vue`
- Renders: Click-activated notification bell inside the mobile header bar (`lg:hidden`).

- [ ] **Step 1: Integrate `NotificationBell` in `components/layout/Header.vue`**

Add `NotificationBell` with `mode="click"` and `placement="header"` in the mobile top controls bar next to the mobile menu toggle button (visible when authenticated).

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0.

- [ ] **Step 3: Commit changes**

```bash
git add components/layout/Header.vue
git commit -m "feat(notifications): integrate mobile notification bell in header"
```

---

### Task 7: Full Notifications Page

**Files:**
- Create: `pages/dashboard/notifications.vue`

**Interfaces:**
- Route: `/dashboard/notifications`
- Consumes: `useApi(true)`, `useNotificationStore()`, `useUserStore()`
- Visuals: Hero card header, All/Unread/Read filter tabs, paginated notification list, action buttons, pagination controls, and empty state.

- [ ] **Step 1: Implement `pages/dashboard/notifications.vue`**

- `definePageMeta({ layout: 'dashboard' })`.
- Redirect to `/auth/signIn?redirect=/dashboard/notifications` if unauthenticated.
- Reactive `activeTab = ref<'all' | 'unread' | 'read'>('all')` and `currentPage = ref(1)`.
- Fetch notifications from `GET /api/notifications/?page=${currentPage.value}&page_size=10${filterQuery}`.
- Render notification cards with type badge, formatted full timestamp, message, action button (if `action_url`), and "Mark as read" button if `!is_read`.
- Render pagination controls (`Prev`, page numbers, `Next`) when `total_pages > 1`.
- Render empty state if results array is empty.

- [ ] **Step 2: Verify with `npx nuxi prepare`**

Run:
```bash
npx nuxi prepare
```
Expected: Code 0.

- [ ] **Step 3: Commit changes**

```bash
git add pages/dashboard/notifications.vue
git commit -m "feat(notifications): add full notifications management page"
```

---

### Task 8: End-to-End Build Verification & Polishing

**Files:**
- Verify: Full codebase

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```
Expected: Exit code 0, all chunks compiled cleanly.

- [ ] **Step 2: Commit any final polishing touches**

```bash
git add -A
git commit -m "feat(notifications): complete notification system implementation"
```
