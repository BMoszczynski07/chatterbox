import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendUrlService {
  constructor() {}

  backendURL: string = 'http://localhost:8080/api/v1.0.0';
}
