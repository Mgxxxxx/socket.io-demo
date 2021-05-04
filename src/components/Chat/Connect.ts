import { ref } from "vue";
import { Ref } from "@vue/reactivity";
import io, { Socket } from "socket.io-client";
import Msg from "./Msg";
import User from "./User";

class Connect {
  private client: Socket; //关键的套接字
  public user: User; //用户信息
  public userList: Ref<User[]>; //和当前用户相关联的用户或聊天室
  public allMsg: Ref<Map<string, Msg[]>>; //消息列表
  //初始化类所需的属性
  constructor(private url: string) {
    this.user = new User(
      localStorage.getItem("id") || "0",
      localStorage.getItem("user") || "default",
      false
    );
    this.allMsg = ref(new Map());
    this.allMsg.value.set("0", []);
    this.userList = ref([]);
    //创建套接字
    this.client = io(url, { autoConnect: false });
    //设置首次连接传送的数据
    this.client.auth = { name: this.user.name, id: this.user.id };
    this.connect();
  }
  //发送公共消息
  send(msg: string) {
    try {
      this.client.emit("message", msg);
    } catch (err) {
      console.warn(err);
    }
  }
  //发送私有消息
  sendPrivate(msg: string, to: string) {
    this.client.emit("private msg", msg, to);
  }
  //从聊天室里接受消息
  receiveRoom() {
    try {
      this.client.on("message", (data: Msg) => {
        this.allMsg.value.get("0")!.push(data);
        //找到发消息的用户，设置新消息提示
        const user = this.userList.value.find((u) => u.id === "0");
        user!.hasNewMsg = true;
      });
    } catch (err) {
      console.warn(err);
    }
  }
  //接受私有消息
  receivePrivate() {
    try {
      this.client.on("private msg", (data: Msg) => {
        this.allMsg.value
          .get(data.user!.id)
          ?.push(new Msg(data.user, data.msg));
        //找到发消息的用户，设置新消息提示
        const user = this.userList.value.find((u) => u.id === data.user!.id);
        user!.hasNewMsg = true;
      });
    } catch (err) {
      console.warn(err);
    }
  }
  //获取用户的朋友和聊天室
  getUsers() {
    this.client.on("users", (users: User[]) => {
      users.forEach((user) => {
        this.allMsg.value.set(user.id, []);
        this.userList.value.push(user);
      });
    });
  }
  //监听是否有其他用户上线
  listenUserConn() {
    this.client.on("user connected", (user: User) => {
      //有用户上线则推送消息，并设置用户状态为在线
      this.allMsg.value
        .get("0")!
        .push({ user: null, msg: user.name + " join." });
      const t = this.userList.value.find((u) => u.id === user.id);
      if (t) {
        t.status = true;
      }
    });
  }
  //监听其他用户断开连接
  listenUserDisconn() {
    this.client.on("user disconnected", (user: User) => {
      //有用户上线则推送消息，并设置用户状态为离线
      this.allMsg.value
        .get("0")!
        .push({ user: null, msg: user.name + " left." });
      const i = this.userList.value.findIndex((u) => u.id === user.id);

      if (i !== -1) {
        this.userList.value[i].status = false;
      }
    });
  }
  //监听用户的状态
  listenStatus() {
    this.client.on("connect", () => {
      this.user.status = this.client.connected;
      this.userList.value.forEach((user) => {
        if (user.id === this.user.id) {
          user.status = true;
        }
      });
    });
    this.client.on("disconnect", () => {
      this.user.status = this.client.connected;
    });
  }
  //断开连接
  close() {
    this.userList.value.length = 0;
    this.allMsg.value.clear();
    this.client.close();
  }
  //连接
  connect() {
    this.userList.value.push(new User("0", "Room", false, true));
    this.client.connect();
    this.receiveRoom();
    this.receivePrivate();
    this.getUsers();
    this.listenUserConn();
    this.listenUserDisconn();
    this.listenStatus();
    //监听连接失败的事件
    this.client.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.user.status = false;
      }
    });
  }
}

export default Connect;
