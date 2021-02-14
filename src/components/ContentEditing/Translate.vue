 <template>
    <div class="TranslateText card">
        <div class="card__column--left desktop">
            <div class="card__head">
                <span class="card__title">Translate Text For {{$parent.blockData.block_name}} </span>
            </div>
            <div class="card__body">
                <div class="card__search">
                    <input type="text" class="card__search--left" placeholder="Search" v-model="searchInput">
                    <button v-on:click="hideFull()" class="btn btn-success" v-if="filterButton===false">Hide full</button>
                    <button v-on:click="showAll()" class="btn btn-success" v-if="filterButton===true">Show All</button>
                </div>
                <table class="table__text-editing">
                    <thead>
                        <tr>
                            <th>
                                <select class="form-control" v-on:change="onLangChange()" v-model="$root.choosenLangId" required>
                                    <option value="" disabled selected>Select Language</option>
                                    <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                                </select>
                            </th>
                            <th>
                                <select class="form-control" v-on:change="onLangChange()" v-model="choosenLangIdForTranslate" required>
                                    <option value="" disabled selected>Select Language</option>
                                    <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                                </select>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <span :key="i" v-for="(row,i) in folders">
                        <tr>
                            <td>
                                <span v-on:click="row.visible=!row.visible; $forceUpdate()" class="control-label">{{row.name}}
                                    <span :style="{color:row.texts.filter(obj => obj.language_id === $root.choosenLangId)[0].text.length>0 ?  'green': 'red'}">&#9679;</span>
                                </span>
                                <textarea v-if="row.visible===true" :readonly="true" rows="10" placeholder="Type text here" class="form-control text-area" 
                                           v-model="row.texts.filter(obj => obj.language_id === $root.choosenLangId)[0].text"></textarea>
                            </td>
                            <td>
                                <span v-on:click="row.visible=!row.visible; $forceUpdate()" class="control-label">{{row.name}} 
                                    <span :style="{color:row.texts.filter(obj => obj.language_id === choosenLangIdForTranslate)[0].text.length>0 ?  'green': 'red'}">&#9679;</span>
                                </span>
                                <textarea v-if="row.visible===true" rows="10" placeholder="Type text here" class="form-control text-area" 
                                          v-model="row.texts.filter(obj => obj.language_id === choosenLangIdForTranslate)[0].text"></textarea>
                            </td>
                        </tr>
                        </span>
                    </tbody>
                </table>
                <button @click="saveTexts" class="btn btn-success">SAVE TEXTS</button>
            </div>
        </div>
        <div class="card__column--right">
            <div class="card__head">
                <span class="card__title">Draft</span>
                <div class="line">
                    <span>Here you can do the outline of the text</span>
                </div>
            </div>
            <div class="card__body">
                <vue-editor v-model="$parent.blockData.draft" :editorToolbar="$parent.customToolbar"></vue-editor>
                <button @click="saveDraft" class="btn btn-success">SAVE DRAFT</button>
            </div>
        </div>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
    components: {
      VueEditor
    },
    data: function (){
        return {
            folders:[],
            foldersCopy:[],
            translateTexts:[],
            searchInput:'',
            filterButton:false,
            choosenLangIdForTranslate:2
        }
    },
    methods:{
        hideFull:function(){
            this.filterButton=!this.filterButton;
            this.folders.forEach(arr=>{
                if(arr.texts.every(obj=>obj.text.length>0)){
                    arr.visible=false
                }
            })
        },
        showAll:function(){
            this.filterButton=!this.filterButton;
            this.searchInput='';
            this.folders.forEach (obj=>obj.visible=true);
        },
        checkChanges:function(next){
            let texts = JSON.parse(JSON.stringify(this.texts))
            let textsToParent = []
            for (let i=0;i<texts.length;i++){
                for (let j=0;j<texts[i].length;j++){
                    textsToParent.push(texts[i][j])
                }
            }
            this.$parent.texts = textsToParent
            next()
        },
        async saveTexts () {
            try{
                let dataEdit = []
                let dataNew = []
                for (let i in this.folders){
                    for (let z in this.folders[i].texts){
                        if(this.folders[i].texts[z].language_id===this.choosenLangIdForTranslate){
                            console.log(this.folders[i].texts[z], this.foldersCopy[i].texts.filter(x => x.language_id === this.choosenLangIdForTranslate))
                            if(this.folders[i].texts[z].id && this.folders[i].texts[z].text!==this.foldersCopy[i].texts[z].text) dataEdit.push(this.folders[i].texts[z])
                            else if (this.folders[i].texts[z].id===undefined && this.foldersCopy[i].texts.filter(x => x.language_id === this.choosenLangIdForTranslate)[0].text==='' && this.folders[i].texts[z].text!=='') {
                                let data = this.folders[i].texts[z]
                                data.folder_id = this.folders[i].id
                                dataNew.push(data)
                            }
                        }
                        
                    }
                    
                }
                console.log(JSON.stringify(dataEdit), dataNew)
                if (dataEdit.length > 0) await this.$http.patch(this.$root.urlForRequest+'texts/',dataEdit);
                if (dataNew.length > 0) await this.$http.post(this.$root.urlForRequest+'texts/',dataNew);
                this.getFoldersWithTexts()
                alert('Texts saved!')
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
            
        },
        onLangChange:function(){
            for (let i in this.folders){
                if(this.folders[i].texts.filter(obj => obj.language_id === this.$root.choosenLangId).length === 0){
                    this.folders[i].texts.push({language_id: this.$root.choosenLangId, text: ''})
                }
                if (this.folders[i].texts.filter(obj => obj.language_id === this.choosenLangIdForTranslate).length === 0){
                     this.folders[i].texts.push({language_id: this.choosenLangIdForTranslate, text: ''})
                }
            }
        },
        async saveDraft () {
            try {
                this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$parent.blockData.id+'/', {draft: this.$parent.blockData.draft});
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        async getFoldersWithTexts () {
            try{
                let response = await this.$http.get(this.$root.urlForRequest+'key-folders/?block_id='+this.$route.params.block_id+'&include=texts')
                this.folders=response.body
                for (let i in this.folders){
                    this.folders[i].visible=true
                }
                this.onLangChange()
                this.foldersCopy=JSON.parse(JSON.stringify(this.folders))

            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        }
    },
    watch:{
        searchInput () {
            if(this.searchInput!==''){
                this.filterButton=true
            } else {
                this.filterButton=false
            }
            this.folders.forEach (obj=>{
                if(obj.name.toLowerCase().includes(this.searchInput.toLowerCase())){
                    obj.visible=true
                } else {
                    obj.visible=false
                }
            }) 
        },
        choosenLangIdForTranslate () {
            localStorage.choosenLangIdForTranslate = this.choosenLangIdForTranslate
        }
    },
    created(){
        if(localStorage.choosenLangIdForTranslate) this.choosenLangIdForTranslate = parseInt(localStorage.choosenLangIdForTranslate)
        this.getFoldersWithTexts()
    }/* ,
    beforeRouteUpdate (to, from, next) {
        this.checkChanges(next)
    },
    beforeRouteLeave (to, from, next) {
        this.checkChanges(next)
    } */
}
</script>

    
<style scoped>
    .card__search input,
    .card__search span{
        width:73%;
        display: inline-block;
        margin-right: 2%;
    }
    textarea, .text-area{
      resize: none;
      height:300px;
    }
    .card__body .card__search {
        margin-top: 0px;
        margin-bottom: 5px;
    }
    .add-text{
        font-family: GilroyMedium;
        font-size: 13px;
    }
    
    ::-webkit-scrollbar {
        display: none;
    }
    table{
        border-spacing: 0;
        margin-bottom: 4px;
        height: calc(100% - 93px);
    }   
    thead {
        background: #ffffff;
    }
    tbody {
        display: block;
        height:100%;
        overflow-y: auto;
    }
    tbody tr ,
    thead tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    td:first-child,
    th:first-child{
        padding-right: 10px;
    }
    td:last-child,
    th:last-child{
        padding-left:10px;
    }
    td > span{
        padding-left:10px;
    }
    .card__column--left .card__search button {
        width:25%;
        display: inline-block;
        border-radius: 5px;
        position: absolute;
        height:100%;
        box-shadow: none;
        -webkit-box-shadow: none;
    }
    div.text-area{
        border-style:dashed;
        border-width:2px;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    div.text-area .line{
        text-align: center;
    }
    .card__column--left{
        width:49%;
        overflow:auto;
        float:left;
        margin-right:1%;
    }
    .card__head .line{
        line-height: 10px;
    }
    .control-label{
       cursor: pointer;
   }
    .card__head{
      margin-bottom: 5px;
    }
    .card__column--left .card__body {
        height: calc(100% - 45px);
    }
    .card__body {
        height: calc(100% - 55px);
        display: flex;
        flex-direction: column;
    }
    .card__column--right{
        width: 49%;
        margin-left: 1%;
        overflow:hidden;
    }
    .card {
        flex-direction: row;
    }
    .quillWrapper {
        height: calc(100% - 46px);
    }
    
</style>