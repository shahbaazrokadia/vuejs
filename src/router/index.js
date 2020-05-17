import Vue from "vue";
import VueRouter from "vue-router";
import TodoList from "../views/TodoList.vue";
import TodoShow from "../views/TodoShow.vue";
import TodoCreate from "../views/TodoCreate.vue";
import NProgress from "nprogress";
import store from "@/store/store.js";
import NotFound from "../views/NotFound.vue";
import NetworkIssue from "../views/NetworkIssue.vue";
import Example from "../views/Example.vue";

Vue.use(VueRouter);
("history");

const routes = [
  {
    path: "/",
    name: "todo",
    component: TodoList,
    props: true
  },
  {
    path: "/create-todo",
    name: "create-todo",
    component: TodoCreate
  },
  {
    path: "/example",
    name: "example",
    component: Example
  },
  {
    path: "/todo-list/:id",
    name: "todo-list",
    component: TodoShow,
    props: true,
    beforeEnter(routeTo, routrFrom, next) {
      store
        .dispatch("event/fetchEvent", routeTo.params.id)
        .then(event => {
          routeTo.params.event = event;
          next();
        })
        .catch(error => {
          if (error.response && error.response.status == 404) {
            next({ name: "404", params: { resource: "event" } });
          } else {
            next({ name: "network-issue" });
          }
        });
    }
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
    props: true
  },
  {
    path: "/network-issue",
    name: "network-issue",
    component: NetworkIssue
  },
  {
    path: "*",
    redirect: { name: "404", params: { resource: "page" } }
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});
router.beforeEach((routeTo, routrFrom, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
