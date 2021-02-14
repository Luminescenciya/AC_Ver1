<template>
    <section class="TextBook">
        <div class="card">
            <div class="card__head">
                <span class="card__title">Textbook</span>
            </div>
            <div class="card__body">
                <div class="line">
                    <div class="form-group">
                        <label class="control-label">Select Advice</label>
                        <select class="form-control" v-on:change="getTexts(selectAdvice)" v-model="selectAdvice" required>
                            <option value="" disabled selected>Select Advice</option>
                            <option :key="index" v-for="(consultation, index) in advices" v-bind:value="consultation.id">{{consultation.private_name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Select Language</label>
                        <select class="form-control" v-on:change="getTexts(selectAdvice)" v-model="$root.choosenLangId" required>
                            <option value="" disabled selected>Select Language</option>
                            <option :key="i" v-for="(lang, i) in this.$root.langs" v-bind:value="lang.id">{{lang.language_name}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectAdvice!==''" class="card">
            <span v-if="(textsAll===null || textsAll.length===0) && selectAdvice!==''" class="card__title">Advice have 0 texts</span>
            <template v-if="textsAll!==null && textsAll.length>0 && selectAdvice!==''">
                <div class="card__head">
                    <span class="card__title">All Texts For Advice</span>
                </div>
                <div class="card__body">
                    <div class="card__search">
                        <div class="icon-wrap">
                            <div class="icon-search"><i class="glyphicon glyphicon-search"></i></div>
                        </div>
                        <div class="input-group input-group-lg">
                            <div class="input-group-content">
                                <input type="text" v-model="searchInput" placeholder="Search">
                            </div>
                        </div>
                    </div>
                    <SortedTable :values="displayedPosts" class="table no-margin">
                        <thead>
                            <tr>
                                <th class="table__first-column"> <SortLink name="text_name.text_name">TEXT NAME</SortLink></th>
                                <th>TEXT</th>
                                <th class="table__last-column">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody slot="body" slot-scope="sort">
                            <tr :key="i" v-for="(text,i) in sort.values">
                                <td>{{text.folder.name}}</td>
                                <td><p>{{text.text}}</p></td>
                                <td>
                                    <router-link  :to="{ name: 'EditTextTextbook', params:{id: text.folder.id}}" append><button class="btn btn-primary" >Edit</button></router-link>
                                </td>
                            </tr>
                        </tbody>
                    </SortedTable>
                        <ul onmousedown="return false" onselectstart="return false" v-if="pages.length>1" class="pagination">
                            <li class="page-item">
                                <a type="button" class="pagination__page-link" v-bind:class="{'pagination__page-link_disabled':page===1}" v-on:click="page!==1&& page--"> Previous </a>
                            </li>
                            <li v-if="page>1" class="page-item">
                                <a type="button" class="pagination__page-link" v-bind:class="{active:page===pageNumber}" :key="pageNumber" v-for="pageNumber in (pages.slice(page-2, page+3))" @click="page = pageNumber">{{pageNumber}}</a>
                            </li>
                            <li v-else class="page-item">
                                <a type="button" class="pagination__page-link" v-bind:class="{active:page===pageNumber}" :key="pageNumber" v-for="pageNumber in pages.slice(page-1, page+4)" @click="page = pageNumber">{{pageNumber}}</a>
                            </li>
                            <li class="page-item">
                                <a type="button" @click="page++" v-if="page < pages.length" class="pagination__page-link"> Next </a>
                            </li>
                        </ul>
                </div>
            </template>
        </div>
    </section>
</template>

<script>
import saveState from 'vue-save-state';
export default {
    mixins: [saveState],
    data: function() {
        return {
            advices: [],
            textsAll:null,
            texts:null,
            selectAdvice:'',
            searchInput:null,
            page: 1,
			perPage: 7,
			pages: []
        } 
    },
    methods: {
        async getTexts (id) {
            try {
                let response = await this.$http.get(this.$root.urlForRequest+'texts/?folder__block__advice_id='+id+'&language_id='+this.$root.choosenLangId)
                this.texts = response.body;
                this.textsAll = response.body;
            }
            catch(e) {
                this.$root.errorCatcher(e)
            }
        },
        getSaveStateConfig() {
            return {
                'cacheKey': 'selectAdvice',
            };
        },
		setPages () {
            this.pages=[]
			let numberOfPages = Math.ceil(this.texts.length / this.perPage);
			for (let index = 1; index <= numberOfPages; index++) {
				this.pages.push(index);
            }
            this.page=1
		},
		paginate (texts) {
			let from = (this.page * this.perPage) - this.perPage;
			let to = (this.page * this.perPage);
			return  texts.slice(from, to);
		}
        
    },
    created() {
        this.$http.get(this.$root.urlForRequest+'advices/').then(response => {
            this.advices = response.body;
            }, response => {
          console.log(response)
        });
    },
    computed: {
		displayedPosts () {
			return this.paginate(this.texts);
		}
	},
    watch: {
        texts () {
			this.setPages();
		},
        langSelect: function(){
            this.$root.choosenLangId=this.langSelect;
        },
        searchInput:function(){
            this.texts=this.textsAll.filter(obj=>obj.text.toLowerCase().includes(this.searchInput.toLowerCase())||obj.folder.name.toLowerCase().includes(this.searchInput.toLowerCase()))
        }
    }

}
</script>

<style scoped>
    .card__head select{
        display: inline;
    }
    p{
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
        overflow:hidden;
        margin:0;
    }
    .table__first-column{
        width:20%;
    }
    .offset{
        width: 500px !important;
        margin: 20px auto;  
    }
    .pagination__page-link_disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>
