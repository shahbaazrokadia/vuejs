<template>
  <div>
    <h1>Events for {{ user.user.name }}</h1>
    <Todo v-for="event in event.events" :key="event.id" :event="event" />
    <template v-if="page != 1">
      <router-link :to="{ name: 'todo', query: { page: page - 1 } }" rel="prev">
        Prev Page</router-link
      >
      <template v-if="hasNextPage"> | </template>
    </template>
    <router-link
      v-if="hasNextPage"
      :to="{ name: 'todo', query: { page: page + 1 } }"
      rel="next"
    >
      Next Page</router-link
    >
  </div>
</template>

<script>
import Todo from "@/components/Todo.vue";
import { mapState } from "vuex";
import store from "@/store/store.js";

function getPageEvents(routeTo, next) {
  const currentPage = parseInt(routeTo.query.page) || 1;
  store
    .dispatch("event/fetchEvents", {
      page: currentPage
    })
    .then(() => {
      routeTo.params.page = currentPage;
      next();
    });
}

export default {
  props: {
    page: {
      type: Number,
      required: true
    }
  },
  components: {
    Todo
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next);
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next);
  },
  computed: {
    hasNextPage() {
      return this.event.eventsTotal > this.page * this.event.perPage;
    },
    ...mapState(["event", "user"])
  }
};
</script>
