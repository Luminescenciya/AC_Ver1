<template>
    <div class="EditBlock card">
        <template v-if="blockData!==null">
            <div class="card__head">
                <span class="card__title">Edit {{blockData.block_name}} </span>
            </div>
            <div class="card__body">
                <div v-if="errorsShow===true && errors.length>0">
                    <b class="error">Please correct the following error(s):</b>
                    <ul>
                      <li :key="i" v-for="(error,i) in errors">{{ error }}</li>
                    </ul>
                </div>
                <div class="line">
                    <div class="form-group">
                        <label class="control-label big">Block Name Editing</label>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Block Name For CMS #</label>
                        <input type="text" class="form-control" v-model="blockData.block_name" placeholder="Type Block Name Here">
                    </div>
                </div>

                <div v-if="editableVariables!==null" class="line">
                    <div class="form-group">
                        <label class="control-label big">Title/Subtitle Editing</label>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Title</label>
                        <input type="text" class="form-control" v-model="editableVariables.block_title" placeholder="Type Title Here">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Subtitle</label>
                        <input type="text" class="form-control" v-model="editableVariables.block_subtitle" placeholder="Type Subtitle Here">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Choose Language</label>
                        <select class="form-control" v-on:change="onLangChange" v-model="$root.choosenLangId" required>
                            <option value="" disabled selected>Select Language</option>
                            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                        </select>
                    </div>
                </div>
                <div class="line">
                    <div class="form-group">
                        <label class="control-label big">Block for All Users</label>
                    </div>
                    <div class="form-group">
                        <input v-model="blockData.has_unique_value" type="checkbox">
                    </div>  
                </div>
                <div v-if="blockData.has_unique_value===true" class="line">
                    <div v-if="defaultTexts===null" class="form-group">
                        <label class="control-label big">Loading Default Text...</label>
                    </div>
                    <template v-else>
                        <div class="form-group">
                            <label class="control-label big">Default Text For Block</label>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Default Text</label>
                            <textarea v-if="defaultText!==null" @change="defaultText.changed=true" rows="10" placeholder="Type Here" v-model="defaultText.text" class="form-control"></textarea>
                        </div>
                        <div  class="form-group">
                            <label class="control-label">Choose Language</label>
                            <select class="form-control" v-on:change="onLangChange" v-model="$root.choosenLangId" required>
                                <option value="" disabled selected>Select Language</option>
                                <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                            </select>
                            <div v-if="defaultTexts.id!==null">
                                <label class="control-label">Delete Text</label>
                                <button class="btn btn-danger" v-on:click="deleteDefault()">Delete Default Text</button>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="line">
                    <div class="form-group">
                        <button v-on:click="saveSettings" class="btn btn-primary">Save Settings</button>
                    </div>
                </div>
                <span># - Not show in mobile application</span>
            </div>
        </template>
        <div v-else class="card__head">
            <span class="card__title">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    data: function (){
        return {
            blockData: null,
            defaultTexts: null,
            defaultText: null,
            editableVariables: null,
            has_unique_value:false,
            errorsShow: false,
            errors: []
        }
    },
    methods:{
        async deleteDefault () {
            try{
                if (confirm('Are you sure you want to delete default text?')) {
                  if(this.defaultTexts.id!==null) await this.$http.delete(this.$root.urlForRequest+'key-folders/'+this.defaultTexts.id+'/')
                  this.defaultTexts = null
                  this.getDefault()
                } else {
                  return
                }
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        },
        async saveSettings () {
            try{
                let settings = {...this.blockData}
                let data = {}
                if (settings.has_unique_value_start!==settings.has_unique_value) {
                    data.has_unique_value = settings.has_unique_value
                    if (settings.has_unique_value===false && this.defaultTexts.id!==null) {
                        await this.$http.delete(this.$root.urlForRequest+'key-folders/'+this.defaultTexts.id+'/')
                        this.defaultTexts = null
                    }
                }
                if (settings.block_name!==settings.block_name_start) data.block_name = settings.block_name
                data.lang_data = settings.lang_data
                await this.$http.patch(this.$root.urlForRequest+'blocks/'+this.blockData.id+'/', data)
                //начало работы с дефолтными текстами
                let defaultTexts = {...this.defaultTexts}
                defaultTexts.texts = defaultTexts.texts.filter(x=> x.text!=='')
                if(this.blockData.has_unique_value===true && defaultTexts.texts.length>0 && this.defaultTexts.id===null) {
                    //сначала создаем фолдер с ключами 0, если его нет
                    let data = {
                        block_id: this.blockData.id,
                        folder_name: 'DEFAULT_TEXT',
                        values: []
                    }
                    for (let i in this.blockData.term.arguments_names.arguments_names) {
                        data.values.push({
                            argument_id: this.blockData.term.arguments_names.arguments_names[i].argument_id,
                            min: 0, max: 0
                        })
                    }
                    let response = await this.$http.post(this.$root.urlForRequest+'keys/', data)
                    console.log(response)
                    this.defaultTexts.id = response.body.folder.id
                }  
                let newTexts = []
                let editTexts = []
                console.log(JSON.parse(JSON.stringify(this.defaultTexts)))
                for (let text in this.defaultTexts.texts){
                    if (this.defaultTexts.texts[text].id===null && this.defaultTexts.texts[text].text!=='') newTexts.push({
                        folder_id: this.defaultTexts.id,
                        language_id: this.defaultTexts.texts[text].language_id,
                        text: this.defaultTexts.texts[text].text
                    })
                    if (this.defaultTexts.texts[text].id!==null && this.defaultTexts.texts[text].changed===true && this.defaultTexts.texts[text].text!=='') {
                        editTexts.push({
                            folder_id: this.defaultTexts.id,
                            id: this.defaultTexts.texts[text].id,
                            language_id: this.defaultTexts.texts[text].language_id,
                            text: this.defaultTexts.texts[text].text
                        })
                    }
                }
                //конец работы с дефолтными текстами
                if (newTexts.length>0) await this.$http.post(this.$root.urlForRequest+'texts/', newTexts)
                if (editTexts.length>0) await this.$http.patch(this.$root.urlForRequest+'texts/', editTexts)
                this.getData()
                alert('Settings saved!')
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        },
        onLangChange () {
            let variables = this.blockData.lang_data.filter( x => x.language_id === this.$root.choosenLangId)
            if (variables.length===0) {
                let data = {id: null, language_id: this.$root.choosenLangId, block_title: '', block_subtitle: ''}
                this.blockData.lang_data.push(data)
                this.editableVariables = data
            } else this.editableVariables = variables[0]

            if (this.defaultTexts===undefined) this.defaultTexts = { id: null, texts:[] }
            console.log(JSON.parse(JSON.stringify(this.defaultTexts)))
            let text = this.defaultTexts.texts.filter(x=>x.language_id===this.$root.choosenLangId)
            if (text.length===0) {
                let data = {id: null, language_id: this.$root.choosenLangId, text: ''}
                this.defaultTexts.texts.push(data)
                this.defaultText = data
            } else this.defaultText = text[0]
            console.log('changed')
        },
        async getDefault () {
            try{
                let response = await this.$http.get(this.$root.urlForRequest+'key-folders/?block_id='+this.$route.params.block_id+'&default_text=1&include=texts')
                this.defaultTexts = response.body[0]
                this.onLangChange()
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        },
        async getData () {
            try{
                let response = await this.$http.get(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/')
                this.blockData = response.body
                if (response.body.has_unique_value===true) this.getDefault()
                this.blockData.block_name_start = JSON.parse(JSON.stringify(this.blockData.block_name))
                this.blockData.has_unique_value_start = JSON.parse(JSON.stringify(this.blockData.has_unique_value))
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        }
    },
    created () {
        this.getData()
    },
    
}
</script>

<style scoped>
    .big{
        font-size: 16px;
        font-family: GilroyMedium;
        font-weight: normal;
        padding: 10px 15px;
    }
    .form-group .btn-primary{
        margin-top:10px;
    }
    textarea {
      resize: none;
    }
    input[type="checkbox"] {
        float: left;
    }
</style>