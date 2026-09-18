<template>
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading reports"
    class="space-y-6 select-none"
  >
    <span class="sr-only">Loading learning progress reports...</span>

    <!-- Top Header Skeleton -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <!-- Title Skeleton -->
        <div class="h-8 w-48 sm:w-56 bg-gray-200/80 dark:bg-white/10 rounded-xl animate-pulse" />
        <!-- Subtitle Skeleton -->
        <div class="h-4 w-64 sm:w-80 bg-gray-200/60 dark:bg-white/5 rounded-lg animate-pulse" />
      </div>

      <!-- Timeframe Filter Skeleton (4 pills) -->
      <div class="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 gap-1 shrink-0">
        <div
          v-for="i in 4"
          :key="i"
          class="h-7 sm:h-8 w-14 sm:w-16 bg-gray-200/70 dark:bg-white/10 rounded-lg animate-pulse"
        />
      </div>
    </div>

    <!-- 2x2 Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 1. Overall Completion Card Skeleton -->
      <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6   flex flex-col justify-between">
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div class="space-y-1.5">
            <div class="h-5 w-36 bg-gray-200/80 dark:bg-white/10 rounded-md animate-pulse" />
            <div class="h-3.5 w-48 bg-gray-200/60 dark:bg-white/5 rounded-md animate-pulse" />
          </div>
          <div class="w-10 h-10 rounded-2xl bg-blue-50/80 dark:bg-blue-500/10 animate-pulse shrink-0" />
        </div>

        <!-- Radial Gauge Placeholder -->
        <div class="flex flex-col items-center justify-center pt-2 pb-1">
          <div class="w-full max-w-[280px] sm:max-w-xs -mb-6 h-[230px] flex flex-col items-center justify-center gap-3">
            <div class="relative w-44 h-24 overflow-hidden flex items-end justify-center">
              <div class="w-44 h-44 rounded-full border-[14px] border-gray-200/70 dark:border-white/10 border-t-blue-500/30 dark:border-t-blue-400/30 animate-pulse" />
            </div>
            <div class="h-6 w-16 bg-gray-200/80 dark:bg-white/10 rounded-md animate-pulse mt-1" />
          </div>
        </div>

        <!-- 3 Stat Metrics Skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-2xl p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="h-3 w-20 bg-gray-200/70 dark:bg-white/5 rounded animate-pulse" />
              <div class="w-8 h-8 rounded-xl bg-gray-200/80 dark:bg-white/10 animate-pulse shrink-0" />
            </div>
            <div class="space-y-2">
              <div class="h-6 w-16 bg-gray-200/80 dark:bg-white/10 rounded animate-pulse" />
              <div class="h-2.5 w-24 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
              <div class="w-full bg-gray-200/60 dark:bg-white/10 rounded-full h-1.5 mt-3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Content-Type Distribution Card Skeleton -->
      <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6   flex flex-col justify-between">
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div class="space-y-1.5">
            <div class="h-5 w-40 bg-gray-200/80 dark:bg-white/10 rounded-md animate-pulse" />
            <div class="h-3.5 w-52 bg-gray-200/60 dark:bg-white/5 rounded-md animate-pulse" />
          </div>
          <div class="w-10 h-10 rounded-2xl bg-blue-50/80 dark:bg-blue-500/10 animate-pulse shrink-0" />
        </div>

        <!-- Donut Chart Placeholder -->
        <div class="relative flex flex-col items-center justify-center py-3">
          <div class="w-full max-w-[280px] sm:max-w-xs min-h-[240px] flex items-center justify-center">
            <div class="w-40 h-40 rounded-full border-[18px] border-gray-200/70 dark:border-white/10 border-t-blue-500/30 dark:border-t-blue-400/30 animate-pulse flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-gray-50/80 dark:bg-stone-900/50" />
            </div>
          </div>
        </div>

        <!-- 4 Media Items Grid Skeleton (2x2) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-2xl p-3.5 sm:p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between"
          >
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-gray-200/80 dark:bg-white/10 animate-pulse shrink-0" />
                <div class="h-3.5 w-16 bg-gray-200/70 dark:bg-white/5 rounded animate-pulse" />
              </div>
              <div class="h-3.5 w-8 bg-gray-200/70 dark:bg-white/5 rounded animate-pulse shrink-0" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="h-2.5 w-16 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
                <div class="h-2.5 w-10 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
              </div>
              <div class="w-full bg-gray-200/60 dark:bg-white/10 rounded-full h-1.5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Study Activity Heatmap Skeleton -->
      <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6   flex flex-col justify-between">
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div class="space-y-1.5">
            <div class="h-5 w-36 bg-gray-200/80 dark:bg-white/10 rounded-md animate-pulse" />
            <div class="h-3.5 w-44 bg-gray-200/60 dark:bg-white/5 rounded-md animate-pulse" />
          </div>
          <div class="w-10 h-10 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 animate-pulse shrink-0" />
        </div>

        <!-- Heatmap Grid Container -->
        <div class="overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
          <div class="inline-flex flex-col min-w-max">
            <!-- Month Row Skeleton -->
            <div class="flex items-center gap-1 sm:gap-1.5 mb-1.5 h-5">
              <div class="w-6 sm:w-7 shrink-0" />
              <div class="flex items-center gap-8 sm:gap-10">
                <div
                  v-for="m in 6"
                  :key="m"
                  class="h-3 w-8 bg-gray-200/70 dark:bg-white/5 rounded animate-pulse"
                />
              </div>
            </div>

            <!-- Main Matrix (Weekdays + 24 Weeks) -->
            <div class="flex items-start gap-1 sm:gap-1.5">
              <!-- Weekday Column -->
              <div class="flex flex-col gap-1 sm:gap-1.5 w-6 sm:w-7 shrink-0 text-start">
                <div
                  v-for="d in 7"
                  :key="d"
                  class="h-3 sm:h-3.5 flex items-center"
                >
                  <div class="h-2 w-4 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
                </div>
              </div>

              <!-- Week Columns Matrix -->
              <div class="flex items-center gap-1 sm:gap-1.5">
                <div
                  v-for="w in 24"
                  :key="w"
                  class="flex flex-col gap-1 sm:gap-1.5 shrink-0"
                >
                  <div
                    v-for="d in 7"
                    :key="d"
                    class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-gray-200/60 dark:bg-white/5 animate-pulse"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer: Summary & Legend Placeholders -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
          <div class="flex items-center gap-2">
            <div class="h-4 w-12 bg-gray-200/80 dark:bg-white/10 rounded animate-pulse" />
            <div class="h-3.5 w-24 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-8 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
            <div class="flex items-center gap-1">
              <div
                v-for="i in 4"
                :key="i"
                class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-gray-200/80 dark:bg-white/10 animate-pulse"
              />
            </div>
            <div class="h-3 w-8 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <!-- 4. Learning Velocity Card Skeleton -->
      <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6   flex flex-col justify-between">
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div class="space-y-1.5">
            <div class="h-5 w-32 bg-gray-200/80 dark:bg-white/10 rounded-md animate-pulse" />
            <div class="h-3.5 w-44 bg-gray-200/60 dark:bg-white/5 rounded-md animate-pulse" />
          </div>
          <div class="w-10 h-10 rounded-2xl bg-indigo-50/80 dark:bg-indigo-500/10 animate-pulse shrink-0" />
        </div>

        <!-- 3 KPI Pills Skeleton -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 pb-2">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5"
            :class="{ 'col-span-2 sm:col-span-1': i === 3 }"
          >
            <div class="w-7 h-7 rounded-xl bg-gray-200/80 dark:bg-white/10 animate-pulse shrink-0" />
            <div class="min-w-0 space-y-1.5 flex-1">
              <div class="h-2.5 w-14 bg-gray-200/60 dark:bg-white/5 rounded animate-pulse" />
              <div class="h-4 w-10 bg-gray-200/80 dark:bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Chart Area Placeholder with Vertical Pulse Bars -->
        <div class="relative w-full min-h-[280px] pt-2 flex flex-col justify-between">
          <!-- Skeleton Legend / Header -->
          <div class="flex items-center justify-end gap-3 pb-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-indigo-500/30 animate-pulse" />
              <div class="h-3 w-16 bg-gray-200/80 dark:bg-white/10 rounded animate-pulse" />
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-sky-500/30 animate-pulse" />
              <div class="h-3 w-14 bg-gray-200/80 dark:bg-white/10 rounded animate-pulse" />
            </div>
          </div>

          <!-- Skeleton Chart Area with Fake Area & Bars -->
          <div class="flex-1 w-full flex items-end gap-2 px-2 pb-3 border-b border-gray-100 dark:border-white/5 relative overflow-hidden min-h-[190px]">
            <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />

            <div
              v-for="i in 14"
              :key="i"
              class="flex-1 flex flex-col justify-end items-center h-full z-10"
            >
              <div
                class="w-full max-w-[14px] bg-gray-200/80 dark:bg-white/10 rounded-t animate-pulse"
                :style="{ height: `${Math.max(15, (i * 19) % 80 + 10)}%` }"
              />
            </div>
          </div>

          <!-- Skeleton X-Axis Ticks -->
          <div class="flex justify-between items-center px-2 pt-2">
            <div
              v-for="i in 7"
              :key="i"
              class="h-2.5 w-7 bg-gray-200/70 dark:bg-white/10 rounded animate-pulse"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ReportsSkeleton placeholder component
</script>
