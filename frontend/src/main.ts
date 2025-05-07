
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';


import Button from 'primevue/button';
import Rating from 'primevue/rating';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import 'primeicons/primeicons.css';



const app = createApp(App)

app.use(createPinia())
app.use(router)




app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false // Disables dark mode entirely
      }
    }
  })


  app.component('Button', Button)
app.component('Rating', Rating)
app.component('Tag', Tag)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Row', Row)

app.mount('#app')
