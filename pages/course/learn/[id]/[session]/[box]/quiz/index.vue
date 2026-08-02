<template>
  <div>
    <div class="text-center pa-4">
      <v-card style="height: 188px" class="d-flex justify-center align-center" v-if="loading == true">
        <v-progress-circular color="primary" indeterminate :size="87" :width="7"></v-progress-circular>
      </v-card>
      <v-card v-else-if="examInformation" elevation="0" class=" py-5 px-3 px-md-5 rtl" color="transparent">
        <div class="d-flex align-center">
          <v-avatar size="x-large" rounded="lg" color="blue" variant="tonal">
            <v-icon size="20"> fad fa-question</v-icon>
          </v-avatar>

          <h2 class="text-center mx-4  text-h6 irsa font-weight-bold ">{{ examInformation.title }}</h2>
        </div>
        <div class="mt-10 d-flex flex-wrap">
          <div class="px-5 mx-2 py-1 rounded-pill border mt-3">
            <p class="irsa text-right   font-weight-light text-body-2">
              دفعات مجاز شرکت در ازمون :
              <span class="font-weight-black text-body-1 ">{{
                examInformation.max_attempts
              }}</span>
            </p>
          </div>
          <div class="px-5 mx-2 py-1 rounded-pill border mt-3">
            <p class="irsa text-right   font-weight-light text-body-2">
              مدت زمان ازمون :
              <span class="font-weight-black text-body-1">{{
                examInformation.quiz_time
              }}</span><span> دقیقه</span>
            </p>
          </div>
        </div>
        <div class=" mb-3 d-flex  mt-16">
        
          <v-btn class="px-10" color="blue" elevation="0" rounded="lg" @click="sendId" :loading="loadingBtn">
            {{ examInformation.partnership_status == 'In Progress' ? ' ادامه آزمون' : examInformation.partnership_status
              == 'Again' ? 'دوباره' : ' ثبت نام' }}
          </v-btn>
          <v-bottom-sheet inset>
            <template v-slot:activator="{ props }">
              <v-btn class=" mx-2" v-bind="props" variant="tonal" rounded="lg" color="blue" :loading="loading_list_quiz"
                text="سوابق">

                <template v-slot:append>
                  <IconHistoryToggle size="16" />
                </template>
              </v-btn>
            </template>

            <v-list dir="rtl" :lines="list_quiz.length" class="rounded-t-lg">
              <v-list-subheader class="text-h6 font-weight-bold pa-3 text-nauto">آزمون های شرکت کرده</v-list-subheader>
              <v-list-item v-for="item in list_quiz" :key="item.id">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    {{ item.quiz.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.final_score }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <template v-slot:append>
                  <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"
                    @click="watchResult(item.id)"></v-btn>
                </template>
              </v-list-item>
              <div v-if="list_quiz.length == 0" class="text-center py-10">
                شما تا کنون در این آزمون را به اتمام نرسانده اید
              </div>
            </v-list>
          </v-bottom-sheet>
        </div>
      </v-card>
      <v-alert v-else type="error" variant="tonal" class="rtl text-right">
        {{ errorMessage || 'دریافت اطلاعات آزمون ناموفق بود.' }}
      </v-alert>

      <v-alert v-if="errorMessage && examInformation" type="error" variant="tonal" class="mt-4 rtl text-right">
        {{ errorMessage }}
      </v-alert>

    </div>


  </div>
</template>
<script>

import { IconHistoryToggle } from '@tabler/icons-vue';



export default {
  components: { IconHistoryToggle },
  setup() {
    definePageMeta({
      layout: "learn-dashboard",
    })
    return { api: useApi() }
  },
  data() {
    return {
      list_quiz: [],
      loading_list_quiz: true,
      examInformation: null,
      loading: true,
      loadingBtn: false,
      id: null,
      data: null,
      errorMessage: '',
    };
  },
  methods: {
    async getListQuiz() {
      try {
        this.list_quiz = await this.api(`quiz/list-quiz-report/${this.$route.params.box}/`);
      } catch (error) {
        console.error("error", error);
      } finally {
        this.loading_list_quiz = false;
      }
    },
    watchResult(id) {
      if (this.list_quiz.length > 0) {
        this.$router.push("/result/" + id);
      } else {
        console.log("The operation failed :(");
      }
    },
    async getData() {
      this.loading = true;
      this.errorMessage = '';
      try {
        this.examInformation = await this.api(`quiz/retrieve-quiz/${this.$route.params.box}/`);
        this.id = this.examInformation.id;
      } catch (error) {
        console.error("error: ", error);
        this.errorMessage = error?.data?.detail || 'دریافت اطلاعات آزمون ناموفق بود.';
      } finally {
        this.loading = false;
      }
    },
    async sendId() {
      this.loadingBtn = true;
      this.errorMessage = '';
      try {
        const response = await this.api(`quiz/signup-quiz/${this.$route.params.box}/`, { method: 'POST' });
        this.data = response.data;
        if (this.data !== null) await this.$router.push(`${this.data}`);
      } catch (error) {
        console.error(error);
        this.errorMessage = error?.data?.detail || 'شروع آزمون ناموفق بود.';
      } finally {
        this.loadingBtn = false;
      }
    },
  },
  async mounted() {
    await Promise.all([this.getListQuiz(), this.getData()]);
  },
};
</script>
