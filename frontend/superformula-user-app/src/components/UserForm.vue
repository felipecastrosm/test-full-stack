<template>
  <div class="user-form-container">
    <h1 v-if="tempUserData.id">Edit User</h1>
    <h1 v-if="!tempUserData.id">Create User</h1>
    <div class="user-form-left">
      <div class="user-form-map">
        <user-form-map :coordinates="coordinates" :coordinatesLoading="coordinatesLoading"></user-form-map>
      </div>
      <button class="secondary-button" v-if="tempUserData.id" @click="deleteUser">Remove <img class="loading-spinner" v-if="removeLoading" src="../assets/spinner.gif"/></button>
    </div>
    <div class="user-form-data">
      <form method="POST" @submit.prevent>
        <label>Name</label>
        <input :class="{'user-form-input-invalid': nameMissing && !tempUserData.name}" type="text" name="name" v-model="tempUserData.name">

        <label>Address</label>
        <input :class="{'user-form-input-invalid': addressMissing && !tempUserData.address}" type="text" name="address" v-model="tempUserData.address">

        <label>Description</label>
        <input :class="{'user-form-input-invalid': descriptionMissing && !tempUserData.description}" type="text" name="description" v-model="tempUserData.description">

        <div class="user-form-buttons">
          <button class="user-form-save" v-if="!tempUserData.id" @click="createUser">Save <img class="loading-spinner" v-if="saveLoading" src="../assets/spinner.gif"/></button>
          <button class="user-form-save" v-if="tempUserData.id" @click="updateUser">Save <img class="loading-spinner" v-if="saveLoading" src="../assets/spinner.gif"/></button>
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
import Unsplash from 'unsplash-js';
import { unsplashAccessKey } from "../config";

const unsplash = new Unsplash({ accessKey: unsplashAccessKey });

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
      coordinates: [],
      removeLoading: false,
      saveLoading: false,
      coordinatesLoading: true,
      tempUserData: {},
      nameMissing: false,
      addressMissing: false,
      descriptionMissing: false
    };
  },
  created() {
    this.tempUserData = {
      ...this.userData
    }

    this.coordinatesLoading = !!this.tempUserData.id;
  },
  apollo: {
    location: {
      query: locationSearchQuery,
      skip() {
        return !this.tempUserData.address
      },
      variables() {
        return {
          locationInput: {
            location: this.tempUserData.address
          }
        };
      },
      fetchPolicy: "cache-and-network",
      debounce: 1000,
      result({ data, loading, error }) {
        this.coordinatesLoading = loading;

        if (!loading && !error && data) {
          if(data.location) {
            this.coordinates = data.location.coordinates;
          }
          else {
            this.coordinates = [];
          }
        }
      },
      error(error) {
        console.error("We've got an error!", error);
      }
    }
  },
  methods: {
    validateForm() {
      let valid = true;

      if(!this.tempUserData.name) {
        this.nameMissing = true;
        valid = false;
      }

      if(!this.tempUserData.address) {
        this.addressMissing = true;
        valid = false;
      }

      if(!this.tempUserData.description) {
        this.descriptionMissing = true;
        valid = false;
      }

      return valid;
    },
    async createUser() {
      if(!this.validateForm()) {
        return;
      }

      this.saveLoading = true;

      const imageUrl = (await (await unsplash.photos.getRandomPhoto({ collections: ["8470962", "4389261", "4963498"], orientation: "landscape" })).json()).urls.small

      await this.$apollo.mutate({
        mutation: userCreateMutation,
        variables: {
          user: {
            name: this.tempUserData.name,
            dob: this.tempUserData.dob,
            address: this.tempUserData.address,
            description: this.tempUserData.description,
            imageUrl: imageUrl
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

      this.saveLoading = false;
      this.$toast.open({ message: `User ${this.tempUserData.name} created`, position: "top"});
      this.clearForm();
    },
    updateUser() {
      if(!this.validateForm()) {
        return;
      }

      this.saveLoading = true;

      this.$apollo.mutate({
        mutation: userUpdateMutation,
        variables: {
          id: this.tempUserData.id,
          user: {
            name: this.tempUserData.name,
            dob: this.tempUserData.dob,
            address: this.tempUserData.address,
            description: this.tempUserData.description
          }
        }
      }).then(() => {
        this.saveLoading = false;
        this.$toast.open({ message: `User ${this.tempUserData.name} updated`, position: "top"});
        this.clearForm();
      });
    },
    deleteUser() {
      this.removeLoading = true;

      this.$apollo.mutate({
        mutation: userDeleteMutation,
        variables: {
          id: this.tempUserData.id
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
      }).then(() => {
        this.removeLoading = false;
        this.$toast.open({ message: `User ${this.tempUserData.name} deleted`, position: "top"});
        this.clearForm();
      });
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

  .user-form-data input.user-form-input-invalid {
    border-color: red;
  }
</style>