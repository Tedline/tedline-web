<template>
  <div class="min-h-screen bg-gray-50/70 pb-24 dark:bg-gray-950 lg:h-screen lg:overflow-hidden lg:pb-0">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:flex lg:h-full lg:flex-col lg:px-8">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">{{ t('helpdesk.eyebrow') }}</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">{{ t('helpdesk.title') }}</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">{{ t('helpdesk.subtitle') }}</p>
        </div>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50" @click="openComposer">
          <PlusIcon class="size-5" /> {{ t('helpdesk.newTicket') }}
        </button>
      </header>

      <div v-if="errorMessage" class="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        <ExclamationCircleIcon class="mt-0.5 size-5 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <div class="mt-8 grid min-h-0 gap-6 lg:flex-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside class="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <div class="border-b border-gray-200 p-4 dark:border-white/10">
            <UInput v-model="search" type="search" icon="i-heroicons-magnifying-glass" :placeholder="t('helpdesk.search')" size="lg" class="w-full" :ui="{ base: 'rounded-xl' }" @keyup.enter="loadTickets" />
          </div>

          <div v-if="loadingTickets" class="space-y-3 p-4">
            <div v-for="item in 4" :key="item" class="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          </div>
          <div v-else-if="!tickets.length" class="p-8 text-center">
            <TicketIcon class="mx-auto size-10 text-gray-300 dark:text-gray-600" />
            <p class="mt-3 font-medium text-gray-900 dark:text-white">{{ t('helpdesk.emptyTitle') }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ t('helpdesk.emptyText') }}</p>
          </div>
          <div v-else class="max-h-[40vh] min-h-0 divide-y divide-gray-100 overflow-y-auto dark:divide-white/5 lg:max-h-none lg:flex-1">
            <button v-for="ticket in tickets" :key="ticket.id" type="button" class="block w-full p-4 text-start transition hover:bg-gray-50 dark:hover:bg-white/5" :class="selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-950/30' : ''" @click="selectTicket(ticket)">
              <div class="flex items-center justify-between gap-3">
                <span class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ ticket.subject }}</span>
                <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium" :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
              </div>
              <p class="mt-2 text-xs text-gray-500">#{{ ticket.tracking_code }} · {{ formatDate(ticket.created_at) }}</p>
              <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>{{ ticket.department?.name }}</span><span>•</span><span>{{ priorityLabel(ticket.priority) }}</span>
              </div>
            </button>
          </div>
        </aside>

        <main class="min-h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 lg:flex lg:min-h-0 lg:h-full lg:flex-col">
          <div v-if="showComposer" class="min-h-0 overflow-y-auto p-5 sm:p-7 lg:flex-1">
            <div class="flex items-center justify-between">
              <div><h2 class="text-xl font-bold text-gray-950 dark:text-white">{{ t('helpdesk.createTitle') }}</h2><p class="mt-1 text-sm text-gray-500">{{ t('helpdesk.createText') }}</p></div>
              <button type="button" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10" @click="showComposer = false"><XMarkIcon class="size-5" /></button>
            </div>
            <form class="mt-7 grid gap-5 sm:grid-cols-2" @submit.prevent="createTicket">
              <UFormField :label="t('helpdesk.subject')" class="sm:col-span-2"><UInput v-model.trim="form.subject" required maxlength="255" size="lg" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField :label="t('helpdesk.department')"><USelect v-model="form.department" :items="departmentItems" :placeholder="t('helpdesk.choose')" required size="lg" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField :label="t('helpdesk.product')"><USelect v-model="form.product" :items="productItems" :placeholder="t('helpdesk.choose')" required size="lg" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField :label="t('helpdesk.priority')"><USelect v-model="form.priority" :items="priorityItems" size="lg" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <div />
              <UFormField :label="t('helpdesk.message')" class="sm:col-span-2"><UTextarea v-model.trim="form.message" required :rows="6" autoresize class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField :label="t('helpdesk.image')"><UInput type="file" accept="image/*" size="lg" class="w-full" :ui="{ base: 'rounded-xl file:me-3 file:cursor-pointer' }" @change="setFile($event, 'image')" /></UFormField>
              <UFormField :label="t('helpdesk.file')"><UInput type="file" size="lg" class="w-full" :ui="{ base: 'rounded-xl file:me-3 file:cursor-pointer' }" @change="setFile($event, 'file')" /></UFormField>
              <div class="flex justify-end gap-3 sm:col-span-2"><button type="button" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold dark:border-white/10" @click="showComposer = false">{{ t('helpdesk.cancel') }}</button><button type="submit" :disabled="submitting" class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{{ submitting ? t('helpdesk.sending') : t('helpdesk.submit') }}</button></div>
            </form>
          </div>

          <div v-else-if="selectedTicket" class="flex min-h-[520px] flex-col lg:min-h-0 lg:h-full">
            <div class="border-b border-gray-200 p-5 dark:border-white/10">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-gray-950 dark:text-white">{{ selectedTicket.subject }}</h2><span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(selectedTicket.status)">{{ statusLabel(selectedTicket.status) }}</span></div><p class="mt-1 text-xs text-gray-500">#{{ selectedTicket.tracking_code }} · {{ selectedTicket.department?.name }} · {{ selectedTicket.product?.name }}</p></div>
                <button v-if="selectedTicket.status !== 'closed'" type="button" :disabled="closing" class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5" @click="closeTicket">{{ t('helpdesk.closeTicket') }}</button>
              </div>
            </div>
            <div ref="messagesContainer" class="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50/60 p-5 dark:bg-black/10">
              <div v-if="loadingMessages" class="text-center text-sm text-gray-500">{{ t('helpdesk.loading') }}</div>
              <div v-for="message in messages" :key="message.id" class="flex" :class="message.is_admin ? 'justify-start' : 'justify-end'">
                <div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm" :class="message.is_admin ? 'bg-white text-gray-800 dark:bg-white/10 dark:text-gray-100' : 'bg-blue-600 text-white'">
                  <p class="whitespace-pre-wrap">{{ message.message }}</p>
                  <a v-if="message.image" :href="message.image" target="_blank" class="mt-2 block underline">{{ t('helpdesk.viewImage') }}</a><a v-if="message.file" :href="message.file" target="_blank" class="mt-2 block underline">{{ t('helpdesk.downloadFile') }}</a>
                  <p class="mt-2 text-[11px] opacity-65">{{ formatDate(message.created_at) }}</p>
                </div>
              </div>
            </div>
            <form v-if="selectedTicket.status !== 'closed'" class="border-t border-gray-200 p-4 dark:border-white/10" @submit.prevent="sendReply"><div class="flex items-end gap-3"><UTextarea v-model.trim="reply" required :rows="2" :placeholder="t('helpdesk.replyPlaceholder')" class="flex-1" :ui="{ base: 'resize-none rounded-xl' }" /><button type="submit" :disabled="sendingReply" class="rounded-xl bg-blue-600 p-3 text-white disabled:opacity-50"><PaperAirplaneIcon class="size-5" /></button></div></form>
            <div v-else class="border-t border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-white/10">{{ t('helpdesk.closedNotice') }}</div>
          </div>
          <div v-else class="flex min-h-[520px] flex-col items-center justify-center p-8 text-center lg:min-h-0 lg:flex-1"><ChatBubbleLeftRightIcon class="size-12 text-gray-300 dark:text-gray-600" /><h2 class="mt-4 font-semibold text-gray-900 dark:text-white">{{ t('helpdesk.selectTitle') }}</h2><p class="mt-1 text-sm text-gray-500">{{ t('helpdesk.selectText') }}</p></div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatBubbleLeftRightIcon, ExclamationCircleIcon, PaperAirplaneIcon, PlusIcon, TicketIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { t, locale } = useI18n()
