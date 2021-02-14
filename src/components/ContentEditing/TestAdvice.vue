<template>
    <div class="TestAdvice card">
        <div class="card__head">
            <span class="card__title">Test Advice </span>
            <button onclick="history.back()" class="btn btn-primary">Back to Blocks</button>
        </div>
        <div class="card__body">
            <div class="line">
                <div class="form-group">
                    <label class="control-label">Select Language</label>
                    <select class="form-control" v-on:change="setupFunc()" v-model="$root.choosenLangId" required>
                        <option value="" disabled selected>Select Language</option>
                        <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="control-label">Click to Generate New Advice</label>
                    <button v-on:click="setupFunc()" class="btn btn-success">Generate New Data</button>
                </div>
                <div class="form-group">
                    <label class="control-label">Select Type of View</label>
                    <select class="form-control" v-model="typeOfView" required>
                        <option v-bind:value='true' selected>Mobile</option>
                        <option v-bind:value='false'>Full Info</option>
                    </select>
                </div>
            </div>
            <hr align="left" width="100%" size="6" color="#ffffff"/>
            <div class="error_block" v-if="errors.length>0">
                <div>
                    <span class="card__title error">Errors:  </span>
                </div>
                <div :key="l" v-for="(error,l) in errors" class="form-group">
                    <p class="control-label"> № {{l}}: {{error}}</p>
                </div>
            </div>
            <div v-if="showPreloader===true">
                <h3>Loading</h3>
            </div>
            <hr v-if="errors.length>0" align="left" width="100%" size="6" color="#ffffff"/>
            <div v-cloak v-if="advice.length>0" class='form_advice'>
                <template v-if="typeOfView===true">
                    <div  :key="z" v-for="(block,z) in advice">
                        <div v-if="block.title!=='' && block.content.length>0" class="line">
                            <div>
                                <h1 >{{block.title}}</h1>
                            </div>
                        </div>
                        <div v-if="block.subtitle!=='' && block.content.length>0" class="line">
                            <div>
                                <h3>{{block.subtitle}}</h3>
                            </div>
                        </div>
                        <div v-if="block.content.length>0 && block.type==='text'">
                            <div :key="i" v-for="(text,i) in block.content" >
                                <p  class="control-label">{{text}}</p>
                            </div>
                        </div>
                        <div v-if="block.content.length>0 && block.type==='info'">
                            <div :key="j" v-for="(text,j) in block.content">
                                <p class="control-label"> INFOGRAPHIC: {{text}}</p>
                            </div>
                        </div>
                        
                    </div>
                </template>
                <template v-else>
                    <div  :key="z" v-for="(block,z) in advice">
                        <div class="line">
                            <div>
                                <h1>Title: {{block.title}}</h1>
                                <h3>Subtitle: {{block.subtitle}}</h3>
                                <p>Block Name For CMS: {{block.block_name}}</p>
                                <p>Sorting Number:  {{block.sorting_number}}</p>
                                <p>Block Visible: {{block.has_unique_value}}</p>
                            </div>
                        </div>
                        <div v-if="block.type==='text'">
                            <p>Block Type: TEXT</p>
                            <div v-if="block.content.length!==1 && block.has_unique_value===true">
                                <h2 class="error">ERROR. Block Must Return 1 Text.</h2>
                            </div>
                            <div :key="i" v-for="(text,i) in block.content">
                                <p class="control-label">{{text}}</p>
                            </div>
                        </div>
                        <div v-if="block.type==='info'">
                            <p>Block Type: INFOGRAPHIC</p>
                            <div :key="j" v-for="(text,j) in block.content">
                                <p class="control-label"> TYPE: {{text}}</p>
                            </div>
                        </div>
                        <div class="form-group line">
                            <hr align="left" width="100%" size="6" color="#4B515B"/>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function (){
        return {
            blocks:[],
            advice:[],
            errors:[],
            showPreloader:true,
            typeOfView:true//true - мобильный, false - полный
        }
    },
    methods:{
        async setupFunc(){
            this.showPreloader = true;
            this.blocks=[];
            this.advice=[];
            this.errors=[];
            this.getAdvice()
        },
        getAdvice:function(){
            this.$http.get(this.$root.urlForRequest+'advices/').then(response => {
                this.id =response.body.filter(arr =>arr.private_name.replace(/\s/g, '') === this.$route.params.adviceName)[0].id;
                /* this.getRequest(); */
                this.$http.get(this.$root.urlForRequest+'advices/'+this.id+'/blocks/').then(response => {
                    this.blocks = response.body.sort((a,b) => a.sorting_number - b.sorting_number);
                    for(let i=0;i<this.blocks.length;i++){
                        this.advice.push({title:'',subtitle:'',content:[],type:'', has_unique_value:this.blocks[i].has_unique_value,
                        sorting_number:this.blocks[i].sorting_number, block_name:this.blocks[i].block_name})
                        //получение тайтлов/сабтайтлов
                        this.$http.get(this.$root.urlForRequest+'advices/'+this.id+'/blocks/'+this.blocks[i].id+'/lang-fields/').then(response => {
                            for (let j=0;j<response.body.length;j++){
                                if(response.body[j].language.id===this.$root.choosenLangId){
                                    this.advice[i].title=response.body[j].block_title
                                    this.advice[i].subtitle=response.body[j].block_subtitle 
                                }
                            }
                        }, response => {
                            this.$root.errorCatcher(response)
                        });
                        //получение условий и текстов
                        if(this.blocks[i].block_type.id===1){
                            this.advice[i].type='text'
                            this.$http.get(this.$root.urlForRequest+'advices/'+this.id+'/blocks/'+this.blocks[i].id+'/keys/').then(response => {
                                let value
                                if (this.blocks[i].has_unique_value===true){
                                    let rand=Math.floor(Math.random() * response.body.values.length)
                                    value = response.body.values[rand]
                                    if (value.text_id===null){
                                            this.errors.push(this.block[i].block_name+' has value without text')
                                    } else {
                                        this.$http.get(this.$root.urlForRequest+'texts/names/'+value.text_id+'/').then(response => {
                                            if(response.body.texts.filter(obj=>obj.language.id===this.$root.choosenLangId).length===0){
                                                this.errors.push(this.blocks[i].block_name+' has value without text on choosen lang')
                                            } else {
                                                this.advice[i].content.push(response.body.texts.filter(obj=>obj.language.id===this.$root.choosenLangId)[0].text)
                                            }
                                        }, response => {
                                            this.$root.errorCatcher(response)
                                        });
                                    }
                                } else {
                                    let allRand=[]
                                    for (let z=0;z<Math.floor((Math.random() * (4 - 0 + 1) + 0));z++){
                                        let rand=Math.floor(Math.random() * response.body.values.length)
                                        allRand.push(rand)
                                        if (rand in allRand){
                                            while(!(rand in allRand)){
                                                rand=Math.floor(Math.random() * response.body.values.length)
                                            }
                                        }
                                        value= response.body.values[rand]
                                        if (value.text_id===null){
                                            this.errors.push(this.block[i].block_name+' has value without text')
                                        } else {
                                            this.$http.get(this.$root.urlForRequest+'texts/names/'+value.text_id+'/').then(response => {
                                                if(response.body.texts.filter(obj=>obj.language.id===this.$root.choosenLangId).length===0 &&
                                                 this.errors[this.errors.length-1] !==this.blocks[i].block_name+' has value without text on choosen lang'){
                                                    this.errors.push(this.blocks[i].block_name+' has value without text on choosen lang')
                                                } 
                                                if (response.body.texts.filter(obj=>obj.language.id===this.$root.choosenLangId).length>0){
                                                    this.advice[i].content.push(response.body.texts.filter(obj=>obj.language.id===this.$root.choosenLangId)[0].text)
                                                }
                                            }, response => {
                                                this.$root.errorCatcher(response)
                                            });
                                        }
                                    }
                                } 
                            }, response => {
                                this.$root.errorCatcher(response)
                            });
                        } else {
                            this.advice[i].type='info'
                            this.advice[i].content.push(this.blocks[i].block_type.type_name)
                        }
                    }
                    
                }, response => {
                  this.$root.errorCatcher(response)
                });
            }, response => {
                this.$root.errorCatcher(response)
            })
            this.checkErrors()
            this.showPreloader = false
        },
        checkErrors:function(){
            for (let i=0;i<this.advice.length;i++){
                if(this.advice[i].has_unique_value===true && this.advice[i].content.length!==1){
                    this.errors.push(this.blocks[i].block_name+' has value without text 1')
                }
            }
            
        }
    },
    created(){
        this.setupFunc()        
    }
}
</script>

<style scoped>
    .error{
        color:red;
    }
    .error_block{
        border: 1px solid red;
        padding:1%;
    }
    h1, h2, h3{
        margin-top:0;
    }
    .form-group.line{
        margin-bottom:0;
    }
    .card__body .card__title {
        margin:20px 0
    }
    .form_advice{
        max-width:420px;
        max-height:600px;
        overflow-y: scroll;
        margin-left: 35%;
        border:10px solid #4B515B;
        border-radius:5px;
        overflow-x:hidden;
        padding:20px;
    }
    [v-cloak] {
        display: none;
    }
    p{
        white-space: pre-wrap;
    }
</style>