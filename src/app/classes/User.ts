export class User {
  private _id: number;
  private _unique_id: string;
  private _first_name: string;
  private _last_name: string;
  private _pass: string;
  private _create_date: string;
  private _user_desc: string;
  private _email: string;
  private _verified: string;
  private _socket_id: string;
  private _profile_pic: string;

  constructor(
    _id: number,
    _unique_id: string,
    _first_name: string,
    _last_name: string,
    _pass: string,
    _create_date: string,
    _user_desc: string,
    _email: string,
    _verified: string,
    _socket_id: string,
    _profile_pic: string
  ) {
    this._id = _id;
    this._unique_id = _unique_id;
    this._first_name = _first_name;
    this._last_name = _last_name;
    this._pass = _pass;
    this._create_date = _create_date;
    this._email = _email;
    this._user_desc = _user_desc;
    this._verified = _verified;
    this._socket_id = _socket_id;
    this._profile_pic = _profile_pic;
  }

  // Getter i Setter dla _id
  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  // Getter i Setter dla _user_desc
  public get user_desc(): string {
    return this._user_desc;
  }

  public set user_desc(value: string) {
    this._user_desc = value;
  }

  // Getter i Setter dla _unique_id
  public get unique_id(): string {
    return this._unique_id;
  }

  public set unique_id(value: string) {
    this._unique_id = value;
  }

  // Getter i Setter dla _first_name
  public get first_name(): string {
    return this._first_name;
  }

  public set first_name(value: string) {
    this._first_name = value;
  }

  // Getter i Setter dla _last_name
  public get last_name(): string {
    return this._last_name;
  }

  public set last_name(value: string) {
    this._last_name = value;
  }

  // Getter i Setter dla _pass
  public get pass(): string {
    return this._pass;
  }

  public set pass(value: string) {
    this._pass = value;
  }

  // Getter i Setter dla _create_date
  public get create_date(): string {
    return this._create_date;
  }

  public set create_date(value: string) {
    this._create_date = value;
  }

  // Getter i Setter dla _email
  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  // Getter i Setter dla _verified
  public get verified(): string {
    return this._verified;
  }

  public set verified(value: string) {
    this._verified = value;
  }

  // Getter i Setter dla _socket_id
  public get socket_id(): string {
    return this._socket_id;
  }

  public set socket_id(value: string) {
    this._socket_id = value;
  }

  // Getter i Setter dla _profile_pic
  public get profile_pic(): string {
    return this._profile_pic;
  }

  public set profile_pic(value: string) {
    this._profile_pic = value;
  }
}
