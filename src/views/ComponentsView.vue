<template>
  <v-container fluid>

    <v-row>
      <v-col cols="12">
        <h2 :class="$vuetify.theme.dark ? 'text-h5 white--text' : 'text-h5 greyDarken-4--text' ">Микроконтроллеры</h2>
      </v-col>
    </v-row>

    <v-row>
      <!-- ФИЛЬТРЫ -->
      <v-col v-if="showFilters" :cols="showFilters ? 2 : auto">

        <!-- Фильтры -->
        <v-card flat class="rounded-lg">

          <v-row no-gutters class="pa-5">
            <v-col cols="6">
              <v-btn  v-on:click="showFilters=!showFilters" text block color="cyan darken-2">Скрыть</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn v-on:click="activeFilters={}" text block color="pink">Очистить</v-btn>
            </v-col>
          </v-row>

          <v-expansion-panels  flat hover tile v-model="activePanels" multiple>

            <v-expansion-panel v-for="(value, key, i) in filters" :key="key" >

              <v-expansion-panel-header class="px-5 py-0 exp-panel-header-active">     
                <template>
                  <div class="d-flex align-center">

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <span  v-on="on">
                          <v-checkbox 
                            v-model="checkedHeaders" 
                            :value="headersFilterList[i]"
                            @click.native="check($event)"
                            @click="toggleSelected(headersFilterList[i].value, i)"
                            :on-icon="'mdi-pin'"
                            :off-icon="'mdi-pin-off-outline'"
                            :color="checkedHeaders.some(e => e.value === headersFilterList[i].value) ? 'cyan' : ''"
                            class="ma-0 pa-0 unfocus"
                            hide-details  
                            dense
                          ></v-checkbox>
                        </span>
                      </template>

                      <span v-if="checkedHeaders.some(e => e.value === headersFilterList[i].value)">Скрыть столбец "{{headersFilterList[i].text}}"</span>
                      <span v-else>Показать столбец "{{headersFilterList[i].text}}"</span>

                    </v-tooltip>
                    <span class="text-no-wrap">{{headers[i+1].text}}</span>
                    
                  </div>
                </template>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pa-0">
                <v-card flat class="pa-0  ">

                  <v-card-text class="pa-0"> 

                    <v-list flat dense class="pa-0">

                      <v-list-item-group  multiple v-model="activeFilters[key]" class="py-2">
                        <template v-for="item in filters[key]">
                          <v-list-item :key="`${item}`" :value="item" :ripple="false" class="pa-0">
                            <template v-slot:default="{ active }">
                              <v-list-item-action>
                                <v-checkbox
                                  :input-value="active" :true-value="item"
                                  color="deep-orange lighten-2" :ripple="false" dense
                                  @click="bibka(key)"
                                ></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content> 
                                <v-list-item-title v-text="item"></v-list-item-title>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </template>
                      </v-list-item-group>

                      <!-- <v-row no-gutters>
                        <v-col cols="6">
                          <v-btn text block @click="toggleAll(header.value)" color="cyan darken-2">Выбрать всё</v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn text block @click="clearAll(header.value)" color="pink">Очистить</v-btn>
                        </v-col>
                      </v-row> -->

                    </v-list>

                  </v-card-text>

                </v-card>     
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>
        </v-card>
      </v-col>

      <!-- ТАБЛИЦА -->
      <v-col :cols="showFilters ? 10 : auto">
        <v-card flat class="pa-5 rounded-lg">
          

          <!-- ПОИСК И ДОБАВЛЕНИЕ -->
          <v-row>
            <!-- Поиск -->
            <v-col v-if="!showFilters" class="d-flex">
              <v-btn v-on:click="showFilters=!showFilters" text color="cyan darken-2">Показать фильтры</v-btn>
              <v-btn v-on:click="activeFilters={}" text color="cyan darken-2">Очистить фильтры</v-btn>
            </v-col>

            <v-col>
              <v-text-field v-model="search" dense outlined hide-details single-line color="grey" label="Поиск" append-icon="mdi-magnify"></v-text-field>
            </v-col>

            <v-col class="text-right">
              <v-dialog v-model="editForm" max-width="560px">
                <!-- "Добавить" -->
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" depressed :color="$vuetify.theme.dark ? 'cyan darken-4' : 'cyan'" class="white--text">
                    <v-icon left>mdi-plus</v-icon>Добавить
                  </v-btn>
                </template>

                <!-- Форма добавления компонента -->
                <v-card light>

                  <v-toolbar flat dark color="cyan" class="flex-grow-0">
                    <v-toolbar-title class="ml-7">Новый компонент</v-toolbar-title>
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

          <!-- ТАБЛИЦА КОМПОНЕНТОВ -->
          <v-data-table 
            :items="components" :headers="selectedHeaders" :search="search"
            :rows-per-page-items="[10, 20, 30, 40]"
            :footer-props="{ 'items-per-page-options': [-1, 20, 30, 40, 50, ], 'itemsPerPageText': 'Количество записей', 'items-per-page-all-text' : 'Все', }" 
            class="components-table custom-scrollbar"
          >

            <template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }">
              <div :key="col" class="d-inline-flex align-center justify-space-between">
              
                <span :key="col">{{ header.text }}</span>
                
                <div :key="col">

                  <v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed style="position: absolute; right: 0">
                    
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                        <v-icon small :color="activeFilters[header.value] && activeFilters[header.value].length > 0 ? 'pink' : 'grey lighten-1'">
                          mdi-filter-variant
                        </v-icon>
                      </v-btn>
                    </template>

                    <v-list flat dense class="pa-0">

                      <v-list-item-group multiple v-model="activeFilters[header.value]" class="py-2">
                        <template v-for="item in filters[header.value]">
                          <v-list-item :key="`${item}`" :value="item" :ripple="false">
                            <template v-slot:default="{ active }">
                              <v-list-item-action>
                                <v-checkbox 
                                  :input-value="active" :true-value="item" 
                                  color="deep-orange lighten-2" :ripple="false" dense
                                ></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content> 
                                <v-list-item-title v-text="item"></v-list-item-title>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </template>
                      </v-list-item-group>

                      <v-divider></v-divider>

                      <v-row no-gutters>
                        <v-col cols="6">
                          <v-btn text block @click="toggleAll(header.value)" color="cyan darken-2">Выбрать всё</v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn text block @click="clearAll(header.value)" color="pink">Очистить</v-btn>
                        </v-col>
                      </v-row>

                    </v-list>
                  </v-menu>
                </div>

              </div>
            </template>

            <!-- <template v-slot:[`header.name`] >
              <span @click="fixColumn()">Наименование</span>
            </template> -->

            <template v-slot:item="{ item }">
              <tr>

                <!-- "Название" -->
                <td class="cursor-default fixed-col">
                  <div class="text-no-wrap">
                    <router-link :to="{name: 'component' , params:{ id: item.name.replaceAll(' ', '_') }}" target="_blank" class="componentLink">
                      <span>{{ item.name}}</span>
                    </router-link>
                  </div>
                </td>

                <!-- "Производитель" -->
                <td v-if="selectedHeaders.some(e => e.value === 'brand')" class="cursor-default  text-no-wrap"><div>{{ item.brand }}</div></td>

                <!-- "Страна производителя" -->
                <td v-if="selectedHeaders.some(e => e.value === 'country')" class="cursor-default text-center">
                  <div class="d-flex align-center">
                    <!-- <countryFlag :country="countryFlag(item.country)" size='normal' class="ma-0 pa-0"/> -->
                    <span>{{ item.country }}</span>
                  </div>
                </td>

                <!-- "SubFamily" -->
                <td v-if="selectedHeaders.some(e => e.value === 'subFamily')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.subFamily }}</div>
                </td>

                <!-- "CPU" -->
                <td v-if="selectedHeaders.some(e => e.value === 'CPU')" class="text-justify text-no-wrap">             
                  <div class="text-caption">
                    <span>{{ item.CPU.join(', ') }}</span>
                  </div>
                </td>

                <!-- "Frequency (MHz)" -->
                <td v-if="selectedHeaders.some(e => e.value === 'frequency')" class="text-justify text-no-wrap">             
                  <span class="text-caption">{{ item.frequency.join(', ') }}</span>
                </td>

                <!-- "Flash memory (KB)" -->
                <td v-if="selectedHeaders.some(e => e.value === 'flashMemory')" class="text-justify text-no-wrap">             
                  <span class="text-caption">{{ item.flashMemory.join(', ') }}</span>
                </td>

                <!-- "RAM (KB)" -->
                <td v-if="selectedHeaders.some(e => e.value === 'RAM')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.RAM.join(', ') }}</div>
                </td>

                <!-- "ADC" -->
                <td v-if="selectedHeaders.some(e => e.value === 'ADC')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.ADC.join(', ') }}</div>
                </td>

                <!-- "GPIO" -->
                <td v-if="selectedHeaders.some(e => e.value === 'GPIO')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.GPIO.join(', ') }}</div>
                </td>

                <!-- "Communication interface" -->
                <td v-if="selectedHeaders.some(e => e.value === 'commInterface')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.commInterface.join(', ') }}</div>
                </td>

                <!-- "UART" -->
                <td v-if="selectedHeaders.some(e => e.value === 'UART')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.UART.join(', ') }}</div>
                </td>

                <!-- "Features" -->
                <td v-if="selectedHeaders.some(e => e.value === 'features')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.features.join(', ') }}</div>
                </td>

                <!-- "Package Group" -->
                <td v-if="selectedHeaders.some(e => e.value === 'packageGroup')" class="text-justify text-no-wrap">       
                  <div v-for="pack in item.packageGroup" :key="pack">
                    <span>{{ pack.type }}</span> | <span>{{ pack.pinsNum }}</span>
                  </div>
                </td>

                <!-- "Operating temperature range" -->
                <td v-if="selectedHeaders.some(e => e.text === 'Operating temperature range')" class="text-justify text-no-wrap">             
                  <div class="text-caption">{{ item.tempMin }} - {{ item.tempMax }}</div>
                </td>


                <!-- ACTIONS -->
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
          
            <template v-slot:[`footer.page-text`]="items"> 
              {{ items.pageStart }} - {{ items.pageStop }} из {{ items.itemsLength }} 
            </template>


            <template v-slot:no-results>
              <div class="d-flex justify-center align-center no-results">
                <span class="text-h5">Ничего не найдено</span>
              </div>
            </template>

          </v-data-table>

        </v-card>

        <!-- <br><br>
        <strong>filters: </strong> {{filters}}<br><br>
        <strong>activeFilters: </strong> {{activeFilters}}<br><br>
        <strong>filtersMerged: </strong> {{filtersMerged}}<br><br>
        {{filters.frequency}} -->
      

      <strong>activeFilters:  </strong> {{activeFilters}}
      </v-col>

    </v-row>


  </v-container>
