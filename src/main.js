import Vue from 'nativescript-vue';
import store from './store';

import { firebase } from '@nativescript/firebase';

import RadListView from 'nativescript-ui-listview/vue';

import Master from './pages/Master/Master';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Firebase
// Optionally pass in properties for database, authentication and cloud messaging,
// see their respective docs.
firebase.init({
  onPushTokenReceivedCallback: (token) => {
    console.log('Firebase push token: ' + token);
  },
  showNotifications: true,
  showNotificationsWhenInForeground: true
});

// Elements
Vue.use(RadListView);

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);

Vue.registerElement(
  'PullToRefresh',
  () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh
);

// App
new Vue({
  store,
  render: h => h('frame', [h(Master)])
}).$start()
