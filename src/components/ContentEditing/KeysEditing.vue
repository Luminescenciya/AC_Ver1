 <template>
   <div class="KeysEditing card">
      <template v-if="loadingBool===false">
         <div class="card__head">
            <span v-on:click="visible.default=!visible.default" class="card__title">Default Keys</span>
         </div>
         <div v-if="visible.default===true" class="card__body">
            <div class="line">
               <div class="form-group">
                  <label class="control-label">Select Condition</label>
                  <multiselect v-model="termValue" :allow-empty="false" @select="checkTermEdit(termValue)" placeholder="Search" deselectLabel="Remove" selectLabel="Select" label="term_name" track-by="id" :options="terms" :multiple="false"></multiselect>
               </div>
            <template v-if="termValue!==''">
               <div  :key="z" v-for="(names, z) in termValue.arguments_names.arguments_names" class="form-group">
                  <label class="control-label">Default Key for {{names.argument_names[0].name}}</label>
                  <multiselect :disabled="names.argument_names[0].max!==undefined ? true:false" @remove="$forceUpdate()" @select="checkDefault(default_term_arguments[z], z)" v-model="default_term_arguments[z]"
                              :multiple="false" placeholder="Search" deselectLabel="Remove" selectLabel="Select" label="name" track-by="id" :options="names.argument_names"></multiselect>
               </div>
            </template>
            </div>
         </div>
         <template v-if="termValue!==''">
            <div class="card__head card__head-with-search">
               <span v-on:click="visible.keys=!visible.keys" class="card__title">Keys</span>
               <template v-if="visible.keys===true">
                  <a v-on:click="searchShowBool = !searchShowBool" v-if="searchShowBool === false" class="control-label hidden-feature">Show Search</a>
                  <a v-on:click="searchShowBool = !searchShowBool" v-if="searchShowBool === true" class="control-label hidden-feature">Close Search</a>
                  <input v-if="searchShowBool===true" type="text" class="card__search--left card__search--keys" v-on:change="search()" v-model="searchInput" placeholder="Search">
               </template>
            </div>
            <div v-if="visible.keys===true" :key="rerenderKeysKey" class="card__body scrollable">
               <template v-if="selectOnly===true">
                  <div :key="i" v-for="(folder, i) in this.folders">
                     <div :key="j" v-for="(key, j) in folder.keys" class="line">
                        <template v-if="key.delete===undefined">
                           <div v-if="j===0" class="form-group">
                              <label class="control-label">Key Name</label>
                              <div class="line line__values">
                                 <input type="text" placeholder="Type Key Name Here" class="form-control" v-model="folder.name">
                                 <button v-on:click="addNewKey(folder)" class="btn btn-success btn-cross"><span class="fa fa-plus fa-lg"></span></button>
                              </div>
                              </div>
                              <div v-else class="form-group">
                                 <button v-on:click="key.delete=true; $forceUpdate()" class="btn btn-danger btn-cross"><span class="fa fa-times fa-lg"></span></button>
                              </div>
                           <div :key="z" v-for="(names, z) in termValue.arguments_names.arguments_names"  class="form-group">
                              <label v-if="j===0" class="control-label">Value for {{names.argument_names[0].name}}</label>
                              <multiselect :taggable="true" v-model="key.front_values[z]" :close-on-select="false" @remove="$forceUpdate()" label="name" v-on:select="$forceUpdate()" :disabled="default_term_arguments.length>0 && default_term_arguments[z]!==null ? true:false"
                                            placeholder="Choose values" deselectLabel="Remove" track-by="id" :options="names.argument_names" :multiple="true">
                              </multiselect>
                           </div>
                        </template>
                     </div>
                  </div>
               </template>
               <template v-else>
                  <div :key="i" v-for="(folder, i) in this.folders">
                     <div :key="j" v-for="(key, j) in folder.keys"  class="line">
                        <template v-if="key.delete===undefined">
                           <div v-if="j===0" class="form-group">
                              <label class="control-label">Key Name</label>
                              <div class="line line__values">
                                 <input type="text" placeholder="Type Key Name Here" class="form-control" v-model="folder.name">
                                 <button v-on:click="addNewKey(folder)" class="btn btn-success btn-cross"><span class="fa fa-plus fa-lg"></span></button>
                              </div>
                           </div>
                           <div v-else class="form-group">
                              <button v-on:click="key.delete=true; $forceUpdate()" class="btn btn-danger btn-cross"><span class="fa fa-times fa-lg"></span></button>
                           </div>
                           <div :key="z" v-for="(names, z) in termValue.arguments_names.arguments_names"  class="form-group">
                              <label v-if="j===0" class="control-label">Value for {{names.argument_names[0].name}}</label>
                              <div  class="line line__values">
                                 <template v-if="folder.keys[j].values[z].slider" >
                                    <input type="number" @change="checkValues(key.values[z])" v-model.trim="folder.keys[j].values[z].slider[0]" class="form-control">
                                    <vue-range-slider v-model="folder.keys[j].values[z].slider" :key="rerenderSlider" @input="$forceUpdate()" :min="names.argument_names[0].min" :max="names.argument_names[0].max" :tooltip="'hover'" :enable-cross="false"></vue-range-slider>
                                    <input type="number" @change="checkValues(key.values[z])" v-model.trim="folder.keys[j].values[z].slider[1]" class="form-control">
                                 </template>
                                 <template v-else>
                                    <multiselect v-model="folder.keys[j].values[z]" v-on:select="$forceUpdate()" label="name" :disabled="default_term_arguments[z]!==null ? true:false"
                                                          placeholder="Choose values" deselectLabel="Remove" track-by="id" :options="names.argument_names" :multiple="false">
                                       <template slot="selection" slot-scope="{ values, isOpen }"><span class="multiselect__single" v-if="values.length && !isOpen">{{ values.length }} options selected</span></template>
                                    </multiselect>
                                 </template>
                              </div>
                           </div>
                        </template>
                     </div>
                  </div>
               </template>
               
            </div>
         </template>
         <!-- <template v-if="termValue!=='' && termValue.arguments_names.arguments_names.every(obj=>obj.argument_names[0].id)===true">
         <div class="card__head">
            <span v-on:click="visible.generator=!visible.generator" class="card__title">Key Generator</span>
         </div>
         <div v-if="visible.generator===true" class="card__body">
            <div class="line">
            <div  class="form-group">
               <label class="control-label">Click to generate</label>
               <button class="btn btn-primary">Generate</button>
            </div>
            <div :key="z" v-for="(names, z) in termValue.arguments_names.arguments_names" class="form-group">
               <label class="control-label">Generate Key for {{names.argument_names[0].name}}</label>
               <multiselect v-model="generateParameters[z]" placeholder="Search" deselectLabel="Remove" selectLabel="Select" label="name" track-by="id" :options="names.argument_names" :multiple="false"></multiselect>
            </div>
         </div>
         </div>
      </template> -->
         <div v-if="termValue!==''" class="card__body">
            <div  class="form-group">
               <button v-on:click="saveKeys()" class="btn btn-primary">SAVE KEYS</button>
            </div>
         </div>
      </template>
      <h3 v-else>Loading...</h3>
   </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-range-component/dist/vue-range-slider.css'
