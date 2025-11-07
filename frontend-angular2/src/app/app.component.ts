import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private http = inject(HttpClient);

  email = 'admin@demo.com';
  password = 'admin123';
  logged = false;

  login(e: Event) {
    e.preventDefault();
    this.http.post('http://localhost:5272/auth/login/admin',
      { email: this.email, password: this.password }
    ).subscribe({
      next: () => this.logged = true,
      error: () => alert('Invalid admin credentials')
    });
  }

  openUser(adminName: string) {
    window.location.href = `http://localhost:4200/?adminName=${encodeURIComponent(adminName)}`;
  }
}
