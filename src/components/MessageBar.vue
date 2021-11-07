<template>
  <div id="box" :style="{ background: backgroundColor }">
    <span
      ><img :src="require(`@/assets/${icon}`)" alt="Icen" /> {{ message }}
    </span>
  </div>
</template>
<script>
export default {
  props: { message: String, type: String },
  data() {
    return {
    };
  },
  computed: {
    backgroundColor() {
      switch (this.type) {
        case "info":
          return "blue";
        case "success":
          return "green";
        case "warning":
          return "yellow";
        case "error":
          return "red";
        default:
          return "blue";
      }
    },
    icon() {
      switch (this.type) {
        case "info":
          return "icen_message.svg";
        case "success":
          return "icen_success.svg";
        case "warning":
          return "icen_message.svg";
        case "error":
          return "icen_errer.svg";
        default:
          return "icen_message.svg";
      }
    }
  }

};
</script>
<style scoped>
#box {
  margin: .5em;  
  padding: 0.5em 1.5em;
  border-radius: 0.5em;
}

img {
  height: 1em;
  margin-right: 0.7em;
}

</style>

