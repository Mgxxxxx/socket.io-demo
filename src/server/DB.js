//创建用户
const usersDB = new Map();
usersDB.set("0", "default");
usersDB.set("1", "localhost");
usersDB.set("2", "2");
usersDB.set("3", "144");

//创建关系id
const relationDB = [];
const usersCount = usersDB.size;
for (let i = 0; i < usersCount; ++i) {
  relationDB.push(new Array(usersCount).fill(-1));
}
let allocId = 0;
for (let [id1] of usersDB) {
  // console.log(id1, user1);
  for (let [id2] of usersDB) {
    if (id1 !== id2) {
      const relationId = relationDB[parseInt(id2)][parseInt(id1)];
      if (relationId !== -1) {
        relationDB[parseInt(id1)][parseInt(id2)] = relationId;
      } else {
        relationDB[parseInt(id1)][parseInt(id2)] = allocId++;
      }
    }
  }
}

module.exports = {
  usersDB,
  relationDB,
};
