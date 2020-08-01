<template>
  <div class="user-card">
    <button id="edit-user" @click="edit">Edit</button>
    <div class="user-image">
      <img src="https://images.unsplash.com/photo-1537815749002-de6a533c64db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=220&q=80" />
    </div>
    <h2 class="user-name">{{ user.name }}</h2>
    <p class="user-description">{{ user.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      name: String,
      description: String
    }
  },
  methods: {
    edit() {
      this.$emit("edit");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .user-card {
   background-color: #FFFFFF;
   width: 350px;
   height: 350px;
   float: left;
   border-radius: 10px;
   margin-left: 50px;
   margin-bottom: 50px;
 }

 .user-card:hover {
   box-shadow: 0px 8px 24px -10px rgba(0,0,0,0.75);
 }

 .user-card span {
   display: block;
 }

 .user-image {
   display: inline-block;
   position: relative;
   width: 200px;
   height: 200px;
   overflow: hidden;
   border-radius: 50%;
 }

 .user-name {
   font-size: 21px;
 }

 .user-description {
   font-family: 'Source Sans Pro', sans-serif;
   font-size: 16px;
   font-weight: 300;
 }
</style>
