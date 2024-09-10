import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { CookieService } from '../cookie.service';

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
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.userService.handleGetUser(this.cookieService.getCookieValue('token'));
  }
}
