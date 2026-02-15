import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>Lift Maintenance System</h1>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/lifts" routerLinkActive="active">Lifts</a></li>
          <li><a routerLink="/lifts/new" routerLinkActive="active">Add Lift</a></li>
          <li><a routerLink="/alert-recipients" routerLinkActive="active">Alert Recipients</a></li>
        </ul>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .navbar {
      background-color: #1976d2;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-links a:hover,
    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
    }
    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'lift-frontend';
}
