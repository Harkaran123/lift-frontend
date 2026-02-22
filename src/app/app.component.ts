import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar" *ngIf="isAuthenticated">
        <div class="nav-brand">
          <h1>Lift Maintenance System</h1>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/lifts" routerLinkActive="active">Lifts</a></li>
          <li><a routerLink="/lifts/new" routerLinkActive="active">Add Lift</a></li>
          <li><a routerLink="/alert-recipients" routerLinkActive="active">Alert Recipients</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
          <li><button class="logout-btn" (click)="logout()">Logout</button></li>
        </ul>
      </nav>
      <main class="main-content" [class.full-width]="!isAuthenticated">
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
      background-color: #6B6CD1;
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
      align-items: center;
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
    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    .logout-btn:hover {
      background-color: #c82333;
    }
    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .main-content.full-width {
      max-width: none;
      padding: 0;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lift-frontend';
  isAuthenticated: boolean = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
