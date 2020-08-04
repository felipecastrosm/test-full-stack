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
  padding: 150px 60px;
}

#app {
  font-family: 'Source Sans Pro', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #404040;
  margin: auto;
  max-width: 1350px;
}

h1, h2, p, label, input, button {
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
  color: #404040;
}

input {
  color: black;
  outline: none;
}

button .loading-spinner {
  height: 50px;
  position: absolute;
  right: 0;
  top: 0;
}

button {
  font-size: 17px;
  font-weight: 600;
  text-transform: uppercase;
  color: #2c3e50;
  background: #FFFFFF;
  border-radius: 5px;
  border: 2px solid #E6E6E6;
  outline: none;
  position: relative;
}

button:hover {
  border: 2px solid #999999;
  cursor: pointer;
}

button:focus {
  border: 2px solid #808080;
}

button:disabled {
  border: 2px solid #E6E6E6;
}

.secondary-button {
  background: #F8F8F8;
  border-color: #E0E0E0;
}

.secondary-button:hover {
  border-color: #959595;
}

.secondary-button:focus {
  border-color: #7C7C7C;
}

.secondary-button:disabled {
  border-color: #E0E0E0;
}
</style>
