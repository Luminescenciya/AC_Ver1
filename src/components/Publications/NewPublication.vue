<template>
    <section class="NewPublication">
        <div class="card">
            <div class="card__head">
                <span class="card__title">New Publication</span>
                <button onclick="history.back()" class="btn btn-primary">Back to Publications</button>
            </div>
            <div class="card__body">
                <div class="line">
                    <div class="form-group">
                        <label class="control-label">Choose Advice</label>
                        <select v-model="consSelect" class="form-control" required>
                            <option value="" disabled selected>Select Advice</option>
                            <option :key="i" v-for="(cons, i) in consList" v-bind:value="cons.consultation_id">{{ cons.consultation_name }}</option> -->
                        </select>
                    </div>
                    <div v-if="consSelect.toString().length>0" class="form-group">
                        <label class="control-label">Choose Language</label>
                        <select class="form-control" v-model="$root.choosenLangId" required>
                            <option value="" disabled selected>Select Language</option>
                            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.lang_code">{{lang.lang_name}}</option>
                        </select>
                    </div>
                    <div v-if="consSelect.toString().length>0" class="form-group">
                        <label class="control-label">Status of Advice</label>
                            <table class="table no-margin">
                                <thead>
                                    <tr>
                                        <th class="MenuUsersName">NAME</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <router-link class="link" :to="{ name: 'ContentEditPic',params: { id: selectedCons } }" tag="td">Advice Picture</router-link>
                                        <td v-if="consultVariables.consultation_pictures == false"><span class="fa fa-times fa-lg"></span>Empty</td>
                                        <td v-if="consultVariables.consultation_pictures == true"><span class="fa fa-check fa-lg"></span>Checked</td>
                                    </tr>
                                </tbody>  
                            </table>
                    </div>
                    <div v-if="consSelect.toString().length>0" class="form-group">
                        <label class="control-label">Status of Blocks</label>
                        <VuePerfectScrollbar class="scroll-area">
                            <SortedTable :values="statuses" class="table no-margin">
                                <thead>
                                    <tr>
                                        <th class="MenuUsersName"><SortLink name="block_name">BLOCK NAME</SortLink></th>
                                        <th><SortLink name="status">STATUS</SortLink></th>
                                    </tr>
                                </thead>
                                <tbody slot="body" slot-scope="sort">
                                    <tr :key="i" v-for="(status, i) in sort.values">
                                        <router-link class="link" v-if="status.infographic_is_filled == false" :to="{ name: 'ContentEditInfographic',params: { id: selectedCons, name:status.block_name.replace(/\s/g, '') } }" tag="td">{{status.block_name}}</router-link>
                                        <router-link class="link" v-else-if="status.text_is_filled == false" :to="{ name: 'ContentEditText',params: { id: selectedCons, name:status.block_name.replace(/\s/g, '') } }" tag="td">{{status.block_name}}</router-link>
                                        <td v-else>{{status.block_name}}</td>
                                        <td v-if="status.infographic_is_filled == false || status.text_is_filled == false"><span class="fa fa-times fa-lg"></span>Empty</td>
                                        <td v-else-if="status.infographic_is_filled == true && status.text_is_filled == true"><span class="fa fa-check fa-lg"></span>Checked</td>
                                    </tr>
                                </tbody>  
                            </SortedTable>
                        </VuePerfectScrollbar>
                    </div>
                    <div v-if="consSelect.toString().length>0" class="form-group">
                        <label class="control-label">Status of Prices</label>
                        <table class="table no-margin">
                            <thead>
                                <tr>
                                    <th class="MenuUsersName">PRICE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <router-link class="link" :to="{ name: 'EditPrice',params: { id: selectedCons } }" tag="td">iOS Price</router-link>
                                    <td v-if="price.ios_bill_exist == true"><span class="fa fa-check fa-lg"></span>Checked</td>
                                    <td v-else><span class="fa fa-times fa-lg"></span>Missing</td>
                                </tr>
                                <tr>
                                    <router-link class="link" :to="{ name: 'EditPrice',params: { id: selectedCons } }" tag="td">Android Price</router-link>
                                    <td v-if="price.android_bill_exist == true"><span class="fa fa-check fa-lg"></span>Checked</td>
                                    <td v-else><span class="fa fa-times fa-lg"></span>Missing</td>
                                </tr>
                                <tr>
                                    <router-link class="link" :to="{ name: 'EditPrice',params: { id: selectedCons } }" tag="td">Gifts</router-link>
                                    <td v-if="price.gift_exist == true"><span class="fa fa-check fa-lg"></span>Checked</td>
                                    <td v-else><span class="fa fa-times fa-lg"></span>Missing</td>
                                </tr>
                            </tbody>
                        </table>
                        <button v-if="publishBool == true" class="btn btn-primary">Publish</button>
                    </div>  
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import consList from './newPubl.json'
import statuses from './status.json'
import prices from './priceCheck.json'
import consultVariabless from './consultationVariables.json'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import saveState from 'vue-save-state';
export default {
    mixins: [saveState],
    components: {
        VuePerfectScrollbar
    },
    data: function(){
        return {
            consSelect:'',
            selectedCons:'',
            consList:[],
            statuses:[],
            price:{},
            consultVariables:{},
            publishBool: false
        }
    },
    methods:{
        showPublishButton: function(){
            for (let i=0; i<this.statuses.length; i++ ){
                /* console.log(this.statuses[i].text_is_filled) */
                if (this.statuses[i].text_is_filled == false || this.statuses[i].infographic_is_filled == false){
                    return false
                }
            }
            for (let i=0; i<this.price.length; i++ ){
                if (this.price[i] == false){
                    return false
                }
            }
            return true;
        },
        getSaveStateConfig() {
            return {
                'cacheKey': 'consSelect',
            };
        },
    },
    created(){
        this.consList = consList.advices;
        this.statuses = statuses.blockStatus;
        this.price = prices;
        this.consultVariables=consultVariabless;
        this.publishBool=this.showPublishButton();
    },
    watch:{
        consSelect: function(){
            this.selectedCons = (this.consList.filter(arr =>arr.consultation_id == this.consSelect))[0].consultation_name.replace(/\s/g, '');
        }
    }
}
</script>

<style scoped>
    .form-group .router-link {
        background-color: #FFFFFF;
        border-left: 0;
    }
    .scroll-area {
        position: relative;
        margin: auto;
        width: 100%;
        height: 300px;
    }
    .link{
        cursor: pointer;
    }
    .form-group section {
        padding: 0;
    }
    .fa-times{
        color: red;
    }
    .fa-check{
        color: rgb(0, 175, 53);
    }
</style>