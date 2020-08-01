<template>
  <div class="users-container">
    <h1 class="users-title">Users List</h1>
    <button @click="createUser">+</button>
    <input class="users-search" v-model="searchTerm" placeholder="Search..."/>
    <div class="users-list" v-if="loaded">
      <user-card
          v-for="user in usersData"
          :key="user.id"
          :user="user"
          @edit="editUser(user)"
      ></user-card>
    </div>
    <div v-if="showMoreEnabled" class="show-more-container">
      <button @click="showMoreUsers">Show more</button>
    </div>
    <div class="alert alert-info" v-if="!loaded">
      Loading data...
    </div>

    <user-form v-if="editMode" :userData="editUserData" :searchTerm="searchTerm" @cancel="editMode = false"></user-form>
  </div>
</template>

<script>
import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";
import userSearchQuery from "@/graphql/UserSearchQuery";

export default {
  name: "UsersContainer",
  components: { UserCard, UserForm },
  props: {
  },
  data() {
    return {
      loaded: false,
      usersData: null,
      searchTerm: "",
      editMode: false,
      editUserData: null,
      nextToken: null,
      showMoreEnabled: false
    };
  },
  methods: {
    editUser(user) {
      this.editMode = true;
      this.editUserData = user;
    },
    createUser() {
      this.editMode = true;
      this.editUserData = {}
    },
    showMoreUsers() {

    }
  },
  apollo: {
    users: {
      query: userSearchQuery,
      variables() {
        return {
          filter: {
            name: this.searchTerm
          }
        };
      },
      fetchPolicy: "cache-and-network",
      debounce: 700,
      result({ data, loading, error }) {
        if (!loading && !error && data) {
          this.usersData = data.users.users;
          this.loaded = true;
        }
      },
      error(error) {
        console.error("We've got an error!", error);
      }
    }
  }
};
</script>

<style scoped>
  .users-container {

  }

  .users-list {
    float: left;
  }

  .users-title {
    float: left;
  }

  .users-search {
    float:right;
  }
</style>