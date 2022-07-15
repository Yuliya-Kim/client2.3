<template>
  <v-container fluid>

    <!-- ЗАГОЛОВОК -->
    <v-row>
      <v-col cols="12">
        <h2 :class="$vuetify.theme.dark ? 'text-h5 white--text' : 'text-h5 greyDarken-4--text' ">{{currentComp.type}} {{currentComp.name}}</h2>
      </v-col>
    </v-row>

    <v-row>

      <!-- ХАРАКТЕРИСТИКИ И ОПИСАНИЕ -->
      <v-col cols="6" class="d-flex">
        <v-card flat width="100%" class="pa-5 rounded-lg">

          <div class="d-flex align-center">
            <v-tabs v-model="tab">
              <v-tabs-slider color="pink"></v-tabs-slider>
              <v-tab 
                v-for="item in tabItems" :key="item"
                class="text-h6 font-weight-regular text-capitalize greyDarken-4--text" dense
              >{{item}}</v-tab>
            </v-tabs>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in tabItems" :key="item">
              
                <v-simple-table v-if="item=='Характеристики'" dense class="py-4">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td>Производитель</td>
                        <td>
                          {{currentComp.brand}}
                          <v-btn icon color="grey lighten-1" link :href="currentComp.brandSite" target="_blank">
                            <v-icon>mdi-link</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      <tr>
                        <td>Страна производителя</td>
                        <td>{{currentComp.country}}</td>
                      </tr>
                      <tr v-for="item in currentComp.specification" :key="item.id" class="specificationTableRow">
                        <td>{{ item.text }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>          

                <v-card-text v-else-if="item=='Описание'" class="text-justify">
                  {{ currentComp.specification.description }}
                </v-card-text>

            </v-tab-item>
          </v-tabs-items>

        </v-card>
      </v-col>

      <!-- ПРИМЕЧАНИЯ -->
      <v-col cols="6" class="d-flex">
        <v-card flat width="100%" class="pa-5 rounded-lg">
          <div class="d-flex justify-space-between align-center">
            <v-card-title  class="text-h6 font-weight-regular greyDarken-4--text"><span>Примечания</span></v-card-title>
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-card-text v-if="currentComp.notes">

            <v-row v-for="note in currentComp.notes" :key="note" class="ma-0 mb-5 d-flex">
              
              <v-col cols="12" class="pa-0">
                <v-hover v-slot="{ hover }">
                  <v-card slot="{ hover }" :class="`${hover ? 'd-flex elevation-2': 'd-flex elevation-0'}`">
                    <v-avatar size="40" color="cyan darken-3" class="mr-3 white--text">
                      {{note.initials}}
                    </v-avatar>

                    <div class="width100">
                      <div class="d-flex justify-space-between">
                        <span class="font-weight-medium black--text">{{ note.author }}</span>
                        <span class="text-caption">{{ note.date }}</span>
                      </div>
                      <span class="my-2 text-justify">{{ note.text }}</span>
                    </div>
                  </v-card>
                </v-hover>

              </v-col>

            </v-row>
            
          
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card flat class="pa-5 rounded-lg">
          
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  import microcontrollersJson from '../microcontrollers.json'

  export default {
    name: 'ComponentView',
    components: {
      // HelloWorld,
    },

    data() {
      return {
        tab: null,
        tabItems: [],
        tabContent: [],

        

        components: microcontrollersJson.microcontrollers,
        currentComp: null,
        ererfr: null
      };
    },

    created() {
      this.setComponent()
      document.title = `${this.currentComp.type} ${this.currentComp.name}`
      this.setTabs()
      // this.getAuthorInitials()
    },
    mounted() {
      
    },

    methods: {

      setComponent() {
        const currentС = this.components.find(с => с.name.replaceAll(' ', '_') === this.$route.params.id)
        this.currentComp = currentС
      },

      setTabs() {
        if ( this.currentComp.specification) {
          this.tabItems.push("Характеристики")
        }
        if ( this.currentComp.specification.description) {
          this.tabItems.push("Описание")
        }
      },

      


    },

  }
</script>


<style>

.specificationTableRow:hover {
    background: none !important;
}

</style>
