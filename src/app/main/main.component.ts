import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from '../cookie.service';
import { SocketService } from '../socket.service';
import { User } from '../classes/User';
import { BackendUrlService } from '../backend-url.service';
import { Message } from '../classes/Message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private socketService: SocketService,
    private readonly backendUrlService: BackendUrlService
  ) {}

  public activeUsers: User[] = [];

  public userConversations: any = [];

  public userModal: boolean = false;

  public loadedConversation: number | null = null;

  public loadedMessages: Message[] = [];

  messageContent: string = '';

  sendMessage(event: Event): void {
    event.preventDefault();

    if (!this.messageContent) return;

    const uniqueId =
      this.userConversations[this.loadedConversation!]
        .conversationparticipants_conversation.ConversationParticipants[0]
        .conversationparticipants_user.unique_id;

    console.log(this.loadedConversation);

    const message = new Message(
      this.loadedConversation!,
      this.userService.user?.id || 0,
      new Date(),
      this.messageContent,
      'message',
      '',
      null
    );

    this.socketService.socket.emit('send-message', { uniqueId, message });
    this.loadedMessages.push(message);
    this.messageContent = '';
  }

  handleGroupClick() {}

  async handleLoadMessages(id: number) {
    this.loadedConversation = id;

    const findConversation = this.userConversations.find(
      (conv: any) => conv.conversationparticipants_conversation.id === id
    );

    try {
      const response = await fetch(
        `${this.backendUrlService.backendURL}/messages/get-messages/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      this.loadedMessages = data;

      console.log(this.loadedMessages);
    } catch (err) {
      console.error(err);
    }
  }

  handleRedirectToUserSettings() {
    this.router.navigate([`/user/${this.userService.user?.unique_id}`]);
  }

  async handleLogout() {
    this.socketService.socket.emit('inactive-user', this.userService.user);
    await this.userService.handleLogout();
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.userService.handleGetUser(
        this.cookieService.getCookieValue('token')
      );
    } catch (err) {
      console.error(err);

      if (this.userService.user) {
        this.userService.handleLogout();
      } else {
        this.router.navigate(['/login']);
      }
    }

    this.socketService.handleConnect();

    try {
      const userConversationsRequest = await fetch(
        `${this.backendUrlService.backendURL}/messages/get-conversations`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
        }
      );

      const userConversationsResponse = await userConversationsRequest.json();

      if (!userConversationsRequest.ok) {
        throw new Error(
          'Failed to fetch user conversations: ' +
            userConversationsResponse.message
        );
      }

      this.userConversations = userConversationsResponse;

      console.log(this.userConversations);
    } catch (err) {
      console.error(err);
    }

    try {
      const activeUsersRequest = await fetch(
        `${this.backendUrlService.backendURL}/user/active-users/${this.userService.user?.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
        }
      );

      const activeUsersResponse = await activeUsersRequest.json();

      if (!activeUsersRequest.ok) {
        throw new Error(
          'Failed to fetch active users: ' + activeUsersResponse.message
        );
      }

      this.activeUsers = activeUsersResponse;

      this.socketService.socket.on('receive-message', (message: any) => {
        console.log('receive-message', message);

        this.loadedMessages.push(message);
      });

      this.socketService.socket.on('inactive-user', (userPayload) => {
        console.log('inactive-user', userPayload);

        this.activeUsers = this.activeUsers.filter(
          (activeUser) => activeUser.id !== userPayload.id
        );
      });

      this.socketService.socket.on('active-user', (userPayload) => {
        console.log('active-user', userPayload);

        const user = new User(
          userPayload.id,
          userPayload.unique_id,
          userPayload.first_name,
          userPayload.last_name,
          userPayload.pass,
          new Date(userPayload.create_date),
          userPayload.user_desc,
          userPayload.email,
          userPayload.verified,
          userPayload.socket_id,
          userPayload.profile_pic,
          userPayload.is_active
        );

        const findActiveFriend = this.activeUsers.find(
          (activeUser) => activeUser.id === userPayload.id
        );

        if (!findActiveFriend) {
          this.activeUsers.push(user);
        }
      });
    } catch (err) {
      console.error('Error -> ' + err);
    }
  }
}
