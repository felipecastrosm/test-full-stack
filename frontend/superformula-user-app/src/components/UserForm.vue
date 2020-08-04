<template>
  <div class="user-form-container">
    <h1 v-if="userData.id">Edit User</h1>
    <h1 v-if="!userData.id">Create User</h1>
    <div class="user-form-left">
      <div class="user-form-map">
        <user-form-map :coordinates="coordinates"></user-form-map>
      </div>
      <button class="secondary-button" v-if="userData.id" @click="deleteUser">Remove</button>
    </div>
    <div class="user-form-data">
      <form method="POST" @submit.prevent>
        <label>Name</label>
        <input type="text" name="name" v-model="userData.name">

        <label>Address</label>
        <input type="text" name="address" v-model="userData.address">

        <label>Description</label>
        <input type="text" name="description" v-model="userData.description">

        <div class="user-form-buttons">
          <button class="user-form-save" v-if="!userData.id" @click="createUser">Save</button>
          <button class="user-form-save" v-if="userData.id" @click="updateUser">Save</button>
          <button class="user-form-cancel secondary-button" @click="clearForm">Cancel</button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import userCreateMutation from "@/graphql/UserCreateMutation";
import userUpdateMutation from "@/graphql/UserUpdateMutation";
import userDeleteMutation from "@/graphql/UserDeleteMutation";
import userSearchQuery from "@/graphql/UserSearchQuery";
import locationSearchQuery from "@/graphql/LocationSearchQuery";
import UserFormMap from "@/components/UserFormMap";

export default {
  name: "UserForm",
  components: { UserFormMap },
  props: {
    userData: {
      id: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      address: {
        type: String,
        required: false
      },
      description: {
        type: String,
        required: false
      },
      dob: {
        type: Date,
        required: false
      }
    },
    searchTerm: {
      type: String,
      required: true
    },
    nextToken: {
      type: String,
      required: false
    },
    limit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      coordinates: []
    };
  },
  apollo: {
    location: {
      query: locationSearchQuery,
      skip() {
        return !this.userData.address
      },
      variables() {
        return {
          locationInput: {
            location: this.userData.address
          }
        };
      },
      fetchPolicy: "cache-and-network",
      debounce: 1000,
      result({ data, loading, error }) {
        if (!loading && !error && data && data.location) {
          this.coordinates = data.location.coordinates;
        }
      },
      error(error) {
        console.error("We've got an error!", error);
      }
    }
  },
  methods: {
    createUser() {
      this.$apollo.mutate({
        mutation: userCreateMutation,
        variables: {
          user: {
            name: this.userData.name,
            dob: this.userData.dob ?? "1988-11-08",
            address: this.userData.address,
            description: this.userData.description
          }
        },
        update: (store, { data: { createUser } }) => {
          const data = store.readQuery({
            query: userSearchQuery,
            variables: {
              filter: {
                name: this.searchTerm
              },
              limit: this.limit,
              nextToken: null
            }
          });

          const index = data.users.users.findIndex(u => u.id == createUser.id);

          if(index >= 0) {
            data.users.users[index] = createUser;
          }
          else {
            data.users.users.push(createUser);
          }

          store.writeQuery({
            query: userSearchQuery,
            variables: {
              filter: {
                name: this.searchTerm
              },
              limit: this.limit,
              nextToken: null
            },
            data
          });
        }
      });

      this.$toast.open(`User ${this.userData.name} created`);
      this.clearForm();
    },
    updateUser() {
      this.$apollo.mutate({
        mutation: userUpdateMutation,
        variables: {
          id: this.userData.id,
          user: {
            name: this.userData.name,
            dob: this.userData.dob,
            address: this.userData.address,
            description: this.userData.description
          }
        }
      });

      this.$toast.open(`User ${this.userData.name} updated`);
      this.clearForm();
    },
    deleteUser() {
      this.$apollo.mutate({
        mutation: userDeleteMutation,
        variables: {
          id: this.userData.id
        },
        update: (store, { data: { deleteUser } }) => {
          const data = store.readQuery({
            query: userSearchQuery,
            variables: {
              filter: {
                name: this.searchTerm
              },
              limit: this.limit,
              nextToken: null
            }
          });

          data.users.users = data.users.users.filter(u => u.id != deleteUser.id)

          store.writeQuery({
            query: userSearchQuery,
            variables: {
              filter: {
                name: this.searchTerm
              },
              limit: this.limit,
              nextToken: null
            },
            data
          });
        }
      });

      this.$toast.open(`User ${this.userData.name} deleted`);
      this.clearForm();
    },
    clearForm() {
      this.$modal.hideAll();
    }
  }
};
</script>

<style scoped>
  .user-form-container {
    padding: 60px;
    background-color: #F8F8F8;
    height: 100%;
    display: flex;
  }

  .user-form-container h1 {
    margin-top: 0;
    position: absolute;
  }

  .user-form-data {
    width: 50%;
    height: 100%;
    margin-left:auto;
    margin-top: 120px;
  }

  .user-form-data label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .user-form-data input {
    width: 100%;
    border-radius: 10px;
    border: 2px solid #ECECEC;
    font-size: 21px;
    padding-left: 10px;
    height: 50px;
    margin-bottom: 25px;
  }

  .user-form-container button {
    width: 45%;
    height: 50px;
    margin: 0 0 10% 0;
  }

  .user-form-save {
    float: left;
  }

  .user-form-cancel {
    float: right;
  }

  .user-form-left {
    width: 50%;
    margin-top: 120px;
  }

  .user-form-map {
    width: 90%;
    height: 300px;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
  }


</style>