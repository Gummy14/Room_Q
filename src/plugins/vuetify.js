import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import VueYoutube from 'vue-youtube'
 
Vue.use(VueYoutube)
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    dark: true
  }
});
