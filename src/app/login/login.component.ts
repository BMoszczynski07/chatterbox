import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    public userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  form = {
    username: '',
    password: '',
  };

  err = {
    display: false,
    message: '',
  };

  async ngOnInit(): Promise<void> {
    try {
      await this.userService.handleGetUser(
        this.cookieService.getCookieValue('token')
      );
      this.router.navigate(['/']);
    } catch (err) {
      console.log(err);
    }
  }

  handleSubmitForm = async (e: Event) => {
    e.preventDefault();

    if (this.form.username === '' || this.form.password === '') return;

    try {
      await this.userService.handleLogin(this.form);
    } catch (err: any) {
      this.err.display = true;
      this.err.message = err.message;
    }
  };
}
