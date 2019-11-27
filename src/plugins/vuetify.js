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
    dark: true,
    themes: {
      dark: {
        primary: '#FFFFFF',
        accent: '#84000E',
        secondary: '#DB01C3',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
    }
  }
});
