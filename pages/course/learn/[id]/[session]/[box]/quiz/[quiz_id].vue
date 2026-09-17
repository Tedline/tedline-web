<template>
  <v-app>
    <v-main>
      <div elevation="0" style="height: 500px" class="d-flex justify-center align-center" v-if="loading == true">
        <v-progress-circular color="blue" indeterminate :size="80" :width="5"></v-progress-circular>
      </div>
    
      <div v-else>
        <v-navigation-drawer width="300" elevation="0" color="blue-grey-darken-4" class="shadow-3 border-none " v-model="drawer" 
          location="right">
          <div v-if="loading == true" style="height: 95%" class="w-100  d-flex justify-center align-center elevation-0">
            <v-card elevation="0" style="height: auto"
              class="d-flex justify-center align-center w-100 bg-grey-lighten-5 rounded-lg ">
              <v-progress-circular color="primary" indeterminate :size="87" :width="7"></v-progress-circular>
            </v-card>
          </div>
          <div v-else class="w-100 ">
    
            <SectionCourseDetailLearnBoxQuizTimer class="" :examTime="data.quiz.quiz_time" :elapsedTime="data.elapsed_time"
              @time-up="finishQuizRequest" />
    
            <v-card elevation="0" class=" bg-transparent ma-3 rounded-xl  ">
              <div class="d-flex flex-wrap">
                <div class="pa-2" v-for="(item, index) in questions" :key="item.id">
                  <v-btn
                    @click="navigationPanel(index)"
                    rounded="pill"
                    size="small"
                    :variant="currentQuestion === index ? 'flat' : 'tonal'"
                    :color="currentQuestion === index ? 'white' : isQuestionAnswered(item.id) ? 'green-lighten-2' : 'grey-lighten-2'"
                    class="font-weight-bold text-body-2"
                  >
                    {{ index + 1 }}
                  </v-btn>
                </div>
              </div>
            </v-card>

            <div class="position-absolute w-100 bottom-0">
              <div class="bg-blue-grey-darken-3 rounded-t-xl px-4 py-3">
                <div class="pa-2">
                  <v-btn @click="openConfirmDialog" :loading="loadingBtn" variant="tonal" color="white" rounded="lg"
                    class="text-auto w-100 mb-3">اتمام آزمون</v-btn>
                </div>
                <div class="d-flex align-center pb-3">
                  <div class="px-4 w-100">
                    <div>
                      <v-progress-linear color="white" rounded="xl" :model-value="percentageOfProgress"
                        :height="10"></v-progress-linear>
                    </div>
                  </div>
                  <div class="w-25 text-xs font-weight-black text-white mx-5 pb-0 mb-0 rtl">
                    {{ questions.length }} / {{ currentQuestion + 1 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-navigation-drawer>

        <v-app-bar elevation="0" class="border-b rtl">
          <v-app-bar-nav-icon class="" @click.stop="drawer = !drawer">
            <i class="fa fa-bars"></i>
          </v-app-bar-nav-icon>
          <template v-slot:append>
            <v-btn icon size="small" color="blue" variant="flat" @click="confirmExit" title="صفحه اصلی">
              <UIcon name="i-heroicons-home" class="w-5 h-5" />
            </v-btn>
            <v-btn icon class="mx-3" size="small" color="blue" variant="tonal" @click="confirmExit" title="بازگشت">
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            </v-btn>
          </template>
        </v-app-bar>

        <v-app class="mx-0 px-0" style="height: 100vh">
          <v-main align-self="center" cols="12" sm="12" md="8">
            <v-container class="pt-0">
              <div v-for="(item, index) in questions" v-show="index === currentQuestion" :key="item.id">
                <SectionCourseDetailLearnBoxQuizTestcard ref="testCards"
                  @current-question-plus-one="plusCurrentQuestion"
                  @current-question-minus-one="minusCurrentQuestion"
                  @selected-id="onAnswerUpdated(item.id, $event)"
                  :question="item" :quiz-report-id="data.id"
                  :saved-option-id="savedOptionFor(item.id)"
                  :saved-blank-answers="savedBlanksFor(item.id)" />
              </div>
            </v-container>
          </v-main>
        </v-app>
      </div>

      <!-- End Quiz Confirmation Dialog -->
      <v-dialog v-model="showConfirmModal" max-width="450">
        <v-card class="rtl pa-4 rounded-xl">
          <v-card-title class="text-h6 font-weight-bold">
            آیا از اتمام آزمون اطمینان دارید؟
          </v-card-title>
          <v-card-text class="py-3 text-body-1">
            <div class="d-flex justify-space-between my-2">
              <span>تعداد کل سوالات:</span>
              <span class="font-weight-bold">{{ questions.length }}</span>
            </div>
            <div class="d-flex justify-space-between my-2 text-green-darken-1">
              <span>پاسخ داده شده:</span>
              <span class="font-weight-bold">{{ answeredCount }}</span>
            </div>
            <div class="d-flex justify-space-between my-2 text-grey-darken-1">
              <span>بدون پاسخ:</span>
              <span class="font-weight-bold">{{ questions.length - answeredCount }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" color="grey-darken-1" @click="showConfirmModal = false">
              انصراف
            </v-btn>
            <v-btn variant="flat" color="blue" :loading="loadingBtn" @click="finishQuizRequest">
              تایید و اتمام آزمون
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
export default {
  setup() {
    definePageMeta({ layout: 'learn-dashboard', middleware: 'auth' })
    return { api: useApi() }
  },
  data() {
    return {
      currentQuestion: 0,
      percentageOfProgress: 0,
      loading: true,
      questions: [],
      data: null,
      drawer: true,
      loadingBtn: false,
      showConfirmModal: false,
      liveAnswers: {},
    };
  },
  computed: {
    answeredCount() {
      return this.questions.filter(q => this.isQuestionAnswered(q.id)).length;
    }
  },
  methods: {
    isQuestionAnswered(questionId) {
      if (this.liveAnswers[questionId] !== undefined) {
        return this.liveAnswers[questionId] !== null;
      }
      const optionAnswer = this.savedOptionFor(questionId);
      if (optionAnswer !== null) return true;
      const blankAnswers = this.savedBlanksFor(questionId);
      return blankAnswers.some(b => b.text && b.text.trim() !== '');
    },
    onAnswerUpdated(questionId, selectedVal) {
      this.liveAnswers[questionId] = selectedVal;
    },
    plusCurrentQuestion() {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.percentageOfProgress =
          (this.currentQuestion / (this.questions.length - 1)) * 100;
      }
    },
    minusCurrentQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.percentageOfProgress =
          (this.currentQuestion / (this.questions.length - 1)) * 100;
      }
    },
    async navigationPanel(index) {
      if (index === this.currentQuestion) return;
      try {
        const currentCard = this.$refs.testCards?.[this.currentQuestion];
        if (currentCard) await currentCard.saveAnswer();
      } catch (error) {
        console.error(error);
      }
      this.currentQuestion = index;
      this.percentageOfProgress =
        (this.currentQuestion / (this.questions.length - 1)) * 100;
    },
    savedOptionFor(questionId) {
      return this.data?.user_answer?.find(answer => answer.question?.id === questionId)?.answer ?? null;
    },
    savedBlanksFor(questionId) {
      return this.data?.blank_answers?.filter(answer => answer.question_id === questionId) ?? [];
    },
    openConfirmDialog() {
      this.showConfirmModal = true;
    },
    async finishQuizRequest() {
      this.showConfirmModal = false;
      this.loadingBtn = true;
      try {
        const testCardComponent = this.$refs.testCards?.[this.currentQuestion];
        if (testCardComponent) await testCardComponent.saveAnswer();
        await this.endQuiz();
      } catch (error) {
        console.error(error);
        this.loadingBtn = false;
      }
    },
    confirmExit() {
      if (confirm('آیا قصد خروج از آزمون را دارید؟ زمان آزمون به پایان نخواهد رسید اما تایمر همچنان فعال می‌ماند.')) {
        this.$router.push(`/course/learn/${this.$route.params.id}/${this.$route.params.session}/${this.$route.params.box}/quiz/`);
      }
    },
    async getData() {
      this.loading = true;
      try {
        const response = await this.api(`quiz/start-quiz/${this.$route.params.quiz_id}/`);
        this.questions = response.questions || [];
        this.data = response;
      } catch (error) {
        console.error("error: ", error);
      } finally {
        this.loading = false;
      }
    },
    async endQuiz() {
      await this.api(`quiz/end-quiz/${this.data.id}/`, { method: 'POST' });
      this.loadingBtn = false;
      await this.$router.push("/result/" + this.data.id);
    },
  },
  async mounted() {
    await this.getData();
  },
};
</script>

<style scoped>
.shadow-1 {
  box-shadow: rgba(var(--v-theme-shadow1), 0.05) 0px 30px 30px -30px !important;
}

.shadow-2 {
  box-shadow: rgba(50, 50, 93, 0.05) 0px 25px 40px -20px,
    rgba(0, 0, 0, 0.17) 0px 15px 30px -10px !important;
}

.shadow-3 {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 25px 40px -10px !important;
}
</style>
