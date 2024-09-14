export class User {
  constructor(
    public id: number,
    public unique_id: string,
    public first_name: string,
    public last_name: string,
    public pass: string,
    public create_date: Date,
    public user_desc: string,
    public email: string,
    public verified: boolean,
    public socket_id: string,
    public profile_pic: string
  ) {}
}
