import { Injectable } from '@angular/core';
import { BackendUrlService } from './backend-url.service';
import { User } from './classes/User';
import { CookieService } from './cookie.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private backendURLService: BackendUrlService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  user: User | null = null;

  TOKEN_EXPIRES_IN = 1;

  handleLogin = async (user: { username: string; password: string }) => {
    const findUserRequest = await fetch(
      `${this.backendURLService.backendURL}/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: user.username,
          password: user.password,
        }),
      }
    );

    if (!findUserRequest.ok) {
      const errorData = await findUserRequest.json();
      throw new Error(errorData.message);
    }

    const data = await findUserRequest.json();
    this.user = new User(
      data.user.id,
      data.user.unique_id,
      data.user.name,
      data.user.pass,
      data.user.create_date,
      data.user.email,
      data.user.verified,
      data.user.socket_id,
      data.user.profile_pic
    );

    const tokenExpiresIn = new Date();

    tokenExpiresIn.setHours(tokenExpiresIn.getHours() + this.TOKEN_EXPIRES_IN);

    document.cookie = `token=${data.token};path=/;expires=${tokenExpiresIn}`;

    this.router.navigate(['/']);
  };

  handleRegister = () => {};
}