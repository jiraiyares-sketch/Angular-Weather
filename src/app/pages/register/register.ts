import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  register() {

    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    users.push({
      name: this.name,
      email: this.email,
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Conta criada com sucesso!');

    this.router.navigate(['/login']);
  }
}