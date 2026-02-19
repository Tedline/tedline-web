<template>
    <div class="mt-10 mb-20">
        <div class="relative isolate overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-700 dark:via-blue-600 dark:to-indigo-700 px-6 py-10 sm:px-12 lg:px-24 rounded-3xl shadow-2xl">
            <!-- Animated Background Elements -->
            <div class="absolute left-20 top-1/2 z-0 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 opacity-80">
                <UiCircleBackground color="#FFFFFF" class="animate-spin-slow" />
            </div>
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"></div>
            </div>
            
            <div class="relative z-10 mx-auto max-w-7xl">
                <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <!-- Left Column: Content -->
                    <div class="text-center lg:text-right rtl:text-right ltr:text-left">
                        <h2 class="font-display text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                            {{ $t('link.title') }}
                        </h2>
                        <p class="mt-6 text-sm sm:text-md leading-8 text-blue-100 dark:text-blue-200">
                            {{ $t('link.description') }}
                        </p>
                        
                        <!-- Benefits List -->
                        <ul class="mt-8 space-y-4 ">
                            <li class="flex items-center gap-3 ">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-base font-medium text-white">{{ $t('link.benefit1') }}</span>
                            </li>
                            <li class="flex items-center gap-3 ">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span class="text-base font-medium text-white">{{ $t('link.benefit2') }}</span>
                            </li>
                            <li class="flex items-center gap-3 ">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-base font-medium text-white">{{ $t('link.benefit3') }}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Right Column: CTA Buttons -->
                    <div class="flex flex-col items-center lg:items-start rtl:lg:items-end space-y-6">
                        <div class="w-full max-w-md">
                            <h3 class="text-xl font-semibold text-white text-center lg:text-right rtl:text-right ltr:text-left mb-6">
                                {{ $t('link.ctaTitle') }}
                            </h3>
                            <div class="space-y-4">
                                <NuxtLinkLocale 
                                    to="/auth/signUp"
                                    class="group relative flex rtl:flex-row-reverse w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-base font-semibold backdrop-blur-sm text-blue-600  transition-all duration-200 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] dark:bg-gray-900/80 dark:text-blue-400 dark:hover:bg-gray-800"
                                >
                                    <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span>{{ $t('link.signupButton') }}</span>
                                    <svg class="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </NuxtLinkLocale>
                                
                                <NuxtLinkLocale 
                                    to="/auth/signIn"
                                    class="group relative flex rtl:flex-row-reverse w-full items-center justify-center gap-3 rounded-xl border-1 border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-base font-semibold text-white  transition-all duration-200 hover:bg-white/20 hover:border-white/50  hover:scale-[1.01] active:scale-[0.98]"
                                >
                                    <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>{{ $t('link.loginButton') }}</span>
                                    <svg class="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </NuxtLinkLocale>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

