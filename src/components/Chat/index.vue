<template>
  <div class="chat-container">
    <header>
      <top-bar :title="title" />
    </header>
    <main class="chat-content">
      <nav>
        <chat-list
          :newMsgMap="newMsgMap"
          :chatList="chatList"
          @changeTitle="changeTitle"
        />
      </nav>
      <main class="chat-window">
        <div class="msg-window">
          <msg-window :allMsg="allMsg.get(title.index)" />
        </div>
        <div class="input-window">
          <input-window @sendMsg="sendMsg" :title="title" />
        </div>
      </main>
    </main>
  </div>
  <button @click="connect" style="position: fixed; top: 10px; right: 60px">
    connect
  </button>
  <button @click="close" style="position: fixed; top: 10px; right: 10px">
    close
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TopBar from "../TopBar/index.vue";
import ChatList from "../ChatList/index.vue";
import MsgWindow from "../MsgWindow/index.vue";
import InputWindow from "../InputWindow/index.vue";
import Msg from "./Msg";
import Connect from "./Connect";
export default defineComponent({
  name: "Chat",
  components: {
    TopBar,
    MsgWindow,
    InputWindow,
    ChatList,
  },
  setup() {
    const c = new Connect("http://localhost:15656");
    const allMsg = c.allMsg;
    const newMsgMap = ref(new Map()); //是否有新消息
    const chatList = c.userList; //侧边所有选项
    const title = ref({ index: "0", name: "Room" }); //topbar的标题

    //发送消息的事件
    const sendMsg = (content: string, index: string) => {
      if (index !== "0") {
        c.sendPrivate(content, index);
      } else {
        c.send(content);
      }
      allMsg.value.get(index)?.push(new Msg(c.user, content));
    };
    //监听侧边选中项改变
    const changeTitle = (newTitle: string, index: string) => {
      title.value.index = index;
      title.value.name = newTitle;
    };

    //自动聚焦输入框

    const close = () => c.close();
    const connect = () => c.connect();
    return {
      allMsg,
      newMsgMap,
      chatList,
      title,
      sendMsg,
      changeTitle,
      close,
      connect,
    };
  },
});
</script>

<style scoped lang="scss">
// @import "@/index.scss";
$topBarColor: #d6dcdf;
$navBarColor: #eaeaeb;
$topBarHeight: 38px;

.chat-container {
  width: 100vw;
  height: 100vh;
  header {
    width: 100%;
    height: $topBarHeight;
    background-color: $topBarColor;
  }
  .chat-content {
    width: 100%;
    height: calc(100vh - #{$topBarHeight});
    @include flex-box;
    nav {
      flex-basis: 20%;
      height: 100%;
      background-color: $navBarColor;
    }
    .chat-window {
      flex: 1;
      .msg-window {
        height: 75%;
        border-bottom: 1px solid #aeaeae;
      }
      .input-window {
        height: 25%;
      }
    }
  }
}
</style>
