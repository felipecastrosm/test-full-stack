<template>
  <div class="users-container">
    <div class="users-container-header">
      <h1 class="users-title">Users List <button @click="createUser">+</button></h1>

      <input class="users-search" v-model="searchTerm" placeholder="Search..."/>
    </div>
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
  </div>
</template>

<script>
import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";
import userSearchQuery from "@/graphql/UserSearchQuery";

export default {
  name: "UsersContainer",
  components: { UserCard },
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
      this.$modal.show(UserForm, { userData: user, searchTerm: this.searchTerm }, {
        width: "1250px",
        height: "630px"
      });
    },
    createUser() {
      this.$modal.show(UserForm, { userData: {}, searchTerm: this.searchTerm }, {
        width: "1250px",
        height: "630px"
      });
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
      debounce: 500,
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
    width:100%;
  }

  .users-container-header {
    width: 100%;
    height: 100px;
  }

  .users-search {
    height: 50px;
    width: 350px;
    border-radius: 10px;
    border: 2px solid #ECECEC;
    font-size: 21px;
    float:right;
    padding-left: 10px;
  }

  .users-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .users-title {
    float: left;
    margin: 0;
  }
</style>