export class User {
  private _id: number;
  private _unique_id: string;
  private _name: string;
  private _pass: string;
  private _create_date: string;
  private _email: string;
  private _verified: string;
  private _socket_id: string;
  private _profile_pic: string;

  constructor(
    _id: number,
    _unique_id: string,
    _name: string,
    _pass: string,
    _create_date: string,
    _email: string,
    _verified: string,
    _socket_id: string,
    _profile_pic: string
  ) {
    this._id = _id;
    this._unique_id = _unique_id;
    this._name = _name;
    this._pass = _pass;
    this._create_date = _create_date;
    this._email = _email;
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

  // Getter i Setter dla _unique_id
  public get unique_id(): string {
    return this._unique_id;
  }

  public set unique_id(value: string) {
    this._unique_id = value;
  }

  // Getter i Setter dla _name
  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
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
