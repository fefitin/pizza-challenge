import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { firebase } from '@firebase/app'
import '@firebase/auth'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/registro",
    name: "registro",
    // route level code-splitting
    // this generates a separate chunk (registro.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "registro" */ "../views/Registro.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/login/recuperar",
    name: "recuperar",
    component: () =>
      import(/* webpackChunkName: "recuperar" */ "../views/Recuperar.vue")
  },
  {
    path: "/challenges/:challengeId",
    name: "challenge",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Challenge.vue")
  },
  {
    path: "/challenges/:challengeId/:pizzeriaId",
    name: "pizzerias",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Votar.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if(requiresAuth && !currentUser) {
    next('/login');
  } else if(!requiresAuth && currentUser) {
    next('/');
  } else {
    next();
  }
})

export default router;
