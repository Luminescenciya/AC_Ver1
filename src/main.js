import Vue from 'vue'
import VueRouter from 'vue-router'
import SortedTablePlugin from 'vue-sorted-table'
import VueResource from 'vue-resource'
import './assets/css/style.css'
import './assets/css/font-awesome.min.css'
import './assets/css/material-design-iconic-font.min.css'


import header from './components/Header.vue'
import sidebar from './components/sidebar.vue'
import page404 from './components/page404.vue'
import Home from './components/MainMenuHome.vue'
import ContentEditing from './components/ContentEditing/MainMenuContentEditing.vue'
import TestAdvice from './components/ContentEditing/TestAdvice.vue'
import AddNewBlock from './components/ContentEditing/AddNewBlock.vue'
import EditBlocks from './components/ContentEditing/BlocksEdit.vue'
import EditAdvice from './components/ContentEditing/AdviceEdit.vue'
import EditBlock from './components/ContentEditing/BlockSettings.vue'
import EditText from './components/ContentEditing/TextEditing.vue'
import TranslateText from './components/ContentEditing/Translate.vue'
import KeysEditing from './components/ContentEditing/KeysEditing.vue'
import EditInfographic from './components/ContentEditing/InfographyEdit.vue'
import AddNewConsult from './components/ContentEditing/AddNewAdvice.vue'
import ConsultTemplate from './components/ContentEditing/AdviceTemplate.vue'
import TextBook from './components/Textbook/MainMenuTextbook.vue'
import EditTextTextbook from './components/Textbook/TextEditTextbook.vue'
import Publications from './components/Publications/MainMenuPublications.vue'
import NewPublication from './components/Publications/NewPublication.vue'
import PriceList from './components/PriceManagement/MainMenuPriceList.vue'
import EditPrice from './components/PriceManagement/EditPrice.vue'
Vue.use(VueRouter);
Vue.use(SortedTablePlugin);
Vue.use(VueResource);

var router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', redirect:'/Home'},
    {path: '/Home', component: Home},
    {path: '/ContentEditing',name: 'Content', component: ContentEditing,
      children:[
        {path: 'NewAdvice', name: 'ContentNewAdvice', component: AddNewConsult},
        {path: ':adviceName', name: 'ContentExist', component: ConsultTemplate},
        {path: ':adviceName/TestAdvice', name: 'TestAdvice', component: TestAdvice},
        {path: ':adviceName/NewBlock', name: 'ContentNewBlock', component: AddNewBlock},
        
        {path: ':advice_id/editText/:block_id/', name: 'ContentEditBlocks', component: EditBlocks, children:[
          {path: 'TextEditing', name: 'ContentEditText', component: EditText},
          {path: 'KeysEditing', name: 'ContentEditKeys', component: KeysEditing},
          {path: 'Settings', name: 'ContentEditBlock', component: EditBlock},
          {path: 'TextTranslate', name: 'ContentTranslateKeys', component: TranslateText},
          {path: 'InfographyEdit', name: 'ContentEditInfographic', component: EditInfographic},       
        ]},
        {path: ':adviceName/EditAdvice/:id', name: 'ContentEditAdvice', component: EditAdvice}
      ]},
    {path: '/Textbook', component: TextBook},
    {path: '/Textbook/Edit/:id', name:'EditTextTextbook', component: EditTextTextbook },
    {path: '/Publications', component: Publications },
    {path: '/Publications/New', name:'NewPublication', component: NewPublication },
    {path: '/PriceList', component: PriceList },
    {path: '/PriceList/Edit/:id', name:'EditPrice', component: EditPrice },
    {path: "*", name:'Page404',component: page404 }
  ]
})

Vue.http.options.root = process.env.VUE_APP_API_IP;
Vue.http.get(Vue.http.options.root+'/api/').then(() => {
  Vue.http.options.root = Vue.http.options.root + '/api/v1/';
  }).catch(() => {
    Vue.http.options.root = process.env.VUE_APP_API_IP_LOCAL + '/api/v1/';
  }).then(() => {
new Vue({
  data:{
    langs:[],
    choosenLangId:'',
    menu_toggle:false,
    scrollPosition:0,
    urlForRequest:Vue.http.options.root, 
    selectAdvice: ''
  },
  el: '#pager',
  components: {
    'sidebar':sidebar,
    'app-header': header
  },
  router: router,
  methods:{
    errorCatcher:function(response){
      let answer='';
      switch(response.status){
        case 400:
          
          if (Array.isArray(response.data) === false) {
            for (let [key , value] of Object.entries(response.data)) {
              answer=answer+key+': '+value+'\n'
            }
          } else if (response.data.every(x => typeof(x)==='object')) {
            for (let i=0; i<response.data.length; i++){
              for (let [key , value] of Object.entries(response.data[i])) {
                answer=answer+key+': '+value+'\n'
              }
            }
          }
          alert(answer);
          break;
        case 0:
          alert('Error: API is not available. Try later.');
          break;
        default:
          console.log(response)
          break;
      }
    },
    requestStarted: async function(){
      try{
        let response = await this.$http.get(this.$root.urlForRequest+'languages/')
        this.langs = response.body;
        if (localStorage.selectedAdvice) this.selectAdvice = JSON.parse(localStorage.selectedAdvice)
        if (localStorage.choosenLangId) this.choosenLangId = parseInt(localStorage.choosenLangId)
        else this.choosenLangId = this.langs[1].id;
      }
      catch(e){
        this.errorCatcher(e)
      }
    }
  },
  created(){
    this.requestStarted()
    if(window.innerWidth<=767){
        if(this.$router.currentRoute.name!=='ContentExist' && this.$router.currentRoute.name!=='ContentEditText')
          this.$router.push({ name: 'Content'})  
    }
  }, 
  watch: {
    choosenLangId () {
      localStorage.choosenLangId = this.choosenLangId
    }
  }
})
})
