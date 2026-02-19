<template>
  <v-app>
    <v-main>
      <div elevation="0" style="height: 500px" class="d-flex justify-center align-center" v-if="loading == true"><v-progress-circular
          color="blue" indeterminate :size="80" :width="5"></v-progress-circular></div>
    
      <div v-else>
        <v-navigation-drawer width="300" elevation="0" color="blue-grey-darken-4" class="shadow-3 border-none " v-model="drawer" 
          location="right">
          <div v-if="loading == true" style="height: 95%" class="w-100  d-flex justify-center align-center elevation-0">
          
            <v-card elevation="0" style="height: auto"
              class="d-flex justify-center align-center w-100 bg-grey-lighten-5 rounded-lg "><v-progress-circular
                color="primary" indeterminate :size="87" :width="7"></v-progress-circular></v-card>
          </div>
          <div v-else class="w-100 ">
    
            <SectionCourseDetailLearnBoxQuizTimer class="" :examTime="data.quiz.quiz_time" :elapsedTime="data.elapsed_time"
              @time-up="finishQuizRequest" />
    
            <v-card elevation="0" class=" bg-transparent ma-3 rounded-xl  ">
    
              <div class="d-flex flex-wrap">
                <div class="  pa-3" v-for="item in questions" :key="item.id">
                  <v-btn @click="navigationPanel(item.id)" rounded="pill" size="small" icon=""
                    :variant="currentQuestion + 1 == item.id ? 'flat' : 'tonal'" color="white"
                    class=" font-weight-bold text-body-2 ">{{ item.id }}</v-btn>
                </div>
    
              </div>
             
            </v-card>
            <div class="position-absolute w-100 bottom-0">
              
              <div class="   bg-blue-grey-darken-3   rounded-t-xl  px-4 py-3">
                <div class="pa-2">
               <v-btn @click="finishQuizRequest()" :loading="loadingBtn"  variant="tonal" color="white" rounded="lg"
                 class=" text-auto w-100 mb-3">اتمام ازمون</v-btn>
             </div>
               <div class="d-flex align-center pb-3  ">
                 <div class=" px-4  w-100 ">
                   <div class="">
                     <v-progress-linear color="white" rounded="xl" :model-value="percentageOfProgress"
                       :height="10"></v-progress-linear>
                
                   </div>
                 </div>
                 <div class="  w-25 text-xs  font-weight-black text-white mx-5 pb-0 mb-0 rtl">
                   {{ questions.length }} / {{ currentQuestion + 1 }}
                 </div>
               </div>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
        <v-app-bar elevation="0"  class="border-b rtl ">
          <v-app-bar-nav-icon class="" @click.stop="drawer = !drawer">
            <i class="fa fa-bars"></i>
          </v-app-bar-nav-icon>
          <template v-slot:append>
            <v-btn icon=""  size="small" color="blue" variant="flat">
              <IconHomeMove size="18" />
          </v-btn>
          <v-btn icon="" class="mx-3" size="small" color="blue" variant="tonal">
              <IconArrowLeft size="20" />
          </v-btn>
          
        </template>
        </v-app-bar>
        <v-app class="mx-0 px-0" style="height: 100vh">
    
          <v-main align-self="center" cols="12" sm="12" md="8">
            <v-container class="pt-0">
    
    
              <div v-for="(item, index) in questions" v-show="index === currentQuestion" :key="item + index">
                <SectionCourseDetailLearnBoxQuizTimer ref="Testcard" @current-question-plus-one="plusCurrentQuestion"
                  @current-question-minus-one="minusCurrentQuestion" @selected-option-id="handleRadioSelected"
                  :question="item" />
              </div>
            </v-container>
          </v-main>
    
        </v-app>
      </div>
    </v-main>
  </v-app>
</template>
<script>

import axios from "axios";
import { IconHomeMove, IconArrowLeft } from '@tabler/icons-vue';

export default {
  components:{IconHomeMove,IconArrowLeft},
  data() {
    return {
      currentQuestion: 0,
      percentageOfProgress: 0,
      loading: true,
      questions: [],
      data: null,
      drawer: true,
      loadingBtn: false,
    };
  },
  methods: {
    plusCurrentQuestion() {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.percentageOfProgress =
          (this.currentQuestion / this.questions.length) * 100;
      } else {
        console.log("به همه سوالات پاسخ داده شده است");
      }
    },
    minusCurrentQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.percentageOfProgress =
          (this.currentQuestion / this.questions.length) * 100;
      } else {
        console.log("شما درحال حاضر در ابتدای سوالات هستید");
      }
    },
    navigationPanel(id) {
      this.currentQuestion = id - 1;
      this.percentageOfProgress =
        (this.currentQuestion / this.questions.length) * 100;
    },
    handleRadioSelected(selectedId) {
      // this.selectedOption[this.currentQuestion] = selectedId;
      console.log("Selected Options:", selectedId);
    },
    async finishQuizRequest() {
      this.loadingBtn = true;
      const testCardComponent = this.$refs.Testcard[this.currentQuestion];
      if (testCardComponent.selectedOption !== null) {
        await testCardComponent.sendUserAnswer();
      } else {
        await testCardComponent.sendBlankAnswer();
      }
      this.endQuiz();
    },
    getData() {
      this.loading = true;
      axios
        .get(
          `https://tedline.org/api/quiz/start-quiz/${this.$route.params.quiz_id}/`,
          {
            headers: {
              Authorization: this.$store.state.token != ''
                ? `Token ${this.$store.state.token}`
                : ''
            },
          }
        )
        .then((response) => {
          this.questions = response.data.questions;
          this.data = response.data;
          this.loading = false;
          console.log(this.data);
        })
        .catch((error) => {
          console.error("error: ", error);
        });
    },
    endQuiz() {
      axios
        .post(
          `https://tedline.org/api/quiz/end-quiz/${this.data.id}/`,
          {},
          {
            headers: {
              Authorization: this.$store.state.token != ''
                ? `Token ${this.$store.state.token}`
                : ''
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.loadingBtn = false;
            this.$router.push("/result/" + this.data.id);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  async mounted() {
    await this.$store.commit('onStart')
  
    this.getData();
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
