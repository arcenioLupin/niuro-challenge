import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; //IMPORTA ESTO

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],                 // AGREGA ESTO
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  me: any = null;
  loading = true;
  adminName: string | null = null;

  ngOnInit(): void {
    this.adminName = new URLSearchParams(window.location.search).get('adminName');
    this.http.get('http://localhost:5272/auth/me').subscribe({
      next: (u) => { this.me = u; this.loading = false; },
      error: () => {
        this.loading = false;
        window.location.href = 'http://localhost:3000/';
      }
    });
  }
  back(){ window.location.href = 'http://localhost:3000/'; }
}
