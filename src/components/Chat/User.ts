class User {
  constructor(
    public id: string,
    public name: string,
    public hasNewMsg: boolean,
    public status?: boolean
  ) {}
}

export default User;
