import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.userService.handleGetUser(
      this.cookieService.getCookieValue('token')
    );
  }
}