const api = useApi(true)
const tickets = ref<any[]>([])
const departments = ref<any[]>([])
const products = ref<any[]>([])
const selectedTicket = ref<any>(null)
const messages = ref<any[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const search = ref('')
const reply = ref('')
const showComposer = ref(false)
const loadingTickets = ref(true)
const loadingMessages = ref(false)
const submitting = ref(false)
const sendingReply = ref(false)
const closing = ref(false)
const errorMessage = ref('')
const priorities = ['low', 'medium', 'high', 'urgent']
const form = reactive<any>({ subject: '', department: '', product: '', priority: 'medium', message: '', image: null, file: null })
const departmentItems = computed(() => departments.value.map(item => ({ label: item.name, value: item.id })))
const productItems = computed(() => products.value.map(item => ({ label: item.name, value: item.id })))
const priorityItems = computed(() => priorities.map(value => ({ label: priorityLabel(value), value })))

useHead({ title: computed(() => t('helpdesk.metaTitle')) })

const results = (value: any) => Array.isArray(value) ? value : value?.results || []
const readableError = (error: any) => error?.data?.detail || Object.values(error?.data || {}).flat().join(' ') || t('helpdesk.generalError')
const formatDate = (value: string) => value ? new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''
const statusLabel = (value: string) => t(`helpdesk.status.${value || 'open'}`)
const priorityLabel = (value: string) => t(`helpdesk.priorities.${value || 'medium'}`)
const statusClass = (status: string) => ({ open: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', closed: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300' }[status] || 'bg-gray-100 text-gray-600')
const scrollMessagesToBottom = async () => { await nextTick(); const el = messagesContainer.value; if (el) el.scrollTop = el.scrollHeight }

async function loadTickets() { loadingTickets.value = true; errorMessage.value = ''; try { const data = await api('/helpdesk/conversation/', { query: search.value ? { search: search.value } : {} }); tickets.value = results(data) } catch (e) { errorMessage.value = readableError(e) } finally { loadingTickets.value = false } }
async function loadOptions() { try { const [d, p] = await Promise.all([api('/helpdesk/departments/'), api('/helpdesk/products/')]); departments.value = results(d); products.value = results(p) } catch (e) { errorMessage.value = readableError(e) } }
async function selectTicket(ticket: any) { showComposer.value = false; selectedTicket.value = ticket; loadingMessages.value = true; try { const data = await api(`/helpdesk/conversation/message/${ticket.id}/`); messages.value = results(data).reverse(); await scrollMessagesToBottom() } catch (e) { errorMessage.value = readableError(e) } finally { loadingMessages.value = false } }
function openComposer() { selectedTicket.value = null; showComposer.value = true; errorMessage.value = '' }
function setFile(event: Event, key: 'image' | 'file') { form[key] = (event.target as HTMLInputElement).files?.[0] || null }
async function createTicket() { submitting.value = true; errorMessage.value = ''; const body = new FormData(); ['subject', 'department', 'product', 'priority', 'message'].forEach(key => body.append(key, form[key])); if (form.image) body.append('image', form.image); if (form.file) body.append('file', form.file); try { const ticket: any = await api('/helpdesk/conversation/', { method: 'POST', body }); Object.assign(form, { subject: '', department: '', product: '', priority: 'medium', message: '', image: null, file: null }); showComposer.value = false; await loadTickets(); await selectTicket(ticket) } catch (e) { errorMessage.value = readableError(e) } finally { submitting.value = false } }
async function sendReply() { if (!reply.value) return; sendingReply.value = true; try { const message = await api('/helpdesk/conversation/message/', { method: 'POST', body: { conversation_id: selectedTicket.value.id, message: reply.value } }); messages.value.push(message); reply.value = ''; await scrollMessagesToBottom() } catch (e) { errorMessage.value = readableError(e) } finally { sendingReply.value = false } }
async function closeTicket() { closing.value = true; try { await api(`/helpdesk/conversation/${selectedTicket.value.id}/close/`, { method: 'POST', body: {} }); selectedTicket.value.status = 'closed'; const listed = tickets.value.find(item => item.id === selectedTicket.value.id); if (listed) listed.status = 'closed' } catch (e) { errorMessage.value = readableError(e) } finally { closing.value = false } }

await Promise.all([loadTickets(), loadOptions()])
</script>
