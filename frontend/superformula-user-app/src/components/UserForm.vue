<template>
  <div class="user-form-container">
    <form method="POST" @submit.prevent>
      <label>Name</label>
      <input type="text" name="name" v-model="userData.name">

      <label>Address</label>
      <input type="text" name="address" v-model="userData.address">

      <label>Description</label>
      <input type="text" name="description" v-model="userData.description">

      <button v-if="userData.id" @click="deleteUser">Remove</button>
      <button v-if="!userData.id" @click="createUser">Save</button>
      <button v-if="userData.id" @click="updateUser">Save</button>
      <button @click="clearForm">Cancel</button>
    </form>
  </div>
</template>

<script>
import userCreateMutation from "@/graphql/UserCreateMutation";
import userUpdateMutation from "@/graphql/UserUpdateMutation";
import userDeleteMutation from "@/graphql/UserDeleteMutation";
import userSearchQuery from "@/graphql/UserSearchQuery";
export default {
  name: "UserForm",
  components: { },
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
    }
  },
  data() {
    return {
      loaded: false
    };
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
              }
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
              }
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
              }
            }
          });

          data.users.users = data.users.users.filter(u => u.id != deleteUser.id)

          store.writeQuery({
            query: userSearchQuery,
            variables: {
              filter: {
                name: this.searchTerm
              }
            },
            data
          });
        }
      });

      this.$toast.open(`User ${this.userData.name} deleted`);
      this.clearForm();
    },
    clearForm() {
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
</style>