</template>

<script>
  import microcontrollersJson from '../microcontrollers.json'

  export default {
    name: 'ComponentsView',

    components: {
      // HelloWorld,
    },

    data() {
      return {
        search: '',
        components: [],

        headers: [
          {id: 1, text: "Наименование", value: "name", class: "fixed-column "},
          {id: 2, text: "Производитель", value: "brand", class: "text-no-wrap"},
          {id: 3, text: "Страна производителя", value: "country", class: "text-no-wrap"},
          
          {id: 4, text: "SubFamily", value: "subFamily", class: "text-no-wrap"},
          {id: 5, text: "CPU", value: "CPU", class: "text-no-wrap"},
          {id: 6, text: "Frequency (MHz)", value: "frequency", class: "text-no-wrap"},   
          {id: 7, text: "Flash memory (KB)", value: "flashMemory", class: "text-no-wrap"},
          {id: 8, text: "RAM (KB)", value: "RAM", class: "text-no-wrap"},
          {id: 9, text: "ADC", value: "ADC", class: "text-no-wrap"},   
          {id: 10, text: "GPIO", value: "GPIO", class: "text-no-wrap"},        
          {id: 11, text: "Communication interface", value: "commInterface", class: "text-no-wrap"},
          {id: 12, text: "UART", value: "UART", class: "text-no-wrap"},
          {id: 13, text: "Features", value: "features", class: "text-no-wrap"},
          
          {id: 14, text: "Package Group", value: "packageGroup", class: "text-no-wrap"},
          {id: 15, text: "Operating temperature range", value: "", class: "text-no-wrap"},
          {id: 16, text: "", value: "actions"},
        ],
        // selectedHeaders: [],
        checkedHeaders: [],
        headersFilterList: [],

        showFilters: true,
        filters: { 
          brand: [], 
          country: [],
          subFamily: [],
          CPU: [],
          frequency: [],
          flashMemory: [],

          RAM: [],
          ADC: [],
          GPIO: [],
          commInterface: [],
          UART: [],
          features: [],
          packageGroup: [],
        },
        filtersNames: [],
        activeFilters: {},

        // filtersMerged: [],
        activeFiltersMerged: {},
        showFiltersTooltip: false,

        timer: null,

        activePanels: [],
      }    
    },
    
    computed: {
      selectedHeaders() {
        let headers = [
          {id: 1, text: "Наименование", value: "name", class: "fixed-col"},
        ]

        if (this.checkedHeaders.some(e => e.value === 'brand')) {
          headers.push({id: 2, text: "Производитель", value: "brand", filter: v => { return this.activeFilters.brand && this.activeFilters.brand.length != 0 ? this.activeFilters.brand.includes(v) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'country')) {
          headers.push({id: 3, text: "Страна производителя", value: "country", filter: v => { return this.activeFilters.country && this.activeFilters.country.length != 0 ? this.activeFilters.country.includes(v) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'subFamily')) {
          headers.push({id: 4, text: "SubFamily", value: "subFamily", filter: v => { return this.activeFilters.subFamily && this.activeFilters.subFamily.length != 0 ? this.activeFilters.subFamily.includes(v) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'CPU')) {     
          headers.push({id: 5, text: "CPU", value: "CPU", filter: v => { return this.activeFilters.CPU && this.activeFilters.CPU.length != 0 ? this.activeFilters.CPU.some( r => v.includes(r) ) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'frequency')) {
          headers.push({id: 6, text: "Frequency (MHz)", value: "frequency", filter: v => { return this.activeFilters.frequency && this.activeFilters.brand.frequency != 0 ? this.activeFilters.frequency.some( r => v.includes(r) ) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'flashMemory')) {
          headers.push({id: 7, text: "Flash memory (KB)", value: "flashMemory", filter: v => { return this.activeFilters.flashMemory && this.activeFilters.flashMemory.length != 0 ? this.activeFilters.flashMemory.some( r => v.includes(r) ) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'RAM')) {
          headers.push({id: 8, text: "RAM (KB)", value: "RAM", filter: v => { return this.activeFilters.RAM && this.activeFilters.RAM.length != 0 ? this.activeFilters.RAM.some( r => v.includes(r) ) : true;},  class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'ADC')) {
          headers.push({id: 9, text: "ADC", value: "ADC", filter: v => { return this.activeFilters.ADC && this.activeFilters.ADC.length != 0 ? this.activeFilters.ADC.some( r => v.includes(r) ) : true;},  class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'GPIO')) {
          headers.push({id: 10, text: "GPIO", value: "GPIO", filter: v => { return this.activeFilters.GPIO && this.activeFilters.GPIO.length != 0 ? this.activeFilters.GPIO.some( r => v.includes(r) ) : true;}, class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'commInterface')) {
          headers.push({id: 11, text: "Communication interface", value: "commInterface", filter: v => { return this.activeFilters.commInterface && this.activeFilters.commInterface.length != 0 ? this.activeFilters.commInterface.some( r => v.includes(r) ) : true;}, class: "text-no-wrap"})
        }      
        if (this.checkedHeaders.some(e => e.value === 'UART')) {
          headers.push({id: 12, text: "UART", value: "UART", filter: v => { return this.activeFilters.UART && this.activeFilters.UART.length != 0 ? this.activeFilters.UART.some( r => v.includes(r) ) : true;},  class: "text-no-wrap"})
        }
        if (this.checkedHeaders.some(e => e.value === 'features')) {
          headers.push({id: 13, text: "Features", value: "features", filter: v => { return this.activeFilters.features && this.activeFilters.features.length != 0 ? this.activeFilters.features.some( r => v.includes(r) ) : true;},  class: "text-no-wrap"})
        } 
        if (this.checkedHeaders.some(e => e.value === 'packageGroup')) {
          headers.push({id: 14, text: "Package Group", value: "packageGroup", filter: v => { return this.activeFilters.packageGroup && this.activeFilters.packageGroup.length != 0 ? this.activeFilters.packageGroup.some( r => v.includes(r) ) : true;},  class: "text-no-wrap"})
        }


        // if (this.checkedHeaders.some(e => e.text === 'Operating temperature range')) {
        //   headers.push({id: 15, text: "Operating temperature range", value: "", align: "center", class: "text-no-wrap"})
        // }             

        headers.push({id: 16, text: "", value: "actions"})

        return headers
      }
    },

    watch: {
      components () {
        this.initFilters()
        //this.activeFilters = {} 
        //this.activeFilters = Object.assign({}, this.filters)
      }
    },


    mounted() {
      document.title = "Микроконтроллеры"
      this.initialize()

      this.headersFilterList = this.headers.filter(v => v.value !="name" && v.value !="actions")
      this.checkedHeaders = this.headersFilterList
      
      setInterval(() =>  this.biba(), 1000);
    },

    methods: {

      biba() { /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        let tableScroll = document.querySelector(".v-data-table__wrapper")
        tableScroll.addEventListener('scroll', this.fixColumn)
      },

      initialize () {
        this.components = microcontrollersJson.microcontrollers
      },

      // Формирование значений в фильтрах
      initFilters() {
        
        for (let col in this.filters) {
          this.filters[col] = this.components.map((d) => { return d[col] })
          this.filters[col] = this.filters[col].concat.apply([], this.filters[col]).filter(
            (value, index, self) => { return self.indexOf(value) === index }
          ).sort(function (a, b) { if (a > b) return 1; if (a < b) return -1; return 0; })
        }

        // this.activeFilters = Object.assign({}, this.filters)
        
        this.filtersMerged = this.filtersMerged.concat.apply([], this.filters.frequency)
      },

      // Выбор всех значений фильтра
      toggleAll (col) {
        this.activeFilters[col] = this.components.map((d) => { return d[col] }).filter(
          (value, index, self) => { return self.indexOf(value) === index }
        )
      },
      // Очищение списка выбранных значений фильтра
      clearAll (col) {
        this.activeFilters[col] = []
      },

      // Фиксирует столбец при скролле таблицы 
      fixColumn(e) {
        let fixedCol = document.getElementsByClassName('fixed-col')
        let scrollPosition = e.target.scrollLeft;
        console.log(scrollPosition)
        if (scrollPosition != 0) {
          for (var i = 0; i < fixedCol.length; i++) {
            fixedCol[i].classList.add("fixed-col-active")
          }  
        } else {
          for (i = 0; i < fixedCol.length; i++) {
            fixedCol[i].classList.remove("fixed-col-active")
          }                 
        }       
      },

      
      check(e) {
        e.cancelBubble = true;
      },

      // Сброс выбранных значений фильтра при отключении соответствующего столбца
      toggleSelected(filterGroup, i) { 

        if (!this.checkedHeaders.some(e => e.value === filterGroup)) {

          delete this.activeFilters[filterGroup]

          let index = this.activePanels.indexOf(i)
          this.activePanels.splice(index, 1)
        }


      },

      bibka(item) {
        if (!this.checkedHeaders.some(e => e.value === item)) {
          const index = this.headersFilterList.findIndex(i => i.value === item)
          this.checkedHeaders.push(this.headersFilterList[index])
        }
      }


      // fixColumn() {
      //   var elements = document.getElementsByClassName("v-data-table__wrapper");

      //   elements[0].addEventListener('scroll',  function(e) {
      //     let fixedCol = document.getElementsByClassName('fixed-col')
      //     let scrollPosition = e.target.scrollLeft;

      //     if (scrollPosition != 0) {
      //       for (var i = 0; i < fixedCol.length; i++) {
      //         fixedCol[i].classList.add("fixed-col-active")
      //       }  
      //     } else {
      //       for (i = 0; i < fixedCol.length; i++) {
      //         fixedCol[i].classList.remove("fixed-col-active")
      //       }                 
      //     }
      //   })
      // }
    },
  }
</script>


<style scoped>
.active-header-item::before { /* Убирает выделение активного элемента */
  opacity: 0 !important;
}

.filters-header-list { /* Высота списка headers в фильтрах */
  max-height: 300px;
  overflow-y: scroll; 
}

>>>.v-list-item__action { /* Убирает странный отступ у чекбоксов в списках фильтров */
  margin-right: 8px !important;
}

>>>.v-expansion-panel-header--active {
  font-weight: 500 !important;
}

.exp-panel-header-active:hover {
  /* background: #FF9E80; */
}
/* .components-table .v-data-table-header */

>>>.v-expansion-panels.v-expansion-panels--hover > .v-expansion-panel > .v-expansion-panel-header:hover:hover::before { /* Убирает выделение пункта списка в фильтрах при переключении чекбокса */
  opacity: 0 !important;
}

.filter-card-content {
  max-height: 200px;
  overflow-y: scroll;
}

.no-results {
  height: 400px;
  background: no-repeat right bottom/15% url("../assets/no-results-kitty.png");
}
</style>