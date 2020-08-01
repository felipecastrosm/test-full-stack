<template>
  <div id="app">
    <users-container></users-container>
  </div>
</template>

<script>
import UsersContainer from "@/components/UsersContainer";

export default {
  name: 'App',
  components: {
    UsersContainer
  },
  data() {
    return {
      messages: []
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;600&display=swap');

body {
  background-color: #F8F8F8;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  max-width: 1350px;
}

h1, h2, p {
  font-family: 'Source Sans Pro', sans-serif;
}

h1 {
  font-size: 48px;
  font-weight: 300;
}

h2 {
  font-size: 21px;
  font-weight: 600;
}

p {
  font-size: 16px;
  font-weight: 300;
}
</style>
