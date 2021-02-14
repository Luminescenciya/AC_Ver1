<template>
    <div class="AddNewBlock card">
        <div class="card__head">
            <span class="card__title">New Block for {{advice.private_name}}</span>
            <button class="btn btn-primary" onclick="history.back()">Back To Blocks</button>
        </div>
        <div class="card__body">
            <div v-if="errorsShow==true && this.errors.length>0">
                <b class="error">Please correct the following error(s):</b>
                <ul>
                  <li :key="i" v-for="(error,i) in this.errors">{{ error }}</li>
                </ul>
            </div>
            <div class="line">
                <div class="form-group">
                    <label class="control-label">Block Name #</label>
                    <input type="text" class="form-control" v-model="blockNameInput" placeholder="Type Block Name Here">
                </div>
            </div>
            <div class="line">
                <div class="form-group">
                    <label class="control-label">Select Type of Block</label>
                    <select  class="form-control" v-on:change="getTerms()" v-model="blockTypeSelect" required>
                        <option value="" disabled selected>Select Type of Block</option>
                        <option v-for="(content, z) in blockTypesList" :key="z" v-bind:value="content.id">{{content.name.replace(/_/g," ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) }}</option>
                    </select>
                </div>
                <div v-if="blockTypeSelect!==''" class="form-group">
                    <label class="control-label">Select Term</label>
                    <select  class="form-control" v-model="blockTermSelect" required>
                        <option value="" disabled selected>Select Term</option>
                        <option v-for="(content, z) in blockTermsList" :key="z" v-bind:value="content.id">{{content.term_name}}</option>
                    </select>
                </div>
            </div>
            <div v-if="langData.length>0" class="line">
                <div class="form-group">
                    <label class="control-label">Block Title</label>
                    <input type="text" class="form-control" v-model="langData.filter(x=>x.language_id===$root.choosenLangId)[0].block_title" placeholder="Type Block Name Here">
                </div>
                <div class="form-group">
                    <label class="control-label">Block Subtitle</label>
                    <input type="text" class="form-control" v-model="langData.filter(x=>x.language_id===$root.choosenLangId)[0].block_subtitle" placeholder="Type Block Name Here">
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
                    <span class="input-group-btn">
                        <button v-on:click="createBlock" class="btn btn-primary">Create Block</button>
                    </span>
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
            blockTypesList:[],
            blockTermsList:[],
            blockTypeSelect:'',
            blockTermSelect:'',
            blockNameInput:'',
            langData: [],
            errors:[],
            advice: {},
            errorsShow:false,
            blockSaved:false
        }
    },

    methods: {
        onLangChange () {
            if (this.langData.filter(x => x.language_id===this.$root.choosenLangId).length===0) this.langData.push({block_title: '', block_subtitle: '', language_id: this.$root.choosenLangId})
        },
        createBlock: async function (){
            this.errorsCheck();
            if (this.errors.length>0){
                return
            }
            this.errorsShow = false;
            try{
                let params ={};
                params.block_name = this.blockNameInput;
                params.advice_id = this.advice.id;
                if (this.blockTermSelect!=='') params.term_id = this.blockTermSelect
                
                params.block_type_id = this.blockTypeSelect;
                params.lang_data = this.langData.filter(x=>x.block_title!=='' && x.block_subtitle!=='')
                console.log(params)
                await this.$http.post(this.$root.urlForRequest+'blocks/', params )
                this.blockSaved = true;
                this.langData = [];
                this.blockTypeSelect = "";
                this.blockNameInput = "";
                this.onLangChange()
                alert("Block successfully created");   
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        },
        async getTerms () {
            try {
                this.blockTermSelect = ''
                let response = await this.$http.get(this.$root.urlForRequest+'block-types/'+this.blockTypeSelect+'/')
                this.blockTermsList = response.body.available_terms
            }
            catch(e){
                this.$root.errorCatcher(e)
            }

        },
        errorsCheck: function () {
            this.errors=[];
            if (this.blockNameInput =='') {
                this.errors.push('Name required.');
            }
            if (this.blockTypeSelect=='') {
                this.errors.push('Block Type required');
            }
            if(this.errors.length>0){
                this.errorsShow = true;
            } else {
                this.errorsShow = false;
            }
            
        },
    },
    async created () {
        try{
            let response = await this.$http.get(this.$root.urlForRequest+'block-types/');
            this.blockTypesList = response.body;
            let advices = await this.$http.get(this.$root.urlForRequest+'advices/')
            this.advice = advices.body.filter(arr =>arr.private_name.replace(/\s/g, '') == this.$route.params.adviceName)[0];
            this.onLangChange()
        } 
        catch(e){
            this.$root.errorCatcher(e)
        }
    },
    beforeRouteLeave (to, from, next) {
        if((this.blockNameInput !='')&& this.blockSaved===false){
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
    .line .form-group {
        display: inline-block;
    }
</style>