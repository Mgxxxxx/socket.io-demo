<template>
  <Chat />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chat from "./components/Chat/index.vue";

export default defineComponent({
  name: "App",
  components: {
    Chat,
  },
});
</script>

<style>
</style>
