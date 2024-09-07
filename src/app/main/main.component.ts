import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(public userService: UserService) {}
}
