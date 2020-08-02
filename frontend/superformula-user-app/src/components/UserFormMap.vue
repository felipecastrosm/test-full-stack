<template>
  <MglMap v-if="coordinates.length == 2" :accessToken="accessToken" :mapStyle.sync="mapStyle" :center="coordinates" :zoom="zoom">
    <MglMarker :coordinates="coordinates" color="red" />
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker } from "vue-mapbox";

export default {
  name: "UserFormMap",
  components: {
    MglMap, MglMarker
  },
  props: {
    coordinates: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      accessToken: "pk.eyJ1IjoiZmVsaXBlY2FzdHJvc20iLCJhIjoiY2tkY3ExbjJ2MTM5NzM1dDFsNDFuYjl6ZyJ9.g08Eq2XOgURMWhs4lQNzew",//process.env.MAPBOX_ACCESS_TOKEN,
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      //coordinates: [-43.4487,-23.01312],//[-43.4487,-23.01312]
      zoom: 12.5
    };
  },

  created() {
    this.mapbox = Mapbox;
  }
};
</script>