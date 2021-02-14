<template>
  <div class="EditAdvice card">
    <div class="card__head">
      <span class="card__title">Edit Advice</span>
      <button onclick="history.back()" class="btn btn-primary">Back to Blocks</button>
    </div>
    <div v-cloak class="card__body">
      <div v-if="errorsShow === true && errors.length > 0">
        <b class="error">Please correct the following error(s):</b>
        <ul>
          <li :key="i" v-for="(error, i) in this.errors">{{ error }}</li>
        </ul>
      </div>
      <div class="line">
        <div class="form-group">
          <label class="control-label big">Advice Settings for CMS</label>
        </div>
        <div class="form-group">
          <label class="control-label">Advice Name for CMS #</label>
          <input type="text" class="form-control" v-model="advice.private_name" placeholder="Type name here" required/>
        </div>
      </div>
      <div class="line">
        <div class="form-group">
          <label class="control-label big">Advice Settings for App</label>
        </div>
        <div class="form-group">
          <label class="control-label">Advice Name for App</label>
          <input type="text" class="form-control" v-model="adviceChoosenLangSettings.advice_name" placeholder="Type name here" required/>
        </div>
        <div class="form-group">
          <label for="message-text" class="control-label">Description</label>
          <textarea id="inputDescription" class="form-control" v-model="adviceChoosenLangSettings.advice_description" rows="5" placeholder="Type Here"></textarea>
        </div>
        <div class="form-group">
          <label class="control-label">Choose Language</label>
          <select class="form-control" v-on:change="onLangChange()" v-model="$root.choosenLangId" required>
            <option value="" disabled selected>Select Language</option>
            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{ lang.language_name }}</option>
          </select>
        </div>
      </div>
      <div class="line">
        <div class="form-group">
          <label class="control-label big">Image Settings</label>
        </div>
        <div class="line line-pic">
          <template v-if="choosenImages.length !== 0">
            <div :key="i" v-for="(obj, i) in choosenImages" class="form-group form-pic">
              <template v-if="obj.image.base64 !== null">
                <label class="control-label">Picture</label>
                <div class="picture-small">
                  <img :src="obj.image.base64" />
                </div>
                <button v-on:click="deleteImage(obj)" class="btn btn-success">Delete Picture</button>
              </template>
              <template v-else>
                <label class="control-label">Upload picture № {{ obj.sorting_number }}</label>
                <input id="file-upload" accept="image/x-png" v-on:change="uploadImage($event, obj)" type="file">
                <label v-on:click="sortNum = obj.sorting_number" for="file-upload" class="custom-file-upload">
                  <i class="fa fa-cloud-upload big-icon"></i>
                </label>
              </template>
            </div>
            <div v-if="this.choosenImages.filter((el) => el.image.base64 !== null).length > 0" class="form-group form-pic">
              <a v-on:click="previewShowBool = !previewShowBool" v-if="previewShowBool === false" class="control-label hidden-feature" >Show Preview</a>
              <a v-on:click="previewShowBool = !previewShowBool" v-if="previewShowBool === true" class="control-label hidden-feature" >Close Preview</a >
              <div v-if="previewShowBool === true" class="picture-small">
                <div :key="i" v-for="(ob, i) in choosenImages" class="parallax" v-bind:style="{ zIndex: picWeigth - i * 100 }">
                  <img v-if="ob.image !== undefined" :src="ob.image.base64"/>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="line">
        <div class="form-group">
          <button v-on:click="saveRequest" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
      <span># - Not displayed in mobile application</span>
    </div>
  </div>
</template>

<script>

export default {
  data: function (){
      return {
          errorsShow: false,
          errors: [''],
          advice:{},
          sortNum:null,
          adviceLangSettings:[],
          adviceChoosenLangSettings:{},
          startVariables:[],
          privateName:'',
          picId: 0,
          picWeigth: 1000,
          maxPic:4,
          images:[],
          choosenImages:[],
          startImages:[],
          previewShowBool:false
      }
  },
  methods: {
    onLangChange () {
      let data = this.advice.lang_data.filter( x=> x.language_id === this.$root.choosenLangId)
      if (data.length===0) {
        this.advice.lang_data.push({ new: true, advice_description: null, advice_name: null, id: null, language_id: this.$root.choosenLangId })
        this.adviceChoosenLangSettings = this.advice.lang_data.filter( x=> x.language_id === this.$root.choosenLangId)[0]
      } else {
        this.adviceChoosenLangSettings = data[0]
        data[0].start_values = {...data[0]}
      }
      let temp = this.advice.images.filter( x=>x.language_id===this.$root.choosenLangId)
      for(let i=1;i<= this.maxPic;i++) {
        if (temp.filter(x=>x.sorting_number===i).length===0) temp.push({image:{ id:null,base64:null }, sorting_number: i})
      }
      this.choosenImages=temp
    },
    uploadImage(e, obj){
      console.log(obj)
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e =>{
          this.picWeigth = this.picWeigth-100;
          obj.image.base64 = e.target.result
      }
    },
    deleteImage(obj){
      console.log(obj)
      obj.image.base64 = null
      obj.image.id = null
      this.picWeigth = this.picWeigth+100
    },
    async saveRequest () {
      try{
        let advice = JSON.parse(JSON.stringify(this.advice))
        for (let i in advice.images) {
          advice.images[i].image.base64 = advice.images[i].image.base64.replace('data:image/png;base64,', '')
        }
        await this.$http.patch(this.$root.urlForRequest+'advices/'+this.$route.params.id+'/', advice)
        this.getData()
        alert('Saved!')
      }
      catch(e){
        this.$root.errorCatcher(e)
      }
    },
    async getData () {
      try{
        let response = await this.$http.get(this.$root.urlForRequest+'advices/'+this.$route.params.id+'/')
        this.advice = response.body
        for (let i in this.advice.images) {
          this.advice.images[i].image.base64 = 'data:image/png;base64,' + this.advice.images[i].image.base64
        }
        this.onLangChange()
      }
      catch(e){
          this.$root.errorCatcher(e)
      }
    }
  },
  created(){
    this.getData()
  },
  beforeRouteLeave (to, from, next) {
        var start = this.startVariables;
        var end = this.adviceLangSettings;
        if(start.advice_name !=end.advice_name || start.advice_description != end.advice_description){
            var answer = confirm("Something has been changed and has not been saved on page. \nYou really want to leave this page?");
            if (answer) {
                next()
            } else {
                next(false)
            }
        } else {
            next()
        }
  }
}
</script>

<style scoped>
@media screen and (min-width: 1701px) {
  .big-icon {
    font-size: 80px;
  }
  .form-group.form-pic {
    width: 13%;
  }
  .custom-file-upload {
    padding: 50px;
  }
  .picture-small img {
    height: 200px;
  }
}
@media screen and (max-width: 1700px) {
  .big-icon {
    font-size: 70px;
  }
  .card__body .form-group {
    width: 15%;
  }
  .custom-file-upload {
    padding: 20px 25px;
  }
  .picture-small img {
    height: 140px;
  }
}
.big {
  font-size: 16px;
  font-family: GilroyMedium;
  font-weight: normal;
  padding: 10px 15px;
}
.form-group button {
  margin-top: 10px;
}
.parallax {
  position: absolute;
}
.picture-small img {
  margin: 0;
  width: auto;
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.custom-file-upload img {
  width: auto;
  height: 350px;
}
.big-icon {
  font-size: 80px;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: table-cell;
  cursor: pointer;
  text-align: center;
}
.form-group.form-pic {
  margin-right: 30px;
  width: 12%;
}
</style>