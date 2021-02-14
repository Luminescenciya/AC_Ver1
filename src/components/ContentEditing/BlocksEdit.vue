<template>
    <div class="block__edit--menu">
        <div class="line">
            <div class="rectangle desktop">
                <template v-if="blockData===null">
                    Loading...
                </template>
                <template v-else-if="blockData.block_type.id===1">
                    <router-link tag="div" class="rectangle__button--left" :to="{name:'ContentEditText'}">
                        <span class="rectangle__text">TEXT</span>
                    </router-link>
                    <router-link tag="div" class="rectangle__button--center" :to="{name:'ContentEditKeys'}">
                        <span class="rectangle__text">KEYS</span>
                    </router-link>
                    <router-link tag="div" class="rectangle__button--center" :to="{ name: 'ContentEditBlock'}">
                        <span class="rectangle__text">SETTINGS</span>
                    </router-link>
                    <router-link  :to="{ name: 'ContentTranslateKeys'}" tag="div" class="rectangle__button--right">
                        <span class="rectangle__text">TRANSLATE MODE</span>
                    </router-link>
                </template>
                <template v-else>
                    <router-link tag="div" class="rectangle__button--left" :to="{name:'ContentEditInfographic'}">
                        <span class="rectangle__text">INFOGRAPHIC</span>
                    </router-link>
                    <router-link :to="{name: 'ContentEditBlock'}" tag="div" class="rectangle__button--right">
                        <span class="rectangle__text">SETTINGS</span>
                    </router-link>
                </template>
            </div>
            <div v-if="this.$root.selectAdvice"  class="line__button--right">
                <router-link tag="button" :to="{ name: 'ContentExist',params: {adviceName: this.$root.selectAdvice.private_name.replace(/\s/g, '')}}" class="btn btn-primary">Back to Blocks</router-link>
            </div>
        </div>
        <router-view v-if="blockData!==null" class="view" :id="blockData.id"></router-view>
    </div>
</template>
<script>
export default {
    data: function (){
        return {
            choosenTerm: '', 
            blockData: null,
            default_term_arguments: [],
            customToolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }]
            ]
        }
    },
    async created(){
        try{
            let response = await this.$http.get(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/')
            this.blockData = response.body
            this.default_term_arguments = JSON.parse(JSON.stringify(response.body.default_term_arguments))
            if (this.$route.name==='ContentEditBlocks') {
                if (response.body.block_type.id===1) this.$router.push({ name: 'ContentEditText' })
                else this.$router.push({ name: 'ContentEditInfographic' })
            }
        }
        catch(e){
            this.$root.errorCatcher(e)
        }
    }
    
}
</script>



<style scoped>
.rectangle__text{
    font-size:15px;
}
.block__edit--menu{
    height: 100%;
}
.card {
    height: calc(100% - 93px);
}
@media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
    .line .line__button--right{
        width:100%;
    }
    .block__edit--menu{
        height: -webkit-fill-available;
    }
}
.line__button--right{
    width:20%;
    display: flex;
}
.line{
    margin-bottom:15px;
}
.rectangle{
    height:38px;
    display: flex;
}
.rectangle__button--left,
.rectangle__button--right,
.rectangle__button--center{ 
    display: inline-block;
    background-color:#fff;
    width: 150px;
    text-align: center;
    color: #000;
    cursor: pointer;
    padding: 5.5px 1%;
}
.rectangle__button--left{
    border-radius:5px 0 0 5px;
}
.rectangle__button--right{ 
    border-radius:0 5px 5px 0;
}
.rectangle__button--left.router-link-active ,
.rectangle__button--right.router-link-active,
.rectangle__button--center.router-link-active {
    text-decoration:none;
    border-left: none;
    border-bottom: 3px solid #5DC0E7;
    margin-bottom: -3px;
}
</style>