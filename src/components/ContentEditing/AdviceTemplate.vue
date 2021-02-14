<template>
    <div v-cloak class="AdviceTemplate card">
        <template>
        <div class="card__head">
            <span v-if="blockSortingBool===false" class="card__title">{{ $root.selectAdvice.private_name }} Block Editing</span>
            <span v-else class="card__title">{{ $root.selectAdvice.private_name }} Block Sorting</span>
            <router-link v-if="blockSortingBool===false" :to="{ name: 'ContentNewBlock' }" tag="button" class="btn btn-primary desktop">Add New Block</router-link>
            <button v-if="blockSortingBool===false" type="button" v-on:click="blockSortingMode()" :class="{'btn btn-success btn-second desktop':blockSortingBool===false}">Block Sorting Mode</button>
            <button v-else type="button" v-on:click="checkSortChanges()" class="btn btn-success desktop">Block Editing Mode</button>
        </div>
        <div v-if="blocks" class="card__body">
            <div v-if="blockSortingBool===false" class="card__search">
                <input type="text" v-model="searchInput" placeholder="Search...">
            </div>
            <div class="line" v-else>
                <div class="form-group">
                    <label class="control-label">Move Block From</label>
                    <input min="1" type="number" v-bind:max="blocks.length" class="form-control" v-model="blockFrom" placeholder="Type № of Block" required>
                </div>
                <div class="form-group">
                    <label class="control-label">To</label>
                    <input min="1" v-bind:max="blocks.length" type="number" class="form-control" v-model="blockTo" placeholder="Type № of Block" required>
                </div>
                <div class="form-group">
                    <label class="control-label">Click to Move </label>
                    <button type="button" v-on:click="moveBlock()" v-bind:disabled="(blockFrom===blockTo)||blockFrom===null||blockFrom===''||blockFrom>blocks.length||blockTo===null||blockTo===''||blockTo>blocks.length" class="btn btn-success">Move Block</button>
                </div>
                <div v-if="blockChange===true && draggableBool===false" class="form-group">
                    <label class="control-label">Click to Save Sorting </label>
                    <button type="button" v-on:click="sortingRequest()" class="btn btn-primary">Save Block Sort</button>
                </div>
            </div>
            <SortedTable :values="blocks" :sort="'sorting_number'" class="table">
                <thead>
                    <tr v-if="blockSortingBool===false">
                        <th class="desktop"><SortLink name="sorting_number">№</SortLink></th>
                        <th><SortLink name="block_name" >BLOCK NAME #</SortLink></th>
                        <th class="desktop"><SortLink name="term.term_name">CONDITION TYPE #</SortLink></th>
                        <th class="desktop">SELECTED PARAMETER #</th>
                        <th class="desktop"><SortLink name="block_type.name">BLOCK TYPE</SortLink></th>
                        <th class="desktop"><SortLink name="has_unique_value">BLOCK VISIBLE</SortLink></th>
                        <th >ACTIONS</th>
                    </tr>
                    <tr v-else>
                        <th class="desktop">№</th>
                        <th>BLOCK NAME #</th>
                        <th class="desktop">CONDITION TYPE #</th>
                        <th class="desktop">SELECTED PARAMETER #</th>
                        <th class="desktop">BLOCK TYPE</th>
                        <th class="desktop">BLOCK VISIBLE</th>
                        <template v-if="!blockSortingBool">
                            <th >ACTIONS</th>
                        </template>
                    </tr>
                </thead>
                <draggable v-model="blocks" tag="tbody" id="tableBlocks" slot="body" slot-scope="sort" :key="updateInputs" :disabled="draggableBool" @change="changeSortIndex()">
                    <tr :class="{'tr-scrollable':blocks.length>6}" :key="block.sorting_number" v-for="block in sort.values" >
                        <td class="desktop">{{block.sorting_number}}</td>
                        <td>{{block.block_name}}</td>
                        <td v-if="block.term" class="desktop">{{block.term.term_name}}</td>
                        <td v-else class="desktop"></td>
                        <td class="desktop">
                            <template v-for="(lol,z) in block.default_term_arguments">
                                <label :key="z" v-if="block.default_term_arguments[z]!==null" class="control-label">{{block.default_term_arguments[z].name}} &#173;</label>
                            </template>
                        </td>
                        <td class="desktop">{{block.block_type.name.replace(/_/g," ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})}}</td>
                        
                        <td v-if="block.has_unique_value === false" class="td_icons desktop"><span class="fa fa-square fa-lg fa-red"></span></td>
                        <td class="td_icons desktop" v-else><span class="fa fa-square fa-lg fa-green"></span></td>
                        <template v-if="!blockSortingBool">
                            <td>
                                <router-link v-bind:disabled="blockSortingBool"
                                             :to="{ name: 'ContentEditBlocks',params:{advice_id: $root.selectAdvice.id, block_id: block.id} }"
                                             tag="button" class="btn btn-primary btn-second" >Edit</router-link>
                                <button class="btn btn-danger btn-cross desktop" v-on:click="if (blockSortingBool===false){blockDelete(block.id, block.block_name)}"><span class="fa fa-times fa-lg"></span></button>
                            </td>
                        </template>
                    </tr>
                </draggable>
            </SortedTable>
            <span class="desktop"># - Not displayed in mobile application</span>
        </div>
        <div v-else class="card__body">
            <span>There are no blocks in the advice</span>
        </div>
        </template>
    </div>
</template>

<script>
import saveState from 'vue-save-state';
import draggable from 'vuedraggable';

export default {
    mixins: [saveState],
    data: function (){
        return {
            blocks:[],
            allBlocks:[],
            blockChange: false,
            adviceExist:true,
            searchInput:null,
            draggableBool: true,
            blockSortingBool:false,
            blockFrom:null,
            blockTo:null,
            updateInputs:0, 
            saveScroll: false
        }
    },
    components: {
        draggable
    },
    methods: {
        checkSortChanges:function() {
            if(this.blockChange===true){
                var answer = confirm("Block sorting changed and not saved. \nYou really want to leave block sorting mode?");
                if (answer) {
                    this.blockSortingBool=!this.blockSortingBool;
                    this.blockChange=false;
                    this.$forceUpdate();
                } else {
                    return
                }
            } else {
                this.blockSortingBool=!this.blockSortingBool;
                this.$forceUpdate();
            }
        },
        getSaveStateConfig() {
            return {
                'cacheKey': 'searchInput',
            };
        },
        changeSortIndex:function(){
            this.blockChange = true;
            for(var i=0; i<this.blocks.length; i++){
                this.blocks[i].sorting_number=i+1;
            }
        },
        blockSortingMode:function() {
            this.blockSortingBool=!this.blockSortingBool;
            this.getBlocks();
        },
        moveBlock:function(){
            let blockFrom=parseInt(this.blockFrom)
            let blockTo=parseInt(this.blockTo)
            if (blockFrom>blockTo){
                blockFrom--
                blockTo--
                for(let i=blockTo; i<blockFrom; i++){
                    this.blocks[i].sorting_number++;
                }
                this.blocks[blockFrom].sorting_number=this.blocks[blockTo].sorting_number-1
            } else {
                this.blocks[blockFrom-1].sorting_number=this.blocks[blockTo-1].sorting_number
                for(let i=blockFrom; i<blockTo; i++){
                    this.blocks[i].sorting_number--;
                } 
            }
            this.blocks = this.blocks.sort((a,b) => a.sorting_number - b.sorting_number);
            if (JSON.stringify(this.blocks)!==JSON.stringify(this.allBlocks)){
                this.blockChange = true;
            } else {
                this.blockChange = false;
            }
            
        },
        async sortingRequest () {
            try{
                let json = [...this.blocks]
                let maxSort = 0
                for (let i=0;i<json.length;i++){
                    let {sorting_number, id} = json[i]
                    maxSort = (sorting_number>maxSort) ? sorting_number : maxSort
                    json[i] = {
                        sorting_number: sorting_number,
                        id: id
                    }
                    json[i].sorting_number=json[i].sorting_number+json.length
                }
                console.log(JSON.stringify(json))
                let response = await this.$http.patch(this.$root.urlForRequest+'blocks/edit-sorting/', json)
                console.log(response)
                this.getBlocks();
                alert("Block Sorted Successfully")
            }
            catch(e){
                this.$root.errorCatcher(e)
            }
        },
        saveScrollPosition () {
            this.$root.scrollPosition = this.$el.querySelector("#tableBlocks").scrollTop
        },
        getBlocks: async function() {
            this.blocks=[];
            this.blockChange=false;
            try {
                let response = await this.$http.get(this.$root.urlForRequest+'blocks/?advice_id='+JSON.parse(localStorage.selectedAdvice).id)
                this.blocks = await response.body.sort((a,b) => a.sorting_number - b.sorting_number);
                this.allBlocks = await JSON.parse(JSON.stringify(this.blocks))
                if (this.searchInput!=='' && this.searchInput!==null){
                    this.blocks=this.allBlocks.filter(obj=>obj.block_name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.term.term_name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.block_type.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.default_term_arguments.filter(arg=>arg!==null &&
                                                        arg.name.toLowerCase().includes(this.searchInput.toLowerCase())
                                                        ).length>0
                                                    )
                }
                if (this.allBlocks.length>0){
                    await this.$el.querySelector("#tableBlocks")
                    this.$el.querySelector("#tableBlocks").scrollTop=this.$root.scrollPosition;
                }
                }
            catch(e){
                this.$root.errorCatcher(e)
            }
            
            
        },
        blockDelete:async function(blockID, name){
            var answer = confirm('Delete Block "'+name+'"?');
            if (answer) {
                try{
                    await this.$http.delete(this.$root.urlForRequest+'blocks/'+blockID+'/');
                    await this.saveScrollPosition()
                    this.getBlocks();
                    alert("Block deleted");
                }
                catch(e){
                    this.$root.errorCatcher(e)
                }
                
            } else {
                return
            }
        },
        checkChanges:function(next){
            if(this.blockChange===true){
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
    },
    created() {
        this.getBlocks();
    },
    watch:{
        $route (){
            this.getBlocks()
        },
        blockSortingBool:function(){
            this.draggableBool=!this.blockSortingBool
        },
        searchInput:function(){
            this.blocks=this.allBlocks.filter(obj=>obj.block_name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.term.term_name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.block_type.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                                                    obj.default_term_arguments.filter(arg=>arg!==null &&
                                                        arg.name.toLowerCase().includes(this.searchInput.toLowerCase())
                                                        ).length>0
                                                    )
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.checkChanges(next)
    },
    beforeRouteLeave (to, from, next) {
        this.saveScrollPosition()
        this.checkChanges(next)
    }
}
</script>

<style scoped>
.btn-second{
   margin-right: 2%; 
}
td .btn-second{
   margin-right: 7%; 
}
.card__head button:first-child{
   margin-right: 0; 
}
.card__head select{
    display: inline;
    min-width: fit-content;
}
.card__body {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
}
.td_icons >.fa-red{
    color:#E7655A
}
.td_icons >.fa-green{
    color: #5AE77B;
}
.sortable-chosen{
    background:#f0f0f7;
}
.table {
    height: calc(100% - 93px);
    min-width: 1135px;
}
tbody {
    display:block;
    height: calc(100% - 45px);
    overflow-y: auto;
    overflow-x: hidden;
}


*::-webkit-scrollbar {
  width: 5px;
}
*::-webkit-scrollbar-thumb {
  background-color: #959599;
  border-radius: 20px;
}
thead, tbody tr {
    display:table;
    width:100%;
    table-layout:fixed;
}
.fa-times{
    cursor: pointer;
}
.card {
    height:100%;
    margin-bottom: 0;
}
</style>