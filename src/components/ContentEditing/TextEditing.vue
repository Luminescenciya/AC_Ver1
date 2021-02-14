 <template>
    <div class="EditText card">
            <div class="card__column--left desktop">
                <div class="card__head">
                    <span class="card__title">Edit Text For {{this.$parent.blockData.block_name}} </span>
                    <div class="line">
                        <span>These publications are included in the mobile app</span>
                    </div>
                </div>
                <div class="card__body">
                    <div class="card__search">
                        <input type="text" class="card__search--left" v-on:change="search()" v-model="searchInput" placeholder="Search">
                        <select class="form-control" v-on:change="getTexts()" v-model="$root.choosenLangId" required>
                            <option value="" disabled selected>Select Language</option>
                            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                        </select>
                    </div>
                    <div class="container">
                        <template v-if="loadingBool===false">
                            <div class="container__row--new-text">
                                <div class="form-control text-area">
                                    <span class="card__title">Add new text</span>
                                    <button v-on:click="addText()" class="btn btn-primary btn-cross"><span class="fa fa-plus fa-lg"></span></button>
                                </div>
                            </div>
                            <div class="container__row" :key="i" v-for="(folder,i) in filteredList">
                                <div class="container__row--content">
                                    <input class="form-control" placeholder="Type textname here" v-model="folder.name">
                                    <textarea placeholder="Type text here" class="form-control text-area" v-model="folder.texts.filter(obj => obj.language_id===$root.choosenLangId)[0].text"></textarea>
                                    <button v-on:click="deleteText(folder.id)" class="btn btn-danger"> DELETE TEXT</button>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <h3>loading...</h3>
                        </template>
                    </div>
                    <button v-on:click="saveTexts" class="btn btn-success">SAVE TEXTS</button>
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
                    <button v-on:click="saveDraft" class="btn btn-success">SAVE DRAFT</button>
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
            foldersStart:[],
            searchInput:'',
            defaultText:{
                block_id:null,
                id:null,
                name:null,
                texts:[]
            },
            draft: '',
            loadingBool: true
        }
    },
    methods:{
        addText: function(){
            let newFolder = {
                block_id: this.$attrs.id,
                id:null,
                name:null,
                texts:[]
            };
            newFolder.texts.push({language_id: this.$root.choosenLangId, text: ''});
            this.folders.unshift(newFolder);
        },
        async saveTexts (){
            try{
                let newFolders = this.folders.filter(folder => folder.id===null && folder.name!=='' && folder.name!==null);
                console.log(newFolders)
                if (newFolders.length !== 0){
                    let newFoldersWithoutTexts = [];
                    let newFoldersWithTexts = [];
                    newFoldersWithoutTexts.push(newFolders.filter(x =>  x.texts.find(y => y.text.length===0 && y.language_id === this.$root.choosenLangId)));
                    newFoldersWithTexts.push(newFolders.filter(x =>  x.texts.find(y => y.text.length !== 0 && y.language_id === this.$root.choosenLangId)));
                    let dataWithTexts = [];
                    for (let i=0; i<newFoldersWithTexts[0].length; i++) {
                        dataWithTexts.push({language_id: newFoldersWithTexts[0][i].texts[0].language_id,
                                            text: newFoldersWithTexts[0][i].texts[0].text, 
                                            folder_name: newFoldersWithTexts[0][i].name,
                                            block_id: newFoldersWithTexts[0][i].block_id
                                            })
                    }
                    console.log(JSON.stringify(newFoldersWithoutTexts))
                    if (newFoldersWithoutTexts.length>0) this.$http.post(this.$root.urlForRequest+'key-folders/', newFoldersWithoutTexts[0]);
                    if (newFoldersWithTexts.length>0) this.$http.post(this.$root.urlForRequest+'texts/', dataWithTexts);
                }
                let newTexts = []
                let editedTexts = []
                for (let folder in this.folders) {
                    if(this.folders[folder].id!==null && this.folders[folder].texts.length>0) {
                        if (this.folders[folder].texts[0].id===undefined && this.folders[folder].texts[0].text.length>0){
                            let data = this.folders[folder].texts[0]
                            data.folder_id = this.folders[folder].id
                            newTexts.push(data)
                        } 
                        if(this.folders[folder].texts[0].id && this.foldersStart.filter(x => x.id===this.folders[folder].id && x.texts[0].text!==this.folders[folder].texts[0].text).length>0) {
                            let data = this.folders[folder].texts[0]
                            data.folder_id = this.folders[folder].id
                            editedTexts.push(this.folders[folder].texts[0])
                        }
                    }
                    
                }
                console.log('new',newTexts) 
                console.log(JSON.stringify(editedTexts))
                if (editedTexts.length > 0) this.$http.patch(this.$root.urlForRequest+'texts/', editedTexts);
                if (newTexts.length > 0) this.$http.post(this.$root.urlForRequest+'texts/', newTexts);
                let editedTextNames =  this.folders.filter(o1 => this.foldersStart.some(o2 => o1.id === o2.id && o1.name !== o2.name));
                console.log(editedTextNames)
                if (editedTextNames.length > 0) this.$http.patch(this.$root.urlForRequest+'key-folders/', editedTextNames);
                alert("Texts successfully saved")
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        search:function (){
            this.folders.Cop
        }, 
        async deleteText (id){
            if (confirm("Attention!\nThe key will be removed along with the text.\nAre you sure you want to remove this text?")) {
                this.folders.splice(this.folders.findIndex(function(i){return i.id === id;}), 1);
                await this.$http.delete(this.$root.urlForRequest+'key-folders/' + id + '/')
            } else {
                return
            }
            
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
        async saveDraft () {
            try {
                this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$parent.blockData.id+'/', {draft: this.$parent.blockData.draft});
            }
            catch (e) {
                this.$root.errorCatcher(e)
            }
        },
        async getTexts () {
            try{
                this.loadingBool = true;
                let response = await this.$http.get(this.$root.urlForRequest+'key-folders/?block_id='+this.$route.params.block_id+'&language_id='+this.$root.choosenLangId+'&include=texts');
                this.folders = response.body
                this.foldersStart = JSON.parse(JSON.stringify(response.body));
                for (let i in this.folders){
                    if(this.folders[i].texts.filter(obj => obj.language_id === this.$root.choosenLangId).length === 0){
                        this.folders[i].texts.push({language_id: this.$root.choosenLangId, text: ''})
                    }
                }
                this.loadingBool = false;
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        }
    },
    created(){
        this.getTexts()
    }, 
    computed: {
        filteredList() {
            return this.folders.filter(x => {
                if(x.name!==null) return x.name.toLowerCase().includes(this.searchInput.toLowerCase()) || x.texts[0].text.toLowerCase().includes(this.searchInput.toLowerCase())
                else return x
            })
        }
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
@media only screen and (max-width: 767px ) {
    .card .card__column--right{
        width:100%;
        height: 100%;
        margin:0;
    }
    .card .card__column--right .card__body{
        height: calc(100% - 50px);
    }
    .card{
        height:100%;
        min-height: 500px;
    }
    .EditText{
        height: 100%;
    }
}
@media only screen and (min-width: 768px ) {
    textarea, .text-area{
        resize: none;
        height:300px;
    }  
}
.quillWrapper {
    height: calc(100% - 46px);
}
.container{
    display:grid;
    grid-template-columns: auto auto;
    height: calc(100% - 106px);
    min-height: 420px;
    column-gap: 20px;
    margin-bottom: 8px;
    overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}
tbody tr {
    display:table;
    width:100%;
    table-layout:fixed;
}
.container__row * {
    margin-bottom:10px;
}
.fa{
    margin-bottom:0 !important;
}
div.text-area{
    border-style:dashed;
    border-width:2px;
    height: 296px;
    margin-top: 48px;
    padding: 0;
    width: calc(100% - 4px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
.card__search input,
.card__search span{
    width:70%;
    display: inline-block;
    margin-right: 2%;
}
.card__column--left .card__search select,
.card__column--right .card__search button {
    width:28%;
    display: inline-block;
    border-radius: 5px;
    position: absolute;
    height:100%;
    box-shadow: none;
    -webkit-box-shadow: none;
}
.card__column--right{
    width: 49%;
    margin-left: 1%;
    overflow:hidden;
}
.card__head{
  margin-bottom: 5px;
}
.card {
    flex-direction: row;
}
.card__body {
    height: calc(100% - 55px);
    display: flex;
    flex-direction: column;
}
</style>