<template>
    <div class="AddNewConsult card">
        <div class="card__head">
            <span class="card__title">New Advice</span>
            <button v-if="this.$attrs.selectedAdvice" onclick="history.back()" class="btn btn-primary">Back to Advices</button>
        </div>
        <div class="card__body">
            <div v-if="errorsShow==true && errors.length>0">
                <b class="error">Please correct the following error(s):</b>
                <ul>
                  <li :key="i" v-for="(error,i) in this.errors">{{ error }}</li>
                </ul>
            </div>
            <div class="line">
                <div class="form-group">
                    <label class="control-label">Advice Name for CMS #</label>
                    <input type="text" class="form-control" v-model="adviceNameInput" placeholder="Type name here">
                </div>
            </div>
            <div class="line">
                <div class="form-group">
                    <label class="control-label">Select Number of Uses</label>
                    <select class="form-control" required="" v-model="selectNum">
                        <option value=-1 disabled="" selected="">Select Type</option>
                        <option :key="i" v-for="(num, i) in usesNumber" v-bind:value="num">{{num.type_name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="control-label">Select Type</label>
                    <select class="form-control" required="" v-model="selectType">
                        <option value=-1 disabled="" selected="">Select Type</option>
                        <option :key="i" v-for="(type, i) in adviceTypes" v-bind:value="type">{{type.type_name}}</option>
                    </select>
                </div>
            </div>
            <div class="line">
                <div class="form-group">
                    <button v-on:click="createAdvice" class="btn btn-primary">Create</button>
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
            adviceNameInput:'',
            selectNum:-1,
            selectType:-1,
            usesNumber:[],
            adviceTypes:[],
            errors: [''],
            errorsShow: false,
            adviceSaved:false
        }
    },
    methods:{
        createAdvice: function (){
            this.errorsCheck();
            if(this.errorsShow===false){
                let params ={};
                params.private_name = this.adviceNameInput;
                params.number_of_use_type_id=this.selectNum.id;
                params.advice_type_id=this.selectType.id;
                this.$http.post(this.$root.urlForRequest+'advices/', params,{emulateJSON: true} ).then(response => {
                    if(response.status===201){
                        this.adviceSaved=true
                        alert("Advice successfully created");
                    }
                }, response => {
                    this.$root.errorCatcher(response)
                });
            }  
        },
        errorsCheck: function () {
            this.errors=[];
            if (this.adviceNameInput =='') {
                this.errors.push('Name required.');
            }
            if (this.selectNum==-1) {
                this.errors.push('Number of uses required');
            }
            if (this.selectType==-1) {
                this.errors.push('Type required');
            } 
            if (this.errors.length>0){
                this.errorsShow = true;
            } else {
                this.errorsShow = false;
            }
            
        },
    },
    async created(){
        try{
            let response = await this.$http.get(this.$root.urlForRequest+'advice-number-of-uses-types/');
            this.usesNumber = response.body;
            response = await this.$http.get(this.$root.urlForRequest+'advice-types/');
            this.adviceTypes = response.body;
        }
        catch(e){
            this.$root.errorCatcher(e)
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.adviceNameInput !='' && this.adviceSaved===false){
            var answer = confirm("Something has been changed and has not been saved on page. \nYou really want to leave this page?");
            if (answer) {
                next()
            } else {
                next(false)
            }
        } else {
            next()
        }
    },
    watch:{
        adviceNameInput:function(){
            this.adviceSaved=false
        }
    }
    
}
</script>