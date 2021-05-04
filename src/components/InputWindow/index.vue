<template>
  <textarea
    ref="input"
    class="input"
    placeholder="Type here..."
    cols="30"
    rows="7"
    maxlength="200"
    v-model="content"
    @keydown.enter="send"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "InputWindow",
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const { title } = toRefs(props);
    const content = ref("");
    const input = ref<HTMLInputElement | null>(null);
    //挂载后自动聚焦
    onMounted(() => {
      input.value!.focus();
    });
    //切换聊天对象，自动聚焦
    watch(title.value, () => {
      input.value!.focus();
    });
    //发送消息
    const send = (e: InputEvent) => {
      ctx.emit("sendMsg", content.value, title.value.index);
      e.preventDefault();
      // e.returnValue = false;
      content.value = "";
      return false;
    };
    return { content, input, send };
  },
});
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  height: 100%;
  padding: 10px 0 0 10px;
  border: none;
  font-size: 18px;
  outline: none;
  resize: none;
}
</style>
