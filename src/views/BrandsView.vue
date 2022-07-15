<template>
  <v-container fluid>

    <v-row>
      <v-col cols="12">
        <h2 :class="$vuetify.theme.dark ? 'text-h5 white--text' : 'text-h5 greyDarken-4--text' ">Производители</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card flat class="pa-5 rounded-lg">
          
          <!-- Поиск и добавление -->
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="search" dense outlined single-line color="grey" label="Поиск" append-icon="mdi-magnify"></v-text-field>
            </v-col>

            <v-col cols="12" md="4">  
              <v-select 
                :items="countriesList" v-model="countriesFilterValue" v-on:change="filters.country = []"
                label="Страна производителя"
                color="grey" outlined dense
              ></v-select>
            </v-col>

            <v-col class="text-right" cols="12" md="4">
              <v-dialog v-model="editForm" max-width="560px">

                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" depressed large color="cyan" class="white--text">
                    <v-icon left>mdi-plus</v-icon>Добавить
                  </v-btn>
                </template>

                <v-card light>

                  <v-toolbar flat dark color="cyan" class="flex-grow-0">
                    <v-toolbar-title class="ml-7">Новый производитель</v-toolbar-title>
                    <v-btn icon absolute dark right @click="closeEditForm()">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>


                  <validation-observer ref="observer" v-slot="{ invalid }">
                    
                    <v-card-text class="pa-7">
                      <v-form ref="editForm">

                        <validation-provider v-slot="{ errors }" name="Наименование" rules="required">
                          <v-text-field
                            v-model="form.name"
                            color="grey"
                            :error-messages="errors"
                            label="Наименование"
                            outlined
                            class="required"
                          ></v-text-field>
                        </validation-provider>

                        <validation-provider v-slot="{ errors }" name="Ссылка на сайт">
                          <v-text-field
                            v-model="form.site"
                            color="grey"
                            :error-messages="errors"
                            label="Ссылка на сайт"
                            outlined
                            append-icon="mdi-link"
                          ></v-text-field>
                        </validation-provider>

                        <validation-provider v-slot="{ errors }" name="Страна" rules="required">
                          <v-autocomplete
                            v-model="form.country"
                            :items="getCountries()"
                            no-data-text="Ничего не найдено"
                            color="grey"
                            :error-messages="errors"
                            label="Страна"
                            outlined
                            class="required"
                            append-icon="mdi-map"
                          >

                            <template slot="item" slot-scope="{ item }">
                              <div class="d-flex align-center">
                                <countryFlag :country="countryFlag(item)" size='normal' class="ma-0 pa-0"/>
                                <span>{{ item }}</span>
                              </div>                              
                            </template>

                            <template v-slot:selection="{ item }">
                              <div class="d-flex align-center">
                                <countryFlag :country="countryFlag(item)" size='normal' class="ma-0 pa-0"/>
                                <span>{{ item }}</span>
                              </div>
                            </template>

                          </v-autocomplete>
                        </validation-provider>

                        <validation-provider v-slot="{ errors }" name="Типы компонентов">
                          <v-autocomplete
                            v-model="form.compTypes"
                            :items="getCompTypes()"
                            no-data-text="Ничего не найдено"
                            multiple
                            color="grey"
                            :error-messages="errors"
                            label="Типы компонентов"
                            outlined
                            chips
                            append-icon="mdi-memory"
                          >

                            
                            <template #item="{ item }">                          
                              <v-list-item class="d-flex" @click="toggleItem(item)">
                                <div>
                                  <v-simple-checkbox color="primary" :value="isSelected(item)" @click="toggleItem(item)" />
                                </div>
                                <div class="ml-2" >
                                  <v-chip :color="typeColor(item)">
                                    <span class="text-caption">{{ item }}</span>
                                  </v-chip> 
                                </div>
                              </v-list-item>
                            </template>



                            <template v-slot:selection="{ attrs, item, select, selected }">
                              <v-chip 
                                dark small
                                v-bind="attrs"
                                :input-value="selected"
                                :color="typeColor(item)"
                                close
                                @click="select"
                                @click:close="remove(item)"
                              >
                                <span class="text-caption black--text">{{ item }}</span>
                              </v-chip>
                            </template>

                          </v-autocomplete>

                        </validation-provider>

                      </v-form>

                    </v-card-text>

                    <v-alert v-if="errorMessageForm" type="warning" text dismissible class="mx-7 mb-7">
                      {{ errorMessageForm }}
                    </v-alert>

                    <v-card-actions class="pa-7 pt-0">
                      <v-spacer></v-spacer>
                      <v-btn @click="closeEditForm()" color="pink" text>
                        Отмена
                      </v-btn>
                      <v-btn :disabled="invalid" @click.prevent="addBrand()" color="cyan" class="white--text">
                        Добавить
                      </v-btn>
                    </v-card-actions>

                  </validation-observer>
                </v-card>
              </v-dialog>
            </v-col>

          </v-row>

          <!-- Таблица -->
          <v-data-table 
            :items="filteredBrands" :headers="headers" 
            :search="search" hide-default-header
          >

            <!-- Удаление производителя -->
            <template v-slot:top>
                <v-dialog v-model="deleteDialog" max-width="max-content">
                  <v-card class="rounded-lg">
                    <v-card-title class="pa-7 pb-2 text-body-1 font-weight-regular text-no-wrap">Вы уверены, что хотите удалить производителя <strong class="ml-1">{{deletedName}}</strong>?</v-card-title>
                    <v-card-actions class="px-0 pt-2 pb-4 d-flex justify-center">
                      <v-btn @click="closeDelete" color="cyan" text>Отмена</v-btn>
                      <v-btn @click="deleteItemConfirm" color="pink" text class="white--text">Удалить</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>               
            </template>

            <!-- Хэдер таблицы -->
            <!-- <template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ props: { headers } }"> -->
            <!-- <template v-for="(col, i) in filters" v-slot:header="{ props: { headers } }"> -->
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.text">
                    <div v-if="filters.hasOwnProperty(header.value)">
                    
                      <span>{{ header.text }}</span>

                      <v-menu 
                        :close-on-content-click="false" 
                        :nudge-width="200" 
                        offset-y transition="slide-y-transition" 
                        left fixed style="position: absolute; right: 0"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                            <v-icon small 
                              :color="activeFilters[header.value] && activeFilters[header.value].length < filters[header.value].length ? 'red' : 'default'">
                              mdi-filter-variant
                            </v-icon>
                          </v-btn>
                        </template>

                        <v-list flat dense class="pa-0">
                          <v-list-item-group multiple v-model="activeFilters[header.value]" class="py-2">
                            <template v-for="item in filters[header.value]">
                              <v-list-item :key="`${item}`" :value="item" :ripple="false">
                                <template v-slot:default="{ active, toggle }">
                                  <v-list-item-action>
                                    <v-checkbox :input-value="active" :true-value="item"
                                      @click="toggle" color="primary" :ripple="false" dense></v-checkbox>
                                  </v-list-item-action>
                                  <v-list-item-content> 
                                    <v-list-item-title v-text="item"></v-list-item-title>
                                  </v-list-item-content>
                                </template>
                              </v-list-item>
                            </template>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>


                      <!-- <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on" @click="columnValueList(header.value)" ><v-icon>mdi-filter-outline</v-icon></v-btn> 
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="(item, i) in countryItems"
                            :key="i"
                          >
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>                    -->
                        
                        <!-- <v-select
                          :items="columnValueList(header.value)"
                          v-model="filters[header.value]"
                          flat hide-details multiple clearable
                        ></v-select> -->
                      <!-- </v-menu> -->


                      <!-- <span>{{ header.text }}</span>
                      <v-btn icon @click="toggleSelect = !toggleSelect"><v-icon>mdi-filter-outline</v-icon></v-btn>
                      <v-select
                        v-if="toggleSelect" :menu-props="{value: toggleSelect}"
                        :items="columnValueList(header.value)"
                        v-model="filters[header.value]"
                        flat hide-details multiple clearable
                      ></v-select> -->



                    </div>
                    <span v-else>{{ header.text }}</span>
                  </th>
                </tr>

                <!-- <tr class="grey lighten-3">
                  <th v-for="header in headers" :key="header.text">
                    <div v-if="filters.hasOwnProperty(header.value)">
                      <v-select flat hide-details multiple clearable :items="columnValueList(header.value)" v-model="filters[header.value]" >
                      </v-select>
                    </div>
                  </th>
                </tr> -->
              </thead>
            </template>






            <template v-slot:item="{ item }">
              <tr>

                <!-- "№" -->
                <td class="td-custom py-3 cursor-default text-center">#{{ item.id }}</td>

                <!-- "Название" -->
                <td class="td-custom py-3 cursor-default">
                  <div class="text-no-wrap">
                    {{ item.name }}
                    <v-btn v-if="item.site" icon color="grey lighten-1" link :href="item.site" target="_blank">
                      <v-icon>mdi-link</v-icon>
                    </v-btn>
                  </div>
                </td>

                <!-- "Страна" -->
                <td class="td-custom py-3 cursor-default text-center">
                  <div class="d-flex align-center">
                    <countryFlag :country="countryFlag(item.country)" size='normal' class="ma-0 pa-0"/>
                    <span>{{ item.country }}</span>
                  </div>
                </td>

                <!-- "Сайт" -->
                <!-- <td class="td-custom py-3 cursor-default">
                  <a target="_blank" :href="item.site">{{ item.site }}</a>
                </td> -->

                <!-- "Типы компонентов" -->
                <td class="td-custom py-3"> 
                  <v-chip-group column>
                    <v-chip v-for="type in item.compTypes" :key="type" :color="typeColor(type)" small>
                      <span :class="$vuetify.theme.dark ? 'black--text text-caption 111' : 'text-caption'">{{ type }}</span>
                    </v-chip>
                  </v-chip-group>
                </td>

                <!-- "Примечания" -->
                <td class="td-custom py-3 text-justify">             
                  <div class="text-caption">{{ item.notes }}</div>
                </td>

                <td>
                  <div class="d-flex">
                    <v-btn icon small color="cyan" @click="editItem(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small color="pink" @click="deleteItem(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>


                <!-- Раскрывашка графика -->
                <!-- <td class="py-3">
                  <v-btn icon 
                        @click="expand(!isExpanded)" 
                        class="v-data-table__expand-icon"
                        :class="{'v-data-table__expand-icon--active' : isExpanded}">
                    <v-icon></v-icon>
                  </v-btn>
                </td> -->

              </tr>
            </template>
          
          </v-data-table>

        </v-card>
      </v-col>
    </v-row>


    <!-- <v-row>
      <v-col>

        <v-data-iterator :items="brands" item-key="name" >
          
          <template v-slot:default="{ items }">
            <v-row>
              <v-col
                v-for="item in items" :key="item.name"
                cols="12" sm="6" md="6" lg="4"
              >
                <v-card flat class="rounded-lg">
                  <v-toolbar flat class="px-4">
                    <v-toolbar-title><h4 class="text-h6">{{ item.name }}</h4></v-toolbar-title>
                    <v-spacer></v-spacer>
                    

                    <v-menu bottom origin="center center" transition="scale-transition">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon class="mr-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                      </template>

                      
                      <v-list dense >
                        
                        <v-list-item link>
                          <v-list-item-title>Изменить</v-list-item-title>
                          <v-list-item-icon>
                            <v-icon small>mdi-pencil</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                        <v-list-item link>
                          <v-list-item-title>Удалить</v-list-item-title>
                          <v-list-item-icon  >
                            <v-icon small>mdi-delete</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                        
                        
                      </v-list>
                      
                    </v-menu>

                  </v-toolbar>

                  <v-divider></v-divider>

                  <v-card-text>
                    <div>
                      <span>Типы компонентов</span>

                      <v-container fluid class="ma-0 pa-0">
                        <v-row>
                          <v-col class="">
                            <v-chip-group column>
                              <v-chip v-for="type in item.compTypes" :key="type" :color="typeColor(type)" small>
                                <span class="text-caption">{{ type }}</span>
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                        </v-row>
                        
                      </v-container>

                    </div>
                  </v-card-text>
                

                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>

      </v-col>
    </v-row> -->


  </v-container>
</template>

<script>
  import brandsJson from '../brands.json'
  import componentTypes from '../componentTypes.json'
  import countriesJson from '../countries.json'

  import { ValidationProvider, ValidationObserver, setInteractionMode, extend, } from "vee-validate"
  import { required } from "vee-validate/dist/rules"
  setInteractionMode("aggressive")

  extend("required", {
    ...required,
    message: "{_field_} - обязательное поле",
  });


  export default {
    name: 'BrandsView',

    components: {
      ValidationProvider,
      ValidationObserver,
    },

    data(){
      return {

        brands: brandsJson.brands,
        countries: countriesJson.countries,
        compTypes: componentTypes.componentTypes,

        countriesList: [ //
          {text: "Все", value: null},
          {text: "Дружественная", value: 'OK'},
          {text: "Недружественная", value: 'notOK'},
        ],
        countriesFilterValue: null,

        countryItems: null,

// //////////////////////////////////
        dialog: false,

        filters: {
          country: [],
        },
        activeFilters: {},

// /////////////////////////////////

        filteredItems: null,

        search: '',

        editForm: false,
        deleteDialog: false,

        form: {
          id: 0,
          name: "",
          country: "",
          site: "",
          compTypes: [],
          logo: "",
          notes: ""
        },
        
        editedIndex: -1,
        editedItem: {
          id: 0,
          name: "",
          country: "",
          site: "",
          compTypes: [],
          logo: "",
          notes: ""
        },
        defaultItem: {
          id: 0,
          name: "",
          country: "",
          site: "",
          compTypes: [],
          logo: "",
          notes: ""
        },
        deletedName: '',
      }
    },

    computed: {

      headers() {
        return [
          {text: "№", value: "id", align: "center"},
          {text: "Наименование", value: "name"},
          {text: "Страна", value: "country", align: "center"},
          {text: 'countryType', value: 'countryType', filter: this.countriesFilter, align: ' d-none' },
          {text: "Типы компонентов", value: "compTypes"},
          {text: "Примечания", value: "notes", align: "center"},
          {text: "", value: "actions"}
        ]
      },

      filteredBrands() {
        return this.brands.filter(d => {
          return Object.keys(this.filters).every(f => {
            return this.filters[f].length < 1 || this.filters[f].includes(d[f])
          })
        })
      }

    },

    watch: {
      brands() {
        this.initFilters()
      }
    },

    created() {
      document.title = "Производители"
    },

    methods: {

      isSelected(item) {
        return this.form.compTypes.includes(item);
      },
      toggleItem(item) {
        if (this.form.compTypes.includes(item)) {
          this.form.compTypes = this.form.compTypes.filter(v => v !== item);
        } else {
          this.form.compTypes.push(item);
        }
      },

      remove (item) {
        this.form.compTypes.splice(this.form.compTypes.indexOf(item), 1)
        this.form.compTypes = [...this.form.compTypes]
      },


      getCompTypes() {
        let typesNames = []
        for (let i = 0; i < this.compTypes.length; i++) {
          typesNames.push(this.compTypes[i].name)
        }
        return typesNames   
      },

      typeColor(typeName) {
        let chipColor = 'grey lighten-2'
        for (let i = 0; i < this.compTypes.length; i++) {
          if (this.compTypes[i].name == typeName) {
            if (this.compTypes[i].color) {
              chipColor = this.compTypes[i].color
            } else chipColor = 'grey lighten-2' 
          }
        }
        return chipColor
      },

      getCountries() {
        let countryNames = []
        for (let i = 0; i < this.countries.length; i++) {
          countryNames.push(this.countries[i].name)
        }
        return countryNames       
      },

      countryFlag(itemCountry) {
        let flagIconId = ''

        for (let i = 0; i < this.countries.length; i++) {
          if (this.countries[i].name == itemCountry) {
            if (this.countries[i].countryId) {
              flagIconId = this.countries[i].countryId
            } else flagIconId = '' 
          }
        }
        return flagIconId
      },

      initFilters() {
        for (let col in this.filters) {
          this.filters[col] = this.brands.map((d) => { return d[col] }).filter(
            (value, index, self) => { return self.indexOf(value) === index }
          )
        }
        console.log(this.filters)

        this.activeFilters = Object.assign({}, this.filters)

      },

      editItem (item) {
        this.editedIndex = this.brands.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editDialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.brands.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.deleteDialog = true
        this.deletedName = item.name
      },

      deleteItemConfirm () {
        this.brands.splice(this.editedIndex, 1)
        this.closeDelete()
        this.deletedName = ''
      },


      closeEditForm () {
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.$refs.editForm.reset()
        });
        this.editForm = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.deleteDialog = false
        this.deletedName = ''
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.brands[this.editedIndex], this.editedItem)
        } else {
          this.brands.push(this.editedItem)
        }
        this.closeEditForm()
      },


      countriesFilter(value) {
        if (!this.countriesFilterValue) {
          return true;
        }
        return value === this.countriesFilterValue;
      },


      getFiltered(e) {
        this.filteredItems = e
        console.log(this.filteredItems)
      },

      columnValueList(val) {        
        let bebra = this.brands
        let res = bebra.filter(b => !this.countriesFilterValue || b.countryType == this.countriesFilterValue)
        this.countryItems = res.map(b => b[val])
        return res.map(b => b[val])
        // this.countriesFilterValue === null ? this.brands : this.brands.filter(b => b.countryType ===  this.countriesFilterValue)
      }


    }

  }

  
</script>
