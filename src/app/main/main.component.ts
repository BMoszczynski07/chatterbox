import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from '../cookie.service';
import { SocketService } from '../socket.service';
import { User } from '../classes/User';
import { BackendUrlService } from '../backend-url.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
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

  async ngOnInit(): Promise<void> {
    try {
      await this.userService.handleGetUser(
        this.cookieService.getCookieValue('token')
      );
    } catch (err) {
      console.error(err);

      this.router.navigate(['/login']);
      this.userService.user = null;
    }

    this.socketService.handleConnect();

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
    } catch (err) {
      console.error('Error -> ' + err);
    }
  }
}
