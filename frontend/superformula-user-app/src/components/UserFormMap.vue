<template>
  <div class="user-form-map-container">
    <MglMap v-if="coordinates.length == 2" :accessToken="accessToken" :mapStyle.sync="mapStyle" :center="coordinates" :zoom="zoom">
      <MglMarker :coordinates="coordinates" color="red" />
    </MglMap>
    <span v-if="!coordinatesLoading" class="user-form-map-empty">no map data for location</span>
    <img v-if="coordinatesLoading" class="user-form-map-loading" src="../assets/spinner.gif"/>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker } from "vue-mapbox";
import { mapboxAccessToken } from "../config";

export default {
  name: "UserFormMap",
  components: {
    MglMap, MglMarker
  },
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    coordinatesLoading: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      accessToken: mapboxAccessToken,
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      zoom: 12.5
    };
  },

  created() {
    this.mapbox = Mapbox;
  }
};
</script>

<style scoped>
 .user-form-map-container {
   width: 100%;
   height: 100%;
   text-align: center;
 }

 .user-form-map-empty {
   font-size: 30px;
   padding-top: 26%;
   display: block;
   width: 99%;
   height: 55%;
   border: 1px solid #999999;
   border-radius: 10px;
 }

 .user-form-map-loading {
   position: absolute;
   top: 145px;
   left: 135px;
 }
</style>