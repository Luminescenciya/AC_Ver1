<template>
    <section class="ContentEditing">
        <div v-if="this.$route.name === 'ContentExist'" class="card">
            <div class="card__head">
                <span @click="advicesShowBool=!advicesShowBool" class="card__title">Advices</span>
            </div>
            <div class="card__body">
                <div class="line">
                    <div class="form-group">
                        <label class="control-label">Select Advice</label>
                        <select class="form-control" v-on:change="onChangeSelect" v-model="$root.selectAdvice" required>
                            <option value="" disabled selected>Select Advice</option>
                            <option :key="index" v-for="(type, index) in advices" v-bind:value="type">{{type.private_name}}</option>
                        </select>
                    </div>
                    <div v-if="$root.selectAdvice!==''" class="form-group desktop">
                        <label class="control-label">Edit Advice</label>
                        <router-link  :to="{ name: 'ContentEditAdvice', params: { adviceName: $root.selectAdvice.private_name.replace(/\s/g, ''), id: $root.selectAdvice.id } }" tag="button" class="btn btn-success">
                            Settings
                        </router-link>
                    </div>
                    <div class="form-group desktop">
                        <label class="control-label">Create Advice</label>
                        <router-link v-if="$root.selectAdvice!==''" :to="{ name: 'ContentNewAdvice'}" tag="button" class="btn btn-primary ">Create</router-link>
                    </div>
                    <!-- <div v-if="$root.selectAdvice!==''" class="form-group line__button--right desktop">
                         <label class="control-label">Show Random Advice</label>
                        <router-link  :to="{ name: 'TestAdvice', params: { adviceName: $root.selectAdvice.private_name.replace(/\s/g, '') } }" tag="button" class="btn btn-success ">
                            Check Advice
                        </router-link>
                    </div> -->
                </div>
            </div>
        </div>
            <router-view></router-view>
    </section>
</template>

<script>
export default {
    data: function() {
        return {
            advices: []
        } 
    },
    methods: {
        onChangeSelect: function () {
            this.$router.push({ name: 'ContentExist', params: { adviceName: this.$root.selectAdvice.private_name.replace(/\s/g, '') }})
            localStorage.selectedAdvice = JSON.stringify(this.$root.selectAdvice)
        },
        redirectFromRoute: async function () {
            try{
                let response = await this.$http.get(this.$root.urlForRequest+'advices/')
                this.advices = response.body;
                if (this.$route.path === '/ContentEditing' && this.$route.path !== '/ContentEditing/NewAdvice'){
                    if (!localStorage.selectedAdvice) {this.$root.selectAdvice = this.advices[0];
                    localStorage.selectedAdvice = JSON.stringify(this.advices[0])}
                    if (this.advices.length !== 0){
                        this.$router.push({ name: 'ContentExist', params: { adviceName: this.$root.selectAdvice.private_name.replace(/\s/g, '')}})
                    } else {
                        this.$router.push({ name: 'ContentNewAdvice' })
                    }
                }
            } catch(e) {
                this.$root.errorCatcher(e)
            }
        }
    },
    created(){
        this.redirectFromRoute();  
    },
    watch: {
        '$route' () {
            this.redirectFromRoute();
        },
        advices: function () {
            if (this.$route.name === 'ContentExist'){
                this.$root.selectAdvice = this.advices.filter(obj=>obj.private_name.replace(/\s/g, '')===this.$route.params.adviceName)[0];
            } 
        }

    }
}
</script>

<style scoped>
.card__head {
    min-height: 0;
    line-height: inherit;
}
.card__title{
    cursor: pointer;
}
</style>