<template>
  <ul ref="latestMsg">
    <li
      v-for="(msg, index) in allMsg"
      :key="index"
      :class="{ join: !msg.user }"
    >
      <span v-if="msg.user">{{ msg.user.name }}: </span>
      <span>{{ msg.msg }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, onMounted, watch, nextTick } from "vue";
export default defineComponent({
  name: "MsgWindow",
  props: {
    allMsg: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    let { allMsg } = toRefs(props);

    //获取消息列表中最新的一条消息
    const latestMsg = ref<HTMLElement | null>(null);
    //挂载后最新的一条消息自动滚动到可视区底部
    onMounted(() => {
      if (latestMsg.value?.childElementCount) {
        latestMsg.value.lastElementChild!.scrollIntoView(false);
      }
    });
    //监听是否有最新的消息，有则将其滚动到可视区底部
    watch(allMsg, () => {
      nextTick(() => {
        if (latestMsg.value?.childElementCount) {
          latestMsg.value.lastElementChild!.scrollIntoView(false);
        }
      });
    });
    return { allMsg, latestMsg };
  },
});
</script>

<style scoped lang="scss">
ul {
  height: 100%;
  padding: 10px;
  padding-bottom: 0;
  overflow-y: scroll;
  scroll-behavior: smooth;
  li {
    width: 80%;
    padding-bottom: 5px;
    &:last-child {
      padding-bottom: 10px;
    }
  }
  .join {
    color: hotpink;
    text-align: center;
    span {
      margin-left: 20%;
    }
  }
}
</style>
