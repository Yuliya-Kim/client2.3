<template>
  <v-container fluid>

    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 greyDarken-4--text">Компоненты</h2>
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

            <v-spacer></v-spacer>

            <v-col class="text-right" cols="auto">
              <v-dialog v-model="editForm" max-width="560px">

                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" depressed large color="cyan" class="white--text">
                    <v-icon left>mdi-plus</v-icon>Добавить
                  </v-btn>
                </template>

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


          <!-- Таблица -->
          <v-data-table :items="components" :headers="headers" :search="search" hide-default-header>


            <template v-slot:header="{ props: { headers } }">
                <thead>
                  <tr>
                    <th v-for="h in headers" :key="h" :class="h.class">
                      <span>{{h.text}}</span>
                    </th>
                  </tr>
                </thead>
            </template>

            <template v-slot:item="{ item }">
              <tr>

                <!-- "№" -->
                <!-- <td class="td-custom py-3 cursor-default text-center">#{{ item.id }}</td> -->

                <!-- "Название" -->
                <td class="td-custom py-3 cursor-default fixed-column">
                  
                  <div class="text-no-wrap">
                    <!-- {{ item.name }} -->
                    <router-link :to="{name: 'component' , params:{ id: item.name.replaceAll(' ', '_') }}" target="_blank" class="componentLink">
                      <span>{{ item.name}}</span>
                    </router-link>
                    <v-btn icon color="grey lighten-1" link :href="item.link" target="_blank">
                      <v-icon>mdi-link</v-icon>
                    </v-btn>
                  </div>
                </td>

                <!-- "Производитель" -->
                <td class="td-custom py-3 cursor-default text-center text-no-wrap">{{ item.brand }}</td>

                <!-- "Страна производителя" -->
                <td class="td-custom py-3 cursor-default text-center">
                  <div class="d-flex align-center">
                    <!-- <countryFlag :country="countryFlag(item.country)" size='normal' class="ma-0 pa-0"/> -->
                    <span>{{ item.country }}</span>
                  </div>
                </td>


                <!-- "Еще что-то 1" -->
                <td class="td-custom py-3 text-justify text-no-wrap">             
                  <div class="text-caption">Текстовый текст и даже цифры</div>
                </td>

                <!-- "Еще что-то 2" -->
                <td class="td-custom py-3 text-justify text-no-wrap">             
                  <div class="text-caption">Что-то написано</div>
                </td>

                <!-- "Еще что-то 3" -->
                <td class="td-custom py-3 text-justify text-no-wrap">             
                  <div class="text-caption">Какие-то данные?</div>
                </td>

                <!-- "Еще что-то 4" -->
                <td class="td-custom py-3 text-justify text-no-wrap">             
                  <div class="text-caption">Тут тоже текст</div>
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




  </v-container>
</template>

<script>
  import componentsJson from '../components.json'

  export default {
    name: 'ComponentsView',

    components: {
      // HelloWorld,
    },

    data() {
      return {
        components: componentsJson.components,

        headers: [
          // {text: "№", value: "id", align: "center"},
          {text: "Наименование", value: "name", class: "fixed-column"},
          {text: "Тип", value: "type", align: "center"},
          {text: "Производитель", value: "brand", align: "center"},
          {text: "Страна производителя", value: "country", align: "center"},
          {text: "Еще что-то 1", value: "", align: "center"},
          {text: "Еще что-то 2", value: "", align: "center"},
          {text: "Еще что-то 3", value: "", align: "center"},
          {text: "Еще что-то 4", value: "", align: "center"},
          {text: "", value: "actions"},
        ],

        
      }
    },

    created() {
      document.title = "Компоненты"
    }

  }
</script>
