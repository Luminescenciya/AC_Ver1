<template>
    <section class="EditTextTextbook">
        <div class="card">
            <div class="card__head">
                <span v-if="folder!==null" class="card__title">Edit Text {{folder.name}}</span>
                <button onclick="history.back()" class="btn btn-primary">Back to Textbook</button>
            </div>
            <div v-if="texts!==null" class="card__body">
                <div class="line">
                    <div class="form-group">
                        <label class="control-label">Select Language</label>
                        <select  class="form-control" v-on:change="changeText" v-model="$root.choosenLangId" required>
                            <option value="" disabled selected>Select Language</option>
                            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option> 
                        </select>
                    </div>
                    <!-- <div class="form-group">
                        <a v-on:click="textViewerBool =!textViewerBool" v-if="textViewerBool===false" class="control-label extra">Open Text Viewer</a>
                        <a v-on:click="textViewerBool =!textViewerBool" v-if="textViewerBool===true" class="control-label extra">Close Text Viewer</a>
                        <template v-if="textViewerBool===true">
                            <div>
                                <label class="control-label">Select Language for Text View</label>
                                <select  class="form-control" v-on:change="changeTextarea" v-model="selectTextLang" required>
                                    <option value="" disabled selected>Select Language</option>
                                    <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                                </select>
                            </div>
                            <div>
                                <label class="control-label">Text</label>
                                <textarea rows="10" placeholder="Type Here" v-model="textareaView" class="form-control" readonly></textarea>
                            </div>
                        </template> 
                    </div> -->
                </div>
                <div class="line">
                    <div class="form-group">
                        <label class="control-label">Text</label>
                        <textarea rows="10" placeholder="Type Here" v-model="texts.filter(x=>x.language_id === $root.choosenLangId)[0].text" class="form-control"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <span class="input-group-btn">
                        <button class="btn btn-primary" v-on:click="updateText()">Save Text</button>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data: function (){
        return {
            titleField:"",
            selectTextLang:"",
            textareaView:"",
            texts: null,
            folder: null,
            text_start:"",
            textViewerBool:false
        }
    },
    methods:{
        changeText() {
            if (this.texts.filter(arr =>arr.language_id === this.$root.choosenLangId).length===0) this.texts.push({id: null, language_id: this.$root.choosenLangId, text: "", text_start: ""})
            this.textOnChoosenLang = this.texts.filter(arr =>arr.language_id === this.$root.choosenLangId)[0].text
        },
        /* changeTextarea:function(){
            if (this.texts.filter(arr =>arr.language.id === this.selectTextLang).length>0){
                this.textareaView = (this.texts.filter(arr =>arr.language.id === this.selectTextLang))[0].text;
            } else {
                this.textareaView="";
            }
        }, */
        async updateText () {
            try {
                if(this.texts.every(x => x.text_start===x.text)) {
                    alert('Nothing Changed')
                    return
                }
                if(this.texts.some(x=>x.text==="" && x.text_start!=="")) {
                    alert('Text cannot be empty')
                    return
                }
                let editTexts = []
                let newTexts = []
                for (let i in this.texts) {
                    if(this.texts[i].id!==null && this.texts[i].text_start!==this.texts[i].text) {
                        editTexts.push({id: this.texts[i].id, language_id: this.texts[i].language_id, text: this.texts[i].text})
                    }
                    if(this.texts[i].id===null && this.texts[i].text_start!==this.texts[i].text) {
                        newTexts.push({folder_id: this.folder.id, language_id: this.texts[i].language_id, text: this.texts[i].text})
                    }
                }
                if (editTexts.length>0) await this.$http.patch(this.$root.urlForRequest+'texts/', editTexts)
                if (newTexts.length>0) await this.$http.post(this.$root.urlForRequest+'texts/', newTexts)
                this.textRequest()
                alert("Text Edited Successfully")
            }
            catch(e) {
                this.$root.errorCatcher(e)
            }
        },
        async textRequest () {
            try {
                let response = await this.$http.get(this.$root.urlForRequest+'key-folders/'+this.$route.params.id+'/?include=texts')
                this.folder = response.body
                this.texts = response.body.texts
                for (let i in this.texts) {
                    this.texts[i].text_start = JSON.parse(JSON.stringify(this.texts[i].text))
                }
                this.changeText()
            }
            catch(e) {
                this.$root.errorCatcher(e)
            }
        }
    },
    created() {
        this.textRequest()
    }
}
</script>


<style scoped>
    textarea {
        resize: none;
    }
    .form-group {
        width: 20%;
        margin-right: 1%;
        display: inline-table;
    }
    .form-control[readonly]{
        border-bottom-style: solid;
    }
    .extra{
        cursor: pointer;
        color:rgb(86, 192, 231);
    }
</style>