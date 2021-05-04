const app = require("http").createServer(function (req, res) {
  res.end("Hello World!");
});
//设置cors属性是为了能让所有人能够访问
const io = require("socket.io")(app, { cors: true });
app.listen(15656);

const { usersDB, relationDB } = require("./DB");

class User {
  constructor(id, name, status = true) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}
class Msg {
  constructor(user, msg) {
    this.user = user;
    this.msg = msg;
  }
}

io.on("connection", function (socket) {
  //记录当前登录的用户
  const user = new User(socket.userID, usersDB.get(socket.userID));

  //分配当前用户与其他用户的私聊房间id，房间id为关系id
  const userRelation = relationDB[parseInt(user.id)];
  for (let i = 1; i < userRelation.length; ++i) {
    if (i != user.id) {
      socket.join(userRelation[i] + "");
    }
  }

  //某用户连接后向其发送所有用户列表，并确认用户是否在线
  const users = [];
  for ([key, value] of usersDB.entries()) {
    //若为默认和自己则跳过
    if (key === "0" || key === socket.userID) continue;
    let status = false;
    //查看当前用户是否连接了socket
    for (let s of io.of("/").sockets) {
      const id = s[1].userID;
      if (id === key) status = true;
    }
    users.push(new User(key, value, status));
  }
  socket.emit("users", users);

  //某个用户连接成功，向其他人发送该用户的信息
  socket.broadcast.emit("user connected", user);

  //用户发送群聊消息时的操作
  socket.on("message", function (data) {
    // console.log(data, "message");
    socket.broadcast.emit("message", new Msg(user, data));
  });

  //用户发送私聊消息时的操作
  socket.on("private msg", function (msg, to) {
    // console.log(msg, to, "private msg");
    const relationId = userRelation[parseInt(to)];
    socket.to(relationId + "").emit("private msg", new Msg(user, msg));
  });

  //用户断开连接操作
  socket.on("disconnect", () => {
    // console.log(user.name + " leave.");
    socket.broadcast.emit("user disconnected", user);
  });
});

//用户第一次连接的操作
io.use((socket, next) => {
  const userName = socket.handshake.auth.name;
  const userID = socket.handshake.auth.id;
  if (!userName || !userID) {
    return next(new Error("invalid username or invalid userid"));
  }
  socket.userID = userID;
  next();
});
