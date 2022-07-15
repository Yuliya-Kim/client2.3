<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 :class="$vuetify.theme.dark ? 'text-h5 white--text' : 'text-h5 greyDarken-4--text' ">Главная</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // import HelloWorld from '../components/HelloWorld'
  import axios from 'axios'

  export default {
    name: 'HomeView',

    components: {
      // HelloWorld,
    },

    data: () => ({
      
      dataDraft: [],
      dataDraft2: [],
      dateArr: [],

      // Первый график
      series: [{
        name: '',
        data: [],
      }],
      options: {

        chart: {
          type: 'line',
          zoom: {
            type: 'x',
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 5,
            opacity: .45,
            color: '#63dcdc'
          },
        },

        dataLabels: { enabled: false },

        grid: {
          padding: {
            left: -10,
          },
          borderColor: 'rgba(255, 255, 255, .1)',
          strokeDashArray: 5,
          xaxis: {
            lines: { show: false }
          },   
          yaxis: {
            lines: { show: true }
          },
        },
        markers: {
          size: 1,
          colors: ['#fff'],
          shape: "circle",
          radius: 2,
          hover: {
            sizeOffset: 2
          }
        },

        stroke: {
          width: 4,
          curve: 'smooth',
          colors: [
            'rgba(32, 170, 170, 1)'
          ]
        },

        yaxis: {
          
        }
        

      },
    }),

    created() {
      document.title = "Главная"
    },

    mounted() {
      this.getData()
    },

    methods: {
      getData() {
        axios
        .post("/", {RFI: 40, trac_num: 1, win_num: 1})
        .then((response) => {
          this.dateArr = response.data.response
          for (let i=0; i<this.dateArr.length; i+=1) {            
            let ttt = this.dateArr[i].value
            this.dataDraft.push(ttt)
          }
          this.$refs.chart1.updateSeries([{
            name: '',
            data: this.dataDraft
          }])
        })
      }
    }
  }
</script>
