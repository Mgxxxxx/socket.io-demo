<template>
  <ul>
    <li
      v-for="(user, i) in chatList"
      :key="i"
      :class="{ selected: selected === i }"
      @click="changeSelected(i)"
    >
      <div class="userName">{{ user.name }}</div>
      <div class="userStatus" :class="{ offline: !user.status }">
        {{ user.status ? "online" : "offline" }}
      </div>
      <div :class="{ newMsg: hasNewMsg(user) }"></div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";
export default defineComponent({
  name: "ChatList",
  props: {
    chatList: {
      type: Array,
      required: true,
    },
    newMsgMap: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const { chatList, newMsgMap } = toRefs(props);
    const selected = ref(0); //被选中的索引
    //选项改变时需向父级发送修改标题消息
    const changeSelected = (i: number) => {
      selected.value = i;
      let title: string;
      title = (chatList.value[i] as any).name;
      (chatList.value[i] as any).hasNewMsg = false;
      ctx.emit("changeTitle", title, (chatList.value[i] as any).id);
    };
    //判断是否有新消息，并且处理当前选中的就算有消息，也不会显示小红点
    const hasNewMsg = (user: { hasNewMsg: boolean; id: string }) => {
      (chatList.value[selected.value] as any).hasNewMsg = false;
      return (
        user.hasNewMsg && (chatList.value[selected.value] as any).id !== user.id
      );
    };

    return {
      chatList,
      selected,
      hasNewMsg,
      newMsgMap,
      changeSelected,
    };
  },
});
</script>

<style scoped lang="scss">
ul {
  li {
    height: 50px;
    padding: 5px 10px;
    @include flex-box(column, center, flex-start);
    position: relative;
    cursor: pointer;
    .newMsg {
      content: "";
      width: 10px;
      height: 10px;
      position: absolute;
      top: calc(50% - 5px);
      right: 10%;
      border-radius: 50%;
      background-color: red;
    }
    .userStatus {
      color: lightgreen;
      font-size: 14px;
    }
    .offline {
      color: lightcoral;
    }
  }
  .selected {
    background-color: #c4c8ca;
  }
}
</style>
