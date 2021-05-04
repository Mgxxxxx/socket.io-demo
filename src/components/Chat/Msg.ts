import User from "./User";
class Msg {
  constructor(public user: User | null, public msg: string) {}
}

export default Msg;
