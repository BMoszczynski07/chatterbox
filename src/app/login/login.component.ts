import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  err: boolean = false;

  form = {
    username: '',
    password: '',
  };

  handleSubmitForm = (e: Event) => {
    e.preventDefault();

    if (this.form.username === '' || this.form.password === '') return;
    console.log('submit');
  };
}
