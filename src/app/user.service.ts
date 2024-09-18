import { Injectable } from '@angular/core';
import { BackendUrlService } from './backend-url.service';
import { User } from './classes/User';
import { Router } from '@angular/router';
import { Notification } from '../notification/Notification';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private backendURLService: BackendUrlService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  user: User | null = null;

  TOKEN_EXPIRES_IN = 1;

  handleUnprotectedGetUser = async (unique_id: string) => {
    try {
      const userRequest = await fetch(
        `${this.backendURLService.backendURL}/user/get-unprotected/${unique_id}`
      );

      if (!userRequest.ok) {
        const errorData = await userRequest.json();
        throw { message: errorData.message };
      }

      const data = await userRequest.json();

      return data;
    } catch (err: any) {
      const errNotification = new Notification(err.message);
      errNotification.handleCreate();

      this.router.navigate(['/']);
    }
  };

  handleGetUser = async (token: string | null) => {
    const userRequest = await fetch(
      `${this.backendURLService.backendURL}/user/get`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userRequest.ok) {
      if (userRequest.status === 401) {
        // show notification when the token is invalid

        const notification = new Notification(
          'Your session has expired. Please sign in again.'
        );
        notification.handleCreate();
      }

      const errorData = await userRequest.json();
      throw new Error(errorData);
    }

    const data = await userRequest.json();

    this.user = new User(
      data.id,
      data.unique_id,
      data.first_name,
      data.last_name,
      data.pass,
      data.create_date,
      data.user_desc,
      data.email,
      data.verified,
      data.socket_id,
      data.profile_pic,
      data.is_active
    );
  };

  async handleLogout() {
    try {
      const unsetActiveRequest = await fetch(
        `${this.backendURLService.backendURL}/user/unset-active`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
        }
      );

      if (!unsetActiveRequest.ok) {
        const unsetActiveResponse = await unsetActiveRequest.json();

        throw new Error(unsetActiveResponse);
      }
    } catch (err: any) {
      console.error('Error -> ' + err);
    }

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    this.router.navigate(['/login']);

    this.user = null;

    const logoutNotification = new Notification('You logged out successfully');
    logoutNotification.handleCreate();
  }

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
      data.user.first_name,
      data.user.last_name,
      data.user.pass,
      data.user.create_date,
      data.user.email,
      data.user.user_desc,
      data.user.verified,
      data.user.socket_id,
      data.user.profile_pic,
      data.user.is_active
    );

    const tokenExpiresIn = new Date();

    tokenExpiresIn.setHours(tokenExpiresIn.getHours() + this.TOKEN_EXPIRES_IN);

    document.cookie = `token=${data.token};path=/;expires=${tokenExpiresIn}`;

    this.router.navigate(['/']);

    const loginNotification = new Notification('Singed in successfully');
    loginNotification.handleCreate();
  };

  handleRegister = () => {};
}
