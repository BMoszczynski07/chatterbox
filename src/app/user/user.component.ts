import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from '../cookie.service';
import { Notification } from '../../notification/Notification';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  unique_id: string | null = null;

  async ngOnInit(): Promise<void> {
    this.unique_id = this.route.snapshot.paramMap.get('unique_id');

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
