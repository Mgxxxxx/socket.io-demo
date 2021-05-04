<template>
  <div>
    {{ title.name }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TopBar",
  props: ["title"],
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
div {
  margin-left: 10px;
  line-height: 38px;
}
</style>
