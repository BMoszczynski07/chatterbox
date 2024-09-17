import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from '../cookie.service';
import { SocketService } from '../socket.service';

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
    private socketService: SocketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.socketService.handleConnect();

    try {
      await this.userService.handleGetUser(
        this.cookieService.getCookieValue('token')
      );
    } catch (err) {
      console.error(err);

      this.router.navigate(['/login']);
      this.userService.user = null;
    }
  }
}
