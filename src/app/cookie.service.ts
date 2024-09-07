import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor() {}

  getCookieValue = (name: string) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === decodeURIComponent(name)) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  };
}
