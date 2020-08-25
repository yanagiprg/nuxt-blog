// import _ from 'lodash'
// import firebase from '~/plugins/firebase'

// export default function({ store }) {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       console.log(user)
//       console.log('middleware/default.vue')
//       store.commit('login/setUser', _.cloneDeep(user))
//       store.commit('setUser', _.cloneDeep(user))
//       store.commit('login/setIsLogin', true)
//       store.dispatch('getArticles')
//     } else {
//       store.commit('setUser', null)
//       store.commit('login/setIsLogin', false)
//       // redirect('/login')
//     }
//   })
// }
