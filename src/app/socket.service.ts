import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BackendUrlService } from './backend-url.service';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private readonly socketIoURL: string = 'http://localhost:3000';

  constructor(
    private readonly backendUrlService: BackendUrlService,
    private readonly cookieService: CookieService
  ) {}

  handleConnect() {
    this.socket = io(this.socketIoURL);

    this.socket.on('connect', async () => {
      const updateSocketIdRequest = await fetch(
        `${this.backendUrlService.backendURL}/user/update-socket-id/${this.socket.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
        }
      );

      const updateSocketIdResponse = await updateSocketIdRequest.json();

      if (!updateSocketIdRequest.ok) {
        console.error(
          `Failed to update socket ID: ${updateSocketIdResponse.message}`
        );

        return;
      }
    });
  }
}
