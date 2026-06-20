import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {

    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const user = users.find(
      (u: any) =>
        u.email === this.email &&
        u.password === this.password
    );

    if(user){

      localStorage.setItem(
        'loggedUser',
        JSON.stringify(user)
      );

      this.router.navigate(['/home']);

    } else {

      alert('Email ou senha inválidos');

    }
  }
}