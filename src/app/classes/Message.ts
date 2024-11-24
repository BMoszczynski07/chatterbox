export class Message {
  constructor(
    public id: number,
    public conversation_id: number,
    public user_id: number,
    public message_date: Date,
    public content: string,
    public type: 'message' | 'image' | 'audio',
    public img_src: string,
    public responseTo: string
  ) {}
}
