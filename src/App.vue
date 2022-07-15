<template>
  <v-app>

    <!-- Хедер -->
    <v-app-bar app absolute flat width="100%" :color="$vuetify.theme.dark ? 'cyan darken-4' : 'cyan darken-1' " height="64">
      
      <div class="page-wrapper" style="width: 100%;">
        <v-container fluid>
          <v-row>

            <v-col class="py-0 d-flex align-center">
              <a href="/" v-if="$vuetify.breakpoint.mdAndUp" class="d-flex align-start text-decoration-none">
                <v-img max-height="30" max-width="30" src="./assets/logo.png" class="align-self-center"></v-img>
                <h2 class="text-h6 pl-3 white--text d-flex align-center">Название название</h2>
              </a>
              <v-chip v-if="$vuetify.breakpoint.mdAndUp" small light label color="white" class="ml-2">alpha</v-chip>
              <v-btn icon @click="darkMode" color="white" class="mx-2">
                <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
                <v-icon v-else>mdi-white-balance-sunny</v-icon>
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>

            <v-col class="text-right">
              <avatarMenu/>
            </v-col>

          </v-row>
        </v-container>
      </div>

    </v-app-bar>

    <!-- MAIN -->
    <v-main app :class="$vuetify.theme.dark ? '' : 'page-background'">

      <!-- Горизонтальное меню -->
      <v-toolbar 
        dense class="topMenu"
        :flat="pageScrolled == true ? false : true"  
        :class="(pageScrolled == true) ? 'menuDark' : '' "
      >
        <div class="page-wrapper fill-height">
          <v-toolbar-items>
            <v-btn 
              v-for="item in menuItems" :key="item.title" :to="item.path" 
              text class="navItem" :ripple="false"
              :color="$vuetify.theme.dark ? 'white' : 'grey darken-2'"
              :active-class="$vuetify.theme.dark ? 'navItemActive--dark' : 'navItemActive'"
            >
              <v-icon left dark>{{ item.icon }}</v-icon>
              <span>{{ item.title }}</span>
            </v-btn>
          </v-toolbar-items>
        </div>
      </v-toolbar>

      <div class="page-wrapper">
        <router-view/>
      </div>

      <v-fab-transition>     
        <v-btn v-scroll="onScroll" v-show="fab" @click="toTop" fab fixed bottom right dark color="deep-orange accent-2">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-fab-transition> 

    </v-main>


  </v-app>
</template>

<script>

import avatarMenu from './components/avatarMenu'

export default {
  name: 'App',
  components: {
    avatarMenu,
  },

  data: () => ({
    sidebar: false,
    menuItems: [
        { title: 'Главная', path: '/', icon: 'mdi-home-outline' },
        { title: 'Компоненты', path: '/components', icon: 'mdi-memory' },
        { title: 'Производители', path: '/brands', icon: 'mdi-shopping-outline' }
    ],
    pageScrolled: false,
    headerMenuClass: '',
    fab: false,
  }),

  mounted() {
    window.addEventListener("scroll", this.changeMenuStyleOnScroll)
  },

  methods: {

    changeMenuStyleOnScroll() {
      if (window.scrollY >= 1 || window.pageYOffset >= 1) {
        this.pageScrolled = true

      } else {
        this.pageScrolled = false
      }
    },

    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },


    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>

<style scoped>
>>>.v-toolbar__content, >>>.v-toolbar__extension {
  padding: 0;
}
.page-wrapper {
  /* flex-basis: 1300px; */
  /* max-width: 1300px; */
  /* margin: auto; */
  margin: 0 20px;
}
.page-background {
  background: #eef5f9;
}

/* .page-background {
  background: linear-gradient(#24778a, #484c7b);
} */

>>>.themeSwitch .v-input__control .v-messages { /* Убирает блок сообщений у перелючателя темы */
  display: none !important;
}
>>>.themeSwitch .v-input__control .v-input__slot { /* Убирает марджины у перелючателя темы */
  margin: 0;
}


>>>.v-btn--active.v-btn--text.navItem::hover::before { /* Убирает цвет фона выбранной кнопки */
  opacity: 0;
}

>>>.v-btn--active.v-btn--text.navItem::before { /* Убирает цвет фона выбранной кнопки */
  opacity: 0;
}

>>>.v-btn--active.navItem.navItemActive {
  color: #212121 !important;
}
>>>.v-btn--active.navItem.navItemActive--dark {
  color: #00acc1 !important;
}

.topMenu {
  position: sticky !important;
  top: 0 !important;
  z-index: 99 !important;
}

.topMenu.biba {
  background: #00acc1 !important;
}

.menuDark {
  border-bottom: 1px solid #00bcd4 !important;
}
</style>