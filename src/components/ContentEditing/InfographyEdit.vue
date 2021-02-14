<template>
    <div class="EditInfographic card">
        <div class="card__head">
            <span v-if="blockData!==null" class="card__title">Edit Infographic For {{blockData.block_name}}</span>
        </div>
        <div class="card__body">
            <div class="line line__title">
                <div class="form-group">
                    <span class="card__title">Select Term</span>
                </div>
                <div class="form-group">
                    <select  class="form-control" v-on:change="onTermChange" v-model="blockTermSelect" required>
                        <option value="" disabled selected>Select Term</option>
                        <option v-for="(content, z) in blockTermsList" :key="z" v-bind:value="content.id">{{content.term_name}}</option>
                    </select>
                </div>
            </div>
            <div v-if="blockData!==null && blockData.term!==null">
                <label class="control-label">Filling order: {{argNames}}</label>
            </div>
        </div>
        <div v-if="defaultSettingsEditable.length>0" class="card__body">
            <div class="line">
                <span class="card__title">Default Settings</span>
            </div>
            <div :key="i" v-for="(setting, i) in defaultSettingsEditable" class="line">
                <div class="form-group">
                    <label class="control-label control-label__big">{{setting.ui_name}}</label>
                </div>
                <div class="form-group" v-if="setting.string && typeof(setting.string)==='string'">
                    <input class="form-control" placeholder="Type title Here" v-model="setting.string">
                </div>
                <template v-if="setting.string && Array.isArray(setting.string)">
                    <div :key="j" v-for="(one, j) in setting.string" class="form-group">
                        <input class="form-control" placeholder="Type title Here" v-model="setting.string[j]">
                    </div>
                </template>
                <template class="form-group" v-if="setting.number && Array.isArray(setting.number)">
                    <div :key="k" v-for="(one, k) in setting.number" class="form-group">
                        <input v-if="setting.number[k]>=0 && setting.number[k]<=1" class="form-control" type="number" step="0.1" placeholder="Type title Here" v-model="setting.number[k]">
                        <input v-else class="form-control" type="number" placeholder="Type title Here" v-model="setting.number[k]">
                    </div>
                </template>

                <template v-if="setting.image_id && images.length>0">
                    <div :key="pic.id" v-for="pic in images" class="form-group">
                        <template v-if="pic.image.image_base64===null">
                            <label class="control-label">Upload picture</label>
                            <input id="file-upload" accept="image/x-png" v-on:change="uploadImage($event)" type="file"/>
                            <label v-on:click="sortNum=pic.sorting_number" for="file-upload" class="custom-file-upload">
                                <i class="fa fa-cloud-upload big-icon"></i>
                            </label>
                            
                        </template>
                        <template v-else>
                            <label class="control-label">Picture</label>
                            <template v-if="pic.image.image_base64.length>0 " >
                                <div class="picture-small">
                                    <img :src="pic.image.image_base64"/>
                                    <button v-on:click="deleteImage(pic.sorting_number)" class="btn btn-success">Delete Picture</button>
                                </div>
                            </template>
                        </template>
                    </div>
                </template>

            </div>
            <div class="line">
                <div class="form-group">
                    <button v-on:click="imagesPostRequest()"  class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
        <div v-if="langSettingsEditable.length>0" class="card__body">
            <div class="line line__title">
                <div class="form-group">
                    <span class="card__title">Language Settings</span>
                </div>
                <div class="form-group">
                    <select class="form-control" v-on:change="onLangChange" v-model="$root.choosenLangId" required>
                        <option value="" disabled selected>Select Language</option>
                        <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                    </select>
                </div>
            </div>
            <div :key="i" v-for="(setting, i) in langSettingsEditable" class="line">
                <div class="form-group">
                    <label class="control-label control-label__big">{{setting.ui_name}}</label>
                </div>
                <div class="form-group" v-if="(setting.string  && (typeof(setting.string)==='string')) || setting.string==='' ">
                    <input class="form-control" placeholder="Type title Here" v-model="setting.string">
                </div>
                <template v-if="setting.string && Array.isArray(setting.string)">
                    <div :key="j" v-for="(one, j) in setting.string" class="form-group">
                        <input   class="form-control" placeholder="Type title Here" v-model="setting.string[j]">
                    </div>
                </template>
                <template class="form-group" v-if="setting.number && Array.isArray(setting.number)">
                    <div :key="k" v-for="(one, k) in setting.number" class="form-group">
                        <input v-if="setting.number[k]>=0 && setting.number[k]<=1" class="form-control" type="number" step="0.1" placeholder="Type title Here" v-model="setting.number[k]">
                        <input v-else class="form-control" type="number" placeholder="Type title Here" v-model="setting.number[k]">
                    </div>
                </template>
                <template v-if="setting.image_id && setting.image_id.length != 0">
                    <div :key="n" v-for="(pic, n) in setting.image_id" class="form-group">
                        <template v-if="pic!==null">
                            <label class="control-label">Picture</label>
                            <template  v-for="(image, z) in images.pics">
                                <template v-if="pic===image.id" >
                                    <div :key="z" class="picture-small">
                                        <img :src="image.pic"/>
                                        <button v-on:click="deleteImage(image.id, setting.ui_name)" class="btn btn-success">Delete Picture</button>
                                    </div>
                                    
                                </template>
                            </template>
                            
                        </template>
                        <template v-else>
                            <label class="control-label">Upload picture</label>
                            <input id="file-upload" accept="image/x-png" v-on:change="uploadImage($event, setting.ui_name)" type="file"/>
                            <label v-on:click="sortNum=obj.sorting_number" for="file-upload" class="custom-file-upload">
                                <i class="fa fa-cloud-upload big-icon"></i>
                            </label>
                        </template>
                    </div>
                </template>
            </div>
            <div class="line">
                <div class="form-group">
                    <button v-on:click="saveRequest()"  class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
     data: function (){
        return {
            blockData: null,
            langSettingsEditable:[],
            defaultSettingsEditable:[],
            images:[],
            startImages:[],
            imageKeys:[],
            previousObj:null,
            argNames:null,
            settings:null,
            new:true,
            langSettings:null,
            defaultSettings:null,
            adviceId:null,
            argumentsLength:0,
            blockTermSelect: '',
            blockTermsList: null
        }
    },
    methods: {
        onLangChange:function(){
            this.langSettingsEditable=[];
            this.langSettings=null;
            this.requestLangSettings()
        },
        getEditableKeys:function(obj,oneEditable, arrayToSettings){
            //type 0 - проход для получения, 1 - для сохранения
            for(let key in obj) {
                if (key==='editable' && obj[key]===true){
                    if(oneEditable===null){
                        if(obj.string && Array.isArray(obj.string)&& obj.string.length===0){
                            //заполняем массивы тем количеством переменных, сколько у нас имен аргументов
                            obj.string=Array.from(Array(this.argumentsLength), () => '')
                        }
                        arrayToSettings.push(obj)
                        if(obj.image_id){
                            for(let i=0;i<this.argumentsLength;i++){
                               this.images.push({image:{id:null,image_base64:null},sorting_number:i})
                               this.startImages.push({image:{id:null,image_base64:null},sorting_number:i})  
                            }
                            this.$http.get(this.$root.urlForRequest+'advices/'+this.adviceId+'/blocks/'+this.$route.params.id+'/images/').then(response => {
                                    if(response.body.images.length>0){
                                        for(let k=0;k<response.body.images.length;k++){
                                            for(let j=0;j<this.images.length;j++){
                                                if(this.images[j].sorting_number===response.body.images[k].sorting_number){
                                                    this.images[j]=response.body.images[k]
                                                    this.images[j].image.image_base64 = 'data:image/png;base64,'+this.images[j].image.image_base64
                                                    this.startImages[j]=JSON.parse(JSON.stringify(this.images[j]));
                                                    
                                                }
                                            }
                                        }
                                        this.$forceUpdate();
                                    }
                                }, response => {
                                    this.$root.errorCatcher(response)
                                });
                            
                            this.imageKeys.push(Object.keys(this.previousObj)[0])
                        } 
                    }
                    if(oneEditable!==null && obj.ui_name){
                        if(obj.ui_name===oneEditable.ui_name){
                            obj=oneEditable
                        }
                    }
                }
                if(typeof(obj[key])==='object'){
                    this.previousObj=obj
                    this.getEditableKeys(obj[key],oneEditable, arrayToSettings)
                } 
            }
        },
        onTermChange () {
            this.blockData.term=this.blockTermsList.filter(x=> x.id===this.blockTermSelect)[0]
            this.getTermNames()
        },
        getTermNames () {
            let names = ''
            this.argumentsLength=this.blockData.term.arguments_names.arguments_names.length;
            for (let i=0; i<this.blockData.term.arguments_names.arguments_names.length;i++){
                if (i!==this.blockData.term.arguments_names.arguments_names.length-1){
                    names = names + this.blockData.term.arguments_names.arguments_names[i].argument_names[0].name + ' - '
                } else {
                    names = names + this.blockData.term.arguments_names.arguments_names[i].argument_names[0].name
                }
            }
            this.argNames = names
        },
        async requestLangSettings() {
            try {
                let lang_settings = this.blockData.lang_settings
                if (lang_settings.length>0 && Object.keys(lang_settings.filter(obj =>obj.language_id===this.$root.choosenLangId)).length>0){
                    this.langSettings = lang_settings.filter(obj =>obj.language_id===this.$root.choosenLangId)[0].data.content;
                    this.new = false;
                    this.getEditableKeys(this.langSettings, null, this.langSettingsEditable);
                } else {
                    let response = await this.$http.get(this.$root.urlForRequest+'block-types/'+this.blockData.block_type.id+'/?include=settings_with_lang_template')
                    this.langSettings = response.body.settings_with_lang_template
                    this.blockData.lang_settings.push({id: null, language_id: this.$root.choosenLangId, data: response.body.settings_with_lang_template})
                    this.new = true
                    this.getEditableKeys(this.langSettings, null, this.langSettingsEditable);
                }  
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        async requestDefaultSettings() {
            try {
                this.defaultSettings = null
                this.defaultSettingsEditable = []
                if (this.blockData.settings!==null) this.defaultSettings = this.blockData.settings.data.content
                else {
                    let response = await this.$http.get(this.$root.urlForRequest+'block-types/'+this.blockData.block_type.id+'/?include=settings_without_lang_template')
                    this.blockData.settings = {id: null, data: response.body.settings_without_lang_template} 
                    this.defaultSettings = response.body.settings_without_lang_template
                    this.new = true
                }
                this.images=[],
                this.startImages=[],
                this.imageKeys=[],
                this.getEditableKeys(this.defaultSettings, null, this.defaultSettingsEditable);
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        async saveRequest () {
            try {
                for(let i=0; i<this.langSettingsEditable.length;i++){
                    this.getEditableKeys(this.langSettings, this.langSettingsEditable[i], null)
                }
                let data = {lang_settings: this.blockData.lang_settings, settings: this.blockData.settings}
                await this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/', data);

                if ((this.blockData.term_start===null && this.blockData.term!==null) || this.blockData.term_start.id!==this.blockData.term.id) await this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/', {term_id: this.blockTermSelect});
                alert('Settings saved!')
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        async imagesPostRequest() {
            let success = true
            for(let hoy=0;hoy<this.images.length;hoy++){
                if(JSON.stringify(this.images[hoy])!==JSON.stringify(this.startImages[hoy])){
                    success = await this.saveImagesChanges(hoy)
                }
            }
            if(success===true){
                this.saveDefaultRequest()
            } else {
                alert('Image Saving Error')
            }
        },
        saveImagesChanges:async function(hoy){
            if (this.images[hoy].image.id!==null && this.images[hoy].image.image_base64!==null && this.images[hoy].image.image_base64.length>0){
                try{
                    let response = await this.$http.post(this.$root.urlForRequest+'images/', {"image_base64":this.images[hoy].image.image_base64.replace('data:image/png;base64,','')})
                    this.images[hoy].image.id=response.body.id
                    if(this.images[hoy].id){
                        let dataForJson= this.images[hoy]
                        dataForJson.image_id=this.images[hoy].image.id
                        this.$http.patch(this.$root.urlForRequest+'advices/'+this.adviceId+'/blocks/'+this.$route.params.id+'/images/'+dataForJson.id+'/', dataForJson)
                        return true
                    }
                }
                catch(e){
                    this.$root.errorCatcher(e)
                    return false;
                }   
            } else if (this.images[hoy].image.id===null && this.images[hoy].image.image_base64!==null && this.images[hoy].image.image_base64.length>0) {
                try{
                    let response = await this.$http.post(this.$root.urlForRequest+'images/', {"image_base64":this.images[hoy].image.image_base64.replace('data:image/png;base64,','')})
                    this.images[hoy].image.id=response.body.id
                    let dataForJson={}
                    dataForJson.image_id=this.images[hoy].image.id
                    dataForJson.sorting_number=this.images[hoy].sorting_number
                    dataForJson.language_id=null
                    dataForJson.block_id=this.$route.params.id
                    dataForJson.field_name=this.imageKeys[0]
                    await this.$http.post(this.$root.urlForRequest+'advices/'+this.adviceId+'/blocks/'+this.$route.params.id+'/images/', dataForJson)
                    return true
                }
                catch(e){
                    this.$root.errorCatcher(e)
                    return false;
                }   
            } else if(this.images[hoy].image.image_base64===null && this.images[hoy].image.id!==null){
                try{
                    await this.$http.delete(this.$root.urlForRequest+'advices/'+this.adviceId+'/blocks/'+this.$route.params.id+'/images/'+this.images[hoy].id+'/')
                    await this.$http.delete(this.$root.urlForRequest+'images/'+this.images[hoy].image.id)
                    this.images[hoy].image.id=null;
                    return true
                }
                catch(e){
                    this.$root.errorCatcher(e)
                    return false;
                } 
            }    
        },
        uploadImage(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                for(let i=0;i<this.images.length;i++){
                    if (this.images[i].sorting_number===this.sortNum){
                        this.images[i].image.image_base64=e.target.result
                        this.$forceUpdate();
                    }
                }
            };
            
        },
        deleteImage(numberInArray){
            for (let i=0;i<this.images.length;i++){
                if (this.images[i].sorting_number===numberInArray){
                    this.images[i].image.image_base64=null
                }
            }
            this.$forceUpdate();
        },
        async getData () {
            try {
                let response = await this.$http.get(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/');
                this.blockData = response.body
                this.blockData.term_start = response.body.term
                if (response.body.term!==null) {
                    this.blockTermSelect = this.blockData.term.id
                    this.getTermNames()
                } 
                response = await this.$http.get(this.$root.urlForRequest+'block-types/'+this.blockData.block_type.id+'/')
                this.blockTermsList = response.body.available_terms
                this.requestDefaultSettings();
                this.requestLangSettings();
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        }

    },
    created(){
        this.getData()
    },
    beforeRouteLeave (to, from, next) {
        if(JSON.stringify(this.startImages) !== JSON.stringify(this.images)){
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
        
    }
    @media screen and (max-width: 1700px) {
        .big-icon {
            font-size: 70px;
        }
        
    }
    .form-group{
        padding: 0 5px 5px 5px;
        margin: 0;
        max-width: 25%;
        width: -webkit-fill-available;
        min-width: 0;
    }
    .line__title .form-group {
        max-width: 16%;
    }
    .picture-small{
        width: auto;
    }
    .picture-small img{
        max-width: 100%
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        border-radius: 5px;
        display: table-cell;
        padding: 20% 10%;
        cursor: pointer;
        text-align: center;
    }
    .control-label.control-label__big{
        font-size: 16px;
        font-family: GilroyMedium;
        font-weight: normal;
        padding: 10px 15px;
    }
    img {
        width: auto;
        height: auto;
        border-radius: 0;
        margin: 0;
    }
    .line .form-group{
        display: inline-grid;
    }
    .form-control{
        margin-bottom:5px;
    }
    .container:first-of-type{
        margin-top:0;
    }
    .container {
        width: auto;
        height: auto;
        margin-top:3%;
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
        padding: 3% 4% 1% 4%;
    }
    .custom-file-upload img{
        width: auto;
        height: 350px;
    }
    input[type="file"] {
        display: none;
    }
</style>