import VueRangeSlider from 'vue-range-component'
export default {
   components: {
    Multiselect,
    VueRangeSlider
   },
   data () {
     return {
       visible:{
          default:true,
          keys:true,
          generator:false
       },
       terms:[],
       termValue: '',
       folders:[],
       defaultParameters:[],
       generateParameters:[],
       rerenderKeysKey:0,
       loadingBool: false,
       selectOnly: null,
       rerenderSlider: 0, 
       crossedValues:[],
       blockData: '',
       default_term_arguments: [], 
       oldDefault: null,
       oldTerm: null,
       searchShowBool: false,
       searchInput: ''
     }
   },
   methods: {
      addNewKey (folder) {
         if(this.selectOnly===false) folder.keys.push({id: null, values: []})
         else folder.keys.push({id: null, values: [], front_values: []})
         for (let z=0;z<this.termValue.arguments_names.arguments_names.length;z++){
            if(this.selectOnly===false) {
               if(this.termValue.arguments_names.arguments_names[z].argument_names.every(x => x.max)) {
                  folder.keys[folder.keys.length - 1].values.push({argument_id:this.termValue.arguments_names.arguments_names[z].argument_id,
                                              min:0, max:0})
                  folder.keys[folder.keys.length - 1].values[folder.keys[folder.keys.length - 1].values.length - 1].slider = [
                     this.termValue.arguments_names.arguments_names[z].argument_names[0].min,
                     this.termValue.arguments_names.arguments_names[z].argument_names[0].max
                  ]
               } else {
                  for (let x=0; x<this.termValue.arguments_names.arguments_names[z].argument_names.length; x++){
                     this.termValue.arguments_names.arguments_names[z].argument_names[x].argument_id = this.termValue.arguments_names.arguments_names[z].argument_id
                  }
                  folder.keys[folder.keys.length - 1].values.push([])
               }
            } else {
               if (this.default_term_arguments[z] !== null) folder.keys[folder.keys.length - 1].front_values.push([this.default_term_arguments[z]])
               else folder.keys[folder.keys.length - 1].front_values.push([])
            }
         }
      },
      checkTermEdit (termValue) {
         console.log(termValue)
         let answer = confirm('All keys will be deleted.\nDo you really want to change condition?');
         if (answer) this.oldTerm=false
         else this.oldTerm=termValue
      },
      checkDefault (value, z) {
         let answer = confirm('All keys will be changed.\nDo you really want to change default value?');
         if (answer) return
         else this.oldDefault = {value: value, index:z}
      },
      checkValues (value) {
         value.slider[0] = parseInt(value.slider[0])
         value.slider[1] = parseInt(value.slider[1])
         if (value.slider[0] < 0 || isNaN(value.slider[0])) value.slider[0] = 0
         if (value.slider[0] > value.slider[1]) value.slider[0] = value.slider[1]
         this.rerenderSlider+=1
      },
      createKey (termValue, i) {
         if (this.selectOnly === true) {
            this.folders[i].keys.push({id: null, front_values: [],  values: []})
               for (let z=0;z<termValue.arguments_names.arguments_names.length;z++){
                  for (let x=0; x<termValue.arguments_names.arguments_names[z].argument_names.length; x++){
                        termValue.arguments_names.arguments_names[z].argument_names[x].argument_id = termValue.arguments_names.arguments_names[z].argument_id
                     }
                  console.log(this.default_term_arguments[z])
                  if (this.default_term_arguments[z]!==null && this.default_term_arguments[z]!==undefined) this.folders[i].keys[0].front_values.push([this.default_term_arguments[z]])
                  else this.folders[i].keys[0].front_values.push([])
               }
            } else {
               this.folders[i].keys.push({id: null, values: []})
               for (let z=0;z<termValue.arguments_names.arguments_names.length;z++){
                  if(termValue.arguments_names.arguments_names[z].argument_names.every(x => x.max)) {
                     this.folders[i].keys[0].values.push({argument_id: termValue.arguments_names.arguments_names[z].argument_id,
                                                          min: termValue.arguments_names.arguments_names[z].argument_names[0].min,
                                                          max: termValue.arguments_names.arguments_names[z].argument_names[0].max})
                     this.folders[i].keys[0].values[this.folders[i].keys[0].values.length - 1].slider = [
                        this.folders[i].keys[0].values[this.folders[i].keys[0].values.length - 1].min,
                        this.folders[i].keys[0].values[this.folders[i].keys[0].values.length - 1].max
                     ]
                  } else {
                     for (let x=0; x<termValue.arguments_names.arguments_names[z].argument_names.length; x++){
                        termValue.arguments_names.arguments_names[z].argument_names[x].argument_id = termValue.arguments_names.arguments_names[z].argument_id
                     }
                     this.folders[i].keys[0].values.push([])
                  }
               }
            }
      },
      newKeysCreate (termValue) {
         this.default_term_arguments = []
         this.getRenderType(termValue)
         for (let i=0; i<this.folders.length; i++) {
            this.folders[i].keys = []
            this.createKey(termValue, i)
         }
      },
      checkKeyUnique (value, folder, key) {
         let checkValuesBool=false
         for (let i=0; i<this.folders.length; i++){
            if(this.selectOnly===true) {
               for (let z=0;z<this.folders[i].keys.length; z++) {
                  //сначала смотрим, в том же ли мы фолдере, что закинули на проверку, потом не в том же ли мы ключе
                  let folderBool = true
                  if (i===parseInt(folder)) folderBool=false
                  if (folderBool || z!==parseInt(key)) {
                     let counter = 0
                     for(let k=0; k<value.front_values.length; k++){
                        for (let j=0; j<this.folders[i].keys[z].front_values.length; j++){
                           //смысл в том, что мы считаем список совпадений. если совпадение в каждом элементе ключа, то кидаем сообщение
                           if(value.front_values[k][0].argument_id === this.folders[i].keys[z].front_values[j][0].argument_id) {
                              if(value.front_values[k].some(v=> this.folders[i].keys[z].front_values[j].filter(x => x.id === v.id).length>0)) {
                                 counter+=1
                              }
                           }
                        }
                        if(counter===value.front_values.length){
                           if(this.crossedValues.some(obj => obj.name1===this.folders[i].name && obj.name2===value.name) ||
                              this.crossedValues.some(obj => obj.name1===value.name && obj.name2===this.folders[i].name)) continue;
                           else {
                              let message = this.folders[folder].name +' crossed with '+this.folders[i].name
                              this.crossedValues.push({message: message,
                                                       name1:this.folders[folder].name,
                                                       name2:this.folders[i].name})
                           }
                        }
                     }
                  } else continue
               }
            } else {
               for (let j=0; j<this.folders[i].keys.length; j++) {
                  if (this.folders[i].id === this.folders[folder].id && JSON.stringify(this.folders[i].keys[j]) === JSON.stringify(this.folders[folder].keys[key])) continue;
                  checkValuesBool=false
                  for(let k=0; k<value.values.length; k++) {
                     for(let l=0; l<this.folders[i].keys[j].values.length; l++) {
                        if(value.values[k].argument_id === this.folders[i].keys[j].values[l].argument_id) {
                           if (value.values[k].name) {
                              if (value.values[k].max < this.folders[i].keys[j].values[l].min || value.values[k].min > this.folders[i].keys[j].values[l].max || checkValuesBool) checkValuesBool=true
                              else {
                                 if(this.crossedValues.some(obj => obj.name1===this.folders[i].name && obj.name2===this.folders[folder].name) ||
                                    this.crossedValues.some(obj => obj.name1===this.folders[folder].name && obj.name2===this.folders[i].name)) continue;
                                 else {
                                    let message = this.folders[folder].name +' crossed with '+this.folders[i].name
                                    this.crossedValues.push({message: message,
                                                             name1:this.folders[folder].name,
                                                             name2:this.folders[i].name})
                                 }
                              } 
                           } else if (value.values[k].slider[1] < this.folders[i].keys[j].values[l].slider[0] ||
                                      value.values[k].slider[0] > this.folders[i].keys[j].values[l].slider[1] || checkValuesBool) checkValuesBool=true
                           else if (l === this.folders[i].keys[j].values.length-1) {
                              if(this.crossedValues.some(obj => obj.name1===this.folders[i].name && obj.name2===this.folders[folder].name) ||
                                 this.crossedValues.some(obj => obj.name1===this.folders[folder].name && obj.name2===this.folders[i].name)) continue;
                              else {
                                 let message = this.folders[folder].name +' crossed with '+this.folders[i].name
                                 this.crossedValues.push({message: message,
                                                         name1:this.folders[folder].name,
                                                         name2:this.folders[i].name})
                              }  
                           } 
                        }
                     }
                  }
               }
            }
             
         }
      },
      async saveKeys () {
         try{
            let newKeys = []
            let deleteKeys = []
            let editKeys = []
            console.log(this.blockData.term === null)
            if(this.blockData.term === null || this.blockData.term.id!==this.termValue.id) {
               let data = {term_id: this.termValue.id}
               await this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/', data)
               
               this.oldTerm= null
            }
            if(JSON.stringify(this.blockData.default_term_arguments) !== JSON.stringify(this.default_term_arguments) || JSON.stringify(this.blockData.oldDefault) !== JSON.stringify(this.default_term_arguments)) {
               let data = {default_term_arguments: this.default_term_arguments}
               await this.$http.patch(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/', data)
               this.oldDefault= null
            }
            this.crossedValues = []
            if(this.selectOnly===true) {
               for (let i in this.folders){
                  for (let j in this.folders[i].keys){
                     if(this.folders[i].keys[j].delete===true) {
                        deleteKeys.push(JSON.parse(JSON.stringify(this.folders[i].keys[j])))
                        console.log(deleteKeys)
                        continue
                     }
                     //проверка на пустой ключ
                     console.log(this.folders[i].keys[j].front_values)
                     if (this.folders[i].keys[j].front_values.every(x => x.length===0)) continue
                     //проверка заполненности ключа
                     if (this.folders[i].keys[j].front_values.some(x => x.length===0)) {
                        alert (this.folders[i].name + ' key is not completely filled' );
                        return;
                     }
                     for (let z in this.folders[i].keys[j].front_values){
                        this.folders[i].keys[j].front_values[z] = this.folders[i].keys[j].front_values[z].sort((a,b) => a.id - b.id)
                        for (let k in this.folders[i].keys[j].front_values[z]){
                           //добавляем min и max к ключам c id
                           if (this.folders[i].keys[j].front_values[z][k].id && this.folders[i].keys[j].front_values[z][k].min === undefined) {
                              this.folders[i].keys[j].front_values[z][k].min = this.folders[i].keys[j].front_values[z][k].id
                              this.folders[i].keys[j].front_values[z][k].max = this.folders[i].keys[j].front_values[z][k].id
                           }
                        }
                     }
                  }
               }
               for (let i in this.folders){
                  this.folders[i].keys = this.folders[i].keys.filter(y=>y.delete!==true)
               }
              
               console.log('DALETE1',deleteKeys, this.folders)
               let folders= JSON.parse(JSON.stringify(this.folders))
               for (let i in folders){
                  for (let z in folders[i].keys){
                     this.checkKeyUnique (folders[i].keys[z], i, z)
                     if (this.crossedValues.length===0) {
                        //старый код, отвечающий за перемешивание ключей
                        let firstArr=[]
                        let secondArr=[]
                        for (let p=0;p<folders[i].keys[z].front_values.length;p++){
                           if (p===0){
                              for (let k=0;k<folders[i].keys[z].front_values[p].length;k++){
                                 let values=[];
                                 values.push(folders[i].keys[z].front_values[p][k])
                                 secondArr.push({values})
                              }
                              firstArr=secondArr;
                              secondArr=[];
                           } else {
                              for(let j=0;j<firstArr.length;j++){
                                 for (let d=0;d<folders[i].keys[z].front_values[p].length;d++){
                                    let values=[];
                                    for (let k=0;k<firstArr[j].values.length;k++) { 
                                       values.push(firstArr[j].values[k]) 
                                    }
                                    values.push(folders[i].keys[z].front_values[p][d]) 
                                    secondArr.push({values})
                                 }
                              }
                              firstArr=secondArr;
                              secondArr=[];
                           }
                        }
                        folders[i].keys[z].allKeys = firstArr
                     } else {
                        for(let lol in this.crossedValues){
                           alert(this.crossedValues[lol].message);
                        }
                        return
                     }
                  }
               }
               //проверка на уже существующие ключи
               for (let i in folders){
                  for (let oldValue in folders[i].keys) {
                     console.log('11111', folders[i].keys[oldValue])
                     if (folders[i].keys[oldValue].allKeys.length>0) {
                        if (folders[i].keys[oldValue].values.length>0) {
                           for (let newKey in folders[i].keys[oldValue].allKeys) {
                              for (let valuePart in folders[i].keys[oldValue].values) {
                                 if (folders[i].keys[oldValue].values[valuePart].argument_id === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].argument_id) {
                                    //создаем массив с новыми мин и макс
                                    if(!folders[i].keys[oldValue].values[valuePart].new_minmax) folders[i].keys[oldValue].values[valuePart].new_minmax = []
                                    //если в новых мин и мас что-то есть
                                    if(folders[i].keys[oldValue].values[valuePart].new_minmax.length>0) {
                                       console.log('2222', folders[i].keys[oldValue].values[valuePart])
                                       //проверяем каждый новый ключ на вхождение в уже существующие min и max. Если существует на +/- 1 такой же, то присоединяем к нему
                                       if(folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[0] <= folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min && x[1] >= folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max).length>0) continue
                                       if(folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min).length>0 && 
                                             folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min)[0][1]<folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max) {
                                          folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min)[0][1]=folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max
                                       } else if(folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max).length>0 && 
                                             folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max)[0][0]>folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min) {
                                          folders[i].keys[oldValue].values[valuePart].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max)[0][0]=folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min
                                       } else {
                                          let index = folders[i].keys[oldValue].values[valuePart].new_minmax.indexOf( x=> folders[i].keys[oldValue].allKeys[newKey].values[valuePart].min >=x[0] && folders[i].keys[oldValue].allKeys[newKey].values[valuePart].max <= x[1])
                                          if(index!==-1){
                                             folders[i].keys[oldValue].values[valuePart].new_minmax.splice(index,1)
                                          }
                                       }
                                    } else {
                                       //если нету то добавляем те, что есть
                                       for (let key in folders[i].keys[oldValue].allKeys){
                                          folders[i].keys[oldValue].values[valuePart].new_minmax.push([folders[i].keys[oldValue].allKeys[key].values[valuePart].min, folders[i].keys[oldValue].allKeys[key].values[valuePart].max])
                                          console.log('minmax',JSON.parse(JSON.stringify(folders[i].keys[oldValue].values[valuePart])) )
                                       }

                                    }
                                 }
                              }
                           }
                        } else {
                           //если старых ключей нет, то все ключи новые для фолдера новые
                           console.log('new')
                           let newValue = folders[i].keys[oldValue].allKeys[0].values
                           newValue.forEach( x => x.new_minmax=[])
                           console.log(newValue, folders[i].keys[oldValue].allKeys)
                           for (let newKey in folders[i].keys[oldValue].allKeys) {
                              for ( let y in folders[i].keys[oldValue].allKeys[newKey].values){
                                 if( newValue[y].argument_id === folders[i].keys[oldValue].allKeys[newKey].values[y].argument_id)
                                    newValue[y].new_minmax.push([folders[i].keys[oldValue].allKeys[newKey].values[y].min, folders[i].keys[oldValue].allKeys[newKey].values[y].max])
                              }
                           }
                           
                           for(let value in newValue) {
                              let set  = new Set(newValue[value].new_minmax.map(JSON.stringify));
                              newValue[value].new_minmax = Array.from(set).map(JSON.parse);
                              console.log(newValue[value])
                              for (let minmax in newValue[value].new_minmax) {
                                 console.log(newValue[value].new_minmax, minmax)
                                 if(newValue[value].new_minmax.filter(x=>x[1]+1 === newValue[value].new_minmax[minmax][0]).length>0 && 
                                       newValue[value].new_minmax.filter(x=>x[1]+1 === newValue[value].new_minmax[minmax][0])[0][1]<newValue[value].new_minmax[minmax][1]) {
                                    newValue[value].new_minmax.filter(x=>x[1]+1 === newValue[value].new_minmax[minmax][0])[0][1]=newValue[value].new_minmax[minmax][1]
                                    newValue[value].new_minmax.splice(minmax,1)
                                 } else if(newValue[value].new_minmax.filter(x=>x[0]-1 === newValue[value].new_minmax[minmax][1]).length>0 && 
                                       newValue[value].new_minmax.filter(x=>x[0]-1 === newValue[value].new_minmax[minmax][1])[0][0]>newValue[value].new_minmax[minmax][0]) {
                                    newValue[value].new_minmax.filter(x=>x[0]-1 === newValue[value].new_minmax[minmax][1])[0][0]=newValue[value].new_minmax[minmax][0]
                                    newValue[value].new_minmax.splice(minmax,1)
                                 }
                              }
                              
                           }
                           if (newValue.filter(x=>x.new_minmax.length>1).length>0){
                              for(let value in newValue) {
                                 if(newValue[value].new_minmax.length>1){
                                    for (let minmax in newValue[value].new_minmax) {
                                       newValue[value].min=newValue[value].new_minmax[minmax][0]
                                       newValue[value].max=newValue[value].new_minmax[minmax][1]
                                       newKeys.push({folder_id:folders[i].id, values:JSON.parse(JSON.stringify(newValue))})
                                    }
                                 }
                              }
                           } else {
                              newValue.forEach(x=>{x.min=x.new_minmax[0][0];x.max=x.new_minmax[0][1]})
                              newKeys.push({folder_id:folders[i].id, values:JSON.parse(JSON.stringify(newValue))})  
                           }
                           folders[i].keys[oldValue].new=true
                        }
                     }
                  }
               }
               console.log('newKeys', JSON.parse(JSON.stringify(newKeys)))


               for (let i=0; i<folders.length; i++){
                  for (let oldValue in folders[i].keys) {
                     if (folders[i].keys[oldValue].allKeys.length>0) {
                        for (let value in folders[i].keys[oldValue].values) {
                           //удаляем возможные дубликаты ключей
                           let set  = new Set(folders[i].keys[oldValue].values[value].new_minmax.map(JSON.stringify));
                           folders[i].keys[oldValue].values[value].new_minmax = Array.from(set).map(JSON.parse);
                           // смотрим последний раз соседние ключи, чтобы преобразовать в 1
                           if(folders[i].keys[oldValue].values[value].new_minmax.length>0) {
                              let joined = true
                              while (joined) {
                                 joined = false
                                 for(let minmax in folders[i].keys[oldValue].values[value].new_minmax) {
                                    if(folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][0]).length>0 && 
                                          folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][0])[0][1]<folders[i].keys[oldValue].values[value].new_minmax[minmax][1]) {
                                       folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[1]+1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][0])[0][1]=folders[i].keys[oldValue].values[value].new_minmax[minmax][1]
                                       folders[i].keys[oldValue].values[value].new_minmax.splice(minmax,1)
                                       joined = true
                                    } else if(folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][1]).length>0 && 
                                          folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][1])[0][0]>folders[i].keys[oldValue].values[value].new_minmax[minmax][0]) {
                                       folders[i].keys[oldValue].values[value].new_minmax.filter(x=>x[0]-1 === folders[i].keys[oldValue].values[value].new_minmax[minmax][1])[0][0]=folders[i].keys[oldValue].values[value].new_minmax[minmax][0]
                                       folders[i].keys[oldValue].values[value].new_minmax.splice(minmax,1)
                                       joined = true
                                    } 
                                 }
                              }
                           }
                           //если в минмакс есть знаечния, которых нет в ключе, создаем новые ключи
                           if(folders[i].keys[oldValue].values[value].new_minmax) {
                              let keysFromMinmax = folders[i].keys[oldValue].values[value].new_minmax.filter( x => x[0] !== folders[i].keys[oldValue].values[value].min &&
                                                   x[1] !== folders[i].keys[oldValue].values[value].max)
                                                   console.log(keysFromMinmax)
                              //Проверка идет по старым ключам, потому как минимум 1 тут есть
                              //Добавляем новые ключи, только если старых недостаточно, чтобы их поменять      
                              if(keysFromMinmax.length>1){
                                 for(let newMinmax in keysFromMinmax) {
                                    if ( newMinmax < folders[i].keys.length) continue
                                    let values = JSON.parse(JSON.stringify(folders[i].keys[oldValue].values))
                                    values[value].max = keysFromMinmax[newMinmax][1]
                                    values[value].min = keysFromMinmax[newMinmax][0]
                                    folders[i].keys[oldValue].new=true
                                       newKeys.push({folder_id: folders[i].id,
                                          values: values,
                                          new: true})
                                 }
                                 
                                 folders[i].keys[oldValue].values[value].new_minmax = folders[i].keys[oldValue].values[value].new_minmax.filter( x => x[0] === folders[i].keys[oldValue].values[value].min &&
                                                   x[1] === folders[i].keys[oldValue].values[value].max)  
                                 
                                 
                              }
                           }
                           console.log(JSON.parse(JSON.stringify(folders[i].keys[oldValue])))
                           //если у нас в ключе минимум и максимум совпадают с новыми, и этих новых всего 1. то удаляем новые
                           if (folders[i].keys[oldValue].new===undefined && folders[i].keys[oldValue].values[value].new_minmax.length===1 && folders[i].keys[oldValue].values[value].new_minmax[0][0] === folders[i].keys[oldValue].values[value].min &&
                               folders[i].keys[oldValue].values[value].new_minmax[0][1] === folders[i].keys[oldValue].values[value].max) delete folders[i].keys[oldValue].values[value].new_minmax
                           // если старые мин и макс недоходят до новых то что-то изменилось
                           if (folders[i].keys[oldValue].values[value].new_minmax) {
                              if(folders[i].keys[oldValue].values[value].new_minmax.filter(x => 
                                 folders[i].keys[oldValue].values[value].min >= x[0] &&
                                 folders[i].keys[oldValue].values[value].min <= x[1] ||
                                 folders[i].keys[oldValue].values[value].max >= x[0] &&
                                 folders[i].keys[oldValue].values[value].max <= x[1]).length>0 ||
                                 folders[i].keys[oldValue].values[value].new_minmax.filter(x => 
                                 folders[i].keys[oldValue].values[value].min === x[0] &&
                                 folders[i].keys[oldValue].values[value].max === x[1]).length===0) {
                                    console.log('edit')
                                    folders[i].keys[oldValue].folder_id=folders[i].id
                                    folders[i].keys[oldValue].values[value].edit= true
                              }
                              console.log('tretert',JSON.parse(JSON.stringify(folders[i].keys[oldValue])))
                              //если старые мин и макс не в новых, то удаляем
                              let index = folders[i].keys.findIndex(y=> y.new===undefined && y.values[value].edit && y.values[value].new_minmax.some(x => x[0] === y.values[value].min && x[1]===y.values[value].max))
                              if (index!== -1) {
                                 console.log(folders[i].keys[index])
                                 delete folders[i].keys[index].values[value].edit
                              }
                              index = folders[i].keys.findIndex(y=> y.new===undefined && y.values[value].new_minmax!==undefined && y.values[value].new_minmax.every(x => x[1] <= y.values[value].min && x[0]>=y.values[value].max))
                              if (index!== -1) {
                                 folders[i].keys[index].values[value].delete=true
                                 delete folders[i].keys[index].values[value].edit
                              }

                           }
                           
                              if (folders[i].keys[oldValue].values[value].delete) folders[i].keys[oldValue].delete = true
                              if (folders[i].keys[oldValue].values[value].edit) folders[i].keys[oldValue].edit = true

                           }
                        }
                  }
                  if (folders[i].keys.filter( x => x.edit).length>0) deleteKeys.push(...folders[i].keys.filter( x => x.delete && x.id !==null))
                  if (folders[i].keys.filter( x => x.edit).length>0) editKeys.push(...folders[i].keys.filter( x => x.edit))
               }
                              
               //собираем все новые мин и макс по частям ключей в массивы
               let editNewKeys = []
               for (let key in editKeys) {
                  console.log('sfdsdfs', editKeys[key])
                  if (editKeys[key].values.some(x=>x.length===0)) continue
                  for (let value in editKeys[key].values){
                     let temp = []
                     if (editKeys[key].values[value].new_minmax){
                        for (let mm in editKeys[key].values[value].new_minmax){
                           let newVal = JSON.parse(JSON.stringify(editKeys[key].values[value]))
                           newVal.min = editKeys[key].values[value].new_minmax[mm][0]
                           newVal.max = editKeys[key].values[value].new_minmax[mm][1]
                           temp.push(newVal)
                        }
                     } else temp.push(editKeys[key].values[value])
                     editKeys[key].values[value] = temp
                  }
                  //формируем новые ключи
                  let firstArr = []
                  let secondArr = []
                  for (let p=0;p<editKeys[key].values.length;p++){
                     if (p===0){
                        for (let z=0;z<editKeys[key].values[p].length;z++){
                           let values=[];
                           values.push(editKeys[key].values[p][z])
                           secondArr.push({values})
                        }
                        firstArr=secondArr;
                        secondArr=[];
                     } else {
                        for(let j=0;j<firstArr.length;j++){
                           for (let z=0;z<editKeys[key].values[p].length;z++){
                              let values=[];
                              for (let k=0;k<firstArr[j].values.length;k++) { 
                                 values.push(firstArr[j].values[k]) 
                              }
                              values.push(editKeys[key].values[p][z]) 
                              secondArr.push({values})
                           }
                        }
                        firstArr=secondArr;
                        secondArr=[];
                      }
                  }
                  //ищем в новых ключах одинаковые фолдер ид. Если совпадают, то закидываем в уже существующий
                  let index = editNewKeys.findIndex(x=>x.folder_id===editKeys[key].folder_id)
                  if(index!==-1){
                     editNewKeys[index].ids.push(editKeys[key].id)
                     for (let newKey in firstArr){
                        if (editNewKeys[index].keys.findIndex(x=> JSON.stringify(x)===JSON.stringify(firstArr[newKey]))===-1) editNewKeys[index].keys.push(firstArr[newKey])
                     }
                  } else {
                     let data = {folder_id:editKeys[key].folder_id, ids:[editKeys[key].id], keys:firstArr}
                     editNewKeys.push(data)
                  }
               }
               //подготовка списка id для удаления
               if (deleteKeys.length>0) {
                  let data=[]
                  for (let key in deleteKeys) {
                     data.push(deleteKeys[key].id)
                  }
                  deleteKeys = data
                  
               }
               editKeys = []
               for(let folder in editNewKeys){
                     if (editNewKeys[folder].ids.length>editNewKeys[folder].keys.length){
                        for (let id in editNewKeys[folder].ids){
                           console.log(editNewKeys[folder].keys[id])
                           if (editNewKeys[folder].keys[id]){
                              editKeys.push({id: editNewKeys[folder].ids[id], values:editNewKeys[folder].keys[id].values})
                           }
                           else deleteKeys.push(editNewKeys[folder].ids[id])
                        }
                     }
                     else {
                        for (let key in editNewKeys[folder].keys){
                           console.log(editNewKeys[folder].ids[key])
                           if (editNewKeys[folder].ids[key]){
                              editKeys.push({id: editNewKeys[folder].ids[key], values:editNewKeys[folder].keys[key].values})
                           }
                           else newKeys.push({folder_id: editNewKeys[folder].folder_id, new: true, values:editNewKeys[folder].keys[key].values})
                        }
                     }
               }
               console.log('EDIT ', editNewKeys)
               console.log('new ', newKeys)
               console.log('EDIT Final', JSON.stringify(editKeys))
               console.log('delete', deleteKeys)
               
                  
            } else {
               for (let i=0; i<this.folders.length; i++){
                  for (let j=0; j<this.folders[i].keys.length; j++){
                     if (this.folders[i].keys[j].delete && this.folders[i].keys[j].id!==null) deleteKeys.push(this.folders[i].keys[j].id)
                     if(this.folders[i].keys[j].delete) {
                           this.folders[i].keys = this.folders[i].keys.splice(j, 1)
                           continue
                     }
                     for (let k=0; k<this.folders[i].keys[j].values.length; k++){
                        //проверяем заполненность селектовой части ключа
                        if (Array.isArray(this.folders[i].keys[j].values[k]) && this.folders[i].keys[j].values[k].length===0) {
                           alert (this.folders[i].name + ' key is not completely filled' );
                           return;
                        } 
                        //добавляем min и max к ключам c id
                        if (this.folders[i].keys[j].values[k].id) {
                           this.folders[i].keys[j].values[k].min=this.folders[i].keys[j].values[k].id
                           this.folders[i].keys[j].values[k].max=this.folders[i].keys[j].values[k].id
                        }
                        //отправляем в мин и мак значения из массива слайдера
                        if (this.folders[i].keys[j].values[k].slider) {
                           if (this.folders[i].keys[j].values[k].slider[0]!==this.folders[i].keys[j].values[k].min ||
                               this.folders[i].keys[j].values[k].slider[1]!==this.folders[i].keys[j].values[k].max) this.folders[i].keys[j].edit = true
                           this.folders[i].keys[j].values[k].min=this.folders[i].keys[j].values[k].slider[0]
                           this.folders[i].keys[j].values[k].max=this.folders[i].keys[j].values[k].slider[1]
                        }
                     }
                     //проверка на уникальность
                     this.checkKeyUnique (this.folders[i].keys[j], i, j)
                     //выборка новых ключей
                     if (this.folders[i].keys[j].id === null) {
                        newKeys.push({folder_id: this.folders[i].id,
                                       new: true,
                                      values: this.folders[i].keys[j].values})
                     } else if (this.folders[i].keys[j].edit) {
                        editKeys.push({id: this.folders[i].keys[j].id,
                                      values: this.folders[i].keys[j].values})
                     }
                     
                  }
               }
            }
            console.log(deleteKeys)
            if (deleteKeys.length===0 && editKeys.length===0 && newKeys.length===0) alert("Nothing to save")
            else {
               if (deleteKeys.length>0) {
                  await this.$http.post(this.$root.urlForRequest+'keys/destroy/', deleteKeys);
               }
               if(editKeys.length>0){
                  await this.$http.patch(this.$root.urlForRequest+'keys/', editKeys);
               }
               if (newKeys.length>0) {
                  console.log('last',newKeys)
                  await this.$http.post(this.$root.urlForRequest+'keys/', newKeys);
               }
               alert('Saved!');
               this.getKeys()
            }
         }
         catch (e) {
            this.$root.errorCatcher(e)
         }
      },
      getRenderType (termValue) {
         if (termValue.arguments_names.arguments_names.every(arr => arr.argument_names.every(x => 'id' in x))) this.selectOnly = true
         else this.selectOnly = false
      },
      async getKeys () {
         try{
            this.loadingBool=true
            let response = await this.$http.get(this.$root.urlForRequest+'blocks/'+this.$route.params.block_id+'/')
            this.blockData = response.body
            response = await this.$http.get(this.$root.urlForRequest+'block-types/'+this.blockData.block_type.id+'/')
            this.terms = response.body.available_terms
            response = await this.$http.get(this.$root.urlForRequest+'key-folders/?block_id='+this.$route.params.block_id+'&include=keys')
            this.folders=response.body.sort(function(a,b){
               if(a.term_name < b.term_name) { return -1; }
               if(a.term_name > b.term_name) { return 1; }
               return 0;
            });
            if (this.blockData.term !== null){
               this.termValue=this.terms.filter(obj => obj.id === this.blockData.term.id)[0]
               this.getRenderType(this.termValue)
               if (this.blockData.default_term_arguments.length===0) {
                  this.termValue.arguments_names.arguments_names.forEach( () => this.default_term_arguments.push(null))
                  this.blockData.default_term_arguments = JSON.parse(JSON.stringify(this.default_term_arguments))
               } 
               else this.default_term_arguments = JSON.parse(JSON.stringify(this.blockData.default_term_arguments))
               //к каждому аргументу в условии добавляем argument_id
               for (let args in this.termValue.arguments_names.arguments_names) {
                  for (let arg in this.termValue.arguments_names.arguments_names[args].argument_names){
                     this.termValue.arguments_names.arguments_names[args].argument_names[arg].argument_id = this.termValue.arguments_names.arguments_names[args].argument_id
                  }
               }
               for (let i=0;i<this.folders.length;i++) {
                  this.folders[i].startKeys = []
                  this.folders[i].startKeys = JSON.parse(JSON.stringify(this.folders[i].keys))
                  if(this.folders[i].keys.length === 0) this.createKey(this.termValue, i)
                  else {
                     //скидываем все ключи в папки по значениям
                     for (let z=0;z<this.folders[i].keys.length;z++) {
                        this.folders[i].keys[z].front_values = []
                        for (let j=0; j<this.folders[i].keys[z].values.length; j++) {
                           this.folders[i].keys[z].front_values[j] = []
                           if (this.selectOnly===true){
                              if(this.folders[i].keys[z].values[j].min){
                                 for(let min = this.folders[i].keys[z].values[j].min; min<=this.folders[i].keys[z].values[j].max; min++){
                                    let elem = JSON.parse(JSON.stringify(this.folders[i].keys[z].values[j]))
                                    elem.id = min
                                    elem.max = elem.id
                                    elem.min = elem.id
                                    elem.name = this.termValue.arguments_names.arguments_names[j].argument_names.find(x => x.id === elem.id).name;
                                    this.folders[i].keys[z].front_values[j].push(elem)
                                 }
                              }
                           } else if (this.termValue.arguments_names.arguments_names[j].argument_names[0].max){
                              this.folders[i].keys[z].values[j].slider=[this.folders[i].keys[z].values[j].min, this.folders[i].keys[z].values[j].max]
                              
                           } else if (this.termValue.arguments_names.arguments_names[j].argument_names[0].id) {
                              this.folders[i].keys[z].values[j].name = this.termValue.arguments_names.arguments_names[j].argument_names.find(x => x.id === this.folders[i].keys[z].values[j].min).name;
                              
                           }
                        }
                     }
                  }
               }
            }
            this.loadingBool=false
         }
         catch(e){
            this.$root.errorCatcher(e)
         }
      }      
   },
   created() {
      this.getKeys()
   },
   watch:{
      default_term_arguments () {
         
         if(this.oldDefault!==null) {
            this.default_term_arguments[this.oldDefault.index] = this.oldDefault.value
            this.oldDefault = null
            return
         }
         if(this.default_term_arguments.some(x=>x!==null) || this.blockData.default_term_arguments.some(x=>x!==null)){
            for (let arg in this.default_term_arguments){
               console.log(this.default_term_arguments[arg], this.blockData.default_term_arguments[arg])
               if (this.default_term_arguments[arg]!==null &&
                  ((this.blockData.default_term_arguments[arg]===null && this.default_term_arguments[arg]!==null) ||
                  this.default_term_arguments[arg].id!==this.blockData.default_term_arguments[arg].id)) {
                  
                  for (let folder in this.folders){
                     for (let key in this.folders[folder].keys){
                        this.folders[folder].keys[key].front_values[arg] = [this.default_term_arguments[arg]]
                     }
                  }
               }
            }
         }
      },
      async termValue () {
         if(this.oldTerm!==null && this.oldTerm!==false){
            this.termValue = this.oldTerm
            this.oldTerm = null
         } else if( this.oldTerm===false) {
            console.log(JSON.parse(JSON.stringify(this.folders)))
            this.newKeysCreate(this.termValue)
            this.rerenderKeysKey+=1
            this.blockData.oldDefault= JSON.parse(JSON.stringify(this.blockData.default_term_arguments))
            this.termValue.arguments_names.arguments_names.forEach( () => this.default_term_arguments.push(null))
            this.blockData.default_term_arguments = JSON.parse(JSON.stringify(this.default_term_arguments))
         }
      }
/*       folders: function () {

      } */
      /* termValue:function(){
         this.defaultParameters=[];
         this.choosenKeys=[];
         this.generateParameters=[];

         for(let i=0;i<this.termValue.arguments_names.arguments_names.length;i++){
            this.defaultParameters.push(null);
            this.choosenKeys.push(null);
         }
         for(let z=0;z<this.$parent.texts.length;z++){
            this.$parent.texts[z].keys=[];
            for(let i=0;i<this.termValue.arguments_names.arguments_names.length;i++){
               if(this.termValue.arguments_names.arguments_names[i].argument_names[0].id){
                  this.$parent.texts[z].keys.push(null);
               } else {
                  for (let j=0;j<this.termValue.arguments_names.arguments_names[i].argument_names.length;j++){
                     this.$parent.texts[z].keys.push([this.termValue.arguments_names.arguments_names[i].argument_names[j].min,
                     this.termValue.arguments_names.arguments_names[i].argument_names[j].max]);
                  }
               }
            }
         }
      } */
   },
   /* computed: {
        filteredList() {
           console.log('1')
           if (this.searchShowBool===false || this.searchInput==='') {
              return this.folders
           } else {
              return this.folders.filter(x => {
                return x.name.toLowerCase().includes(this.searchInput.toLowerCase())
                
            })
           }
            
        }
    }, */
    beforeRouteUpdate (to, from, next) {
        next()
    },
    beforeRouteLeave (to, from, next) {
        next()
    }
}
</script>

<style scoped>
.card__title{
   cursor: pointer;
}
.card__body.scrollable {
   height: 100%;
   overflow-y: overlay;
   -ms-overflow-style: none;
   overflow: -moz-scrollbars-none;
}
::-webkit-scrollbar {
   display: none;
}
.form-group{
   padding:0 5px 5px 5px;
   margin:0;
   max-width:25%;
   width:-webkit-fill-available;
}
.form-group:first-child{
   padding-left: 0px;
}
.card__body:last-child{
   margin-top:10px;
}
.form-group:last-child{
  padding-right:0px;
}
.form-group:first-child .line__values input {
  width:calc(100% - 50px);
  margin-right: 5px;
}
.line__values input{
  width:10%;
  min-width:40px;
  display: inline-block;
}
.line__values .vue-range-slider{
  width:calc(98% - 80px) !important;
  display: inline-block;
  margin: 0 1%;
  vertical-align: middle;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.btn-cross {
   float:right;
}
.card__search--keys{
   padding: 7px 14px;
   margin-left:10px;
   width: 40%;
   min-width: 200px;
   line-height: normal;
   
}
.card__head{
   display: flex;
   align-items: baseline;
}
.hidden-feature {
   margin-left: 10px;
}

</style>