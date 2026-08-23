import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { FakeStoreUser } from '../../../core/models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  readonly demoUsers = signal<FakeStoreUser[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  username = 'johnd';
  password = 'm38rmF$';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usersService.getDemoUsers().subscribe({
      next: (users) => this.demoUsers.set(users),
      error: () => this.demoUsers.set([]),
    });
  }

  onSelectDemoUser(user: FakeStoreUser): void {
    this.username = user.username;
    this.password = user.password;
  }

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/catalog']);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Usuario o contraseña incorrectos.');
        },
      });
  }
}