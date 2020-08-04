<script src="__tests__/user-card.spec.js"></script>
<template>
  <div class="user-card">
    <button class="pencil" @click="edit"></button>
    <div class="user-image">
      <img :src="user.imageUrl" />
    </div>
    <div class="user-info">
      <h2 class="user-name">{{ user.name }}</h2>
      <p>created <span>{{ formatDate(user.createdAt) }}</span></p>
    </div>

    <p class="user-description">{{ user.description }}</p>
  </div>
</template>

<script>
import { shortStringFormat } from "../utils/date";

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
    },
    formatDate(dateInput) { return shortStringFormat(dateInput); }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .user-card {
   background-color: #FFFFFF;
   width: 350px;
   height: 320px;
   position: relative;
   border-radius: 10px;
   margin: auto auto 60px;
 }

 .user-card:hover {
   box-shadow: 0px 8px 24px -10px rgba(0,0,0,0.75);
 }

 .user-card span {
   display: block;
 }

 .user-card:hover button {
   display: block;
 }

 .user-card:hover .user-info p {
   display: block;
   margin-bottom: 0;
 }

 .user-card button {
   position: absolute;
   top: 10px;
   right: 10px;
   display: none;
 }

 .user-image {
   display: inline-block;
   width: 170px;
   height: 170px;
   overflow: hidden;
   border-radius: 50%;
   margin-top: 25px;
 }

 .user-image img {
   height: 170px;
   margin-left: -25%;
 }

 .user-card:hover .user-name {
   width: 185px;
 }

 .user-name {
   font-size: 21px;
   text-align: left;
   margin-left: 20px;
   margin-bottom: 0;
   white-space: nowrap;
   height: 21px;
   width: 305px;
   overflow: hidden;
   text-overflow: ellipsis;
 }

 .user-description {
   font-family: 'Source Sans Pro', sans-serif;
   font-size: 16px;
   font-weight: 300;
   text-align: left;
   margin-left: 20px;
   margin-top: 5px;
   white-space: nowrap;
   height: 21px;
   width: 300px;
   overflow: hidden;
   text-overflow: ellipsis;
 }

 .user-info {
   height: 45px;
 }

 .user-info h2 {
   float:left;
   text-transform: uppercase;
 }

 .user-info p {
   float: right;
   margin-right: 20px;
   display: none;
 }

 .user-info p span {
   color: #AF1E1E;
   display: inline;
 }

 .pencil {
   background-image: url('../assets/pencil.png');
   background-size: 20px 20px;
   width: 20px;
   height: 20px;
   padding: 0;
   border: none;
   outline: none;
 }

 .pencil:hover {
   cursor: pointer;
   background-image: url('../assets/pencil-active.png');
 }
</style>
