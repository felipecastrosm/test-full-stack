<template>
  <div class="users-container">
    <div class="users-container-header">
      <h1 class="users-title">Users List <button class="secondary-button" @click="createUser" title="Add User">+</button></h1>

      <input class="users-search" v-model="searchTerm" placeholder="Search..."/>
    </div>
    <div class="users-list" v-if="loaded && usersData.length > 0">
      <user-card
          v-for="user in usersData"
          :key="user.id"
          :user="user"
          @edit="editUser(user)"
      ></user-card>
    </div>
    <div class="users-list" v-if="loaded && usersData == 0">
      <span class="users-list-empty">ooops, nothing to show...</span>
    </div>
    <div v-if="nextToken" class="show-more-container">
      <button @click="showMoreUsers">Load more</button>
    </div>
    <div class="users-list-loading" v-if="!loaded">
      <img src="../assets/spinner.gif" />
    </div>
  </div>
</template>

<script>
import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";
import userSearchQuery from "@/graphql/UserSearchQuery";

const firstLoadLimit = 6;

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
      nextToken: null
    };
  },
  methods: {
    editUser(user) {
      this.$modal.show(UserForm, { userData: user, searchTerm: this.searchTerm, nextToken: this.nextToken, limit: firstLoadLimit }, {
        width: "1250px",
        height: "630px"
      });
    },
    createUser() {
      this.$modal.show(UserForm, { userData: {}, searchTerm: this.searchTerm, nextToken: this.nextToken, limit: firstLoadLimit }, {
        width: "1250px",
        height: "630px"
      });
    },
    showMoreUsers() {
      this.$apollo.queries.users.fetchMore({
        variables: {
          filter: {
            name: this.searchTerm
          },
          limit: 3,
          nextToken: this.nextToken
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newUsers = fetchMoreResult.users.users;
          this.nextToken = fetchMoreResult.users.nextToken;

          return {
            users: {
              __typename: previousResult.users.__typename,
              users: [...previousResult.users.users, ...newUsers],
              nextToken: fetchMoreResult.users.nextToken
            }
          }
        }
      })
    }
  },
  apollo: {
    users: {
      query: userSearchQuery,
      variables() {
        return {
          filter: {
            name: this.searchTerm
          },
          nextToken: null,
          limit: firstLoadLimit
        };
      },
      fetchPolicy: "cache-and-network",
      debounce: 100,
      result({ data, loading, error }) {
        if (!loading && !error && data) {
          this.usersData = data.users.users;
          this.nextToken = data.users.nextToken;
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
    width: 92%;
    height: 100px;
    padding: 0 4%;
  }

  .users-search {
    height: 50px;
    width: 330px;
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

  .users-title button {
    font-size: 30px;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 26px;
    margin-left: 10px;
  }

  .show-more-container button {
    height: 60px;
    padding: 0 50px;
  }

  .users-list-empty {
    font-size: 40px;
    margin-top: 100px;
  }
</style>