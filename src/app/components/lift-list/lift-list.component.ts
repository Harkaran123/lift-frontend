import { Component, OnInit } from '@angular/core';
import { LiftService } from '../../services/lift.service';
import { Lift } from '../../models/lift.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lift-list',
  template: `
    <div class="lift-list-container">
      <h2>All Lifts</h2>
      <button class="btn btn-primary" (click)="createNewLift()">+ Add New Lift</button>
      
      <div *ngIf="lifts.length === 0" class="empty-state">
        <p>No lifts found. Click "Add New Lift" to create one.</p>
      </div>
      
      <div class="lift-grid" *ngIf="lifts.length > 0">
        <div class="lift-card" *ngFor="let lift of lifts">
          <div class="lift-header">
            <h3>{{ lift.name }}</h3>
            <span class="badge">{{ lift.area }}</span>
          </div>
          <div class="lift-body">
            <p><strong>Building:</strong> {{ lift.building }}</p>
            <p><strong>Client:</strong> {{ lift.clientName }}</p>
            <p><strong>Phone:</strong> {{ lift.clientPhone }}</p>
            <p *ngIf="lift.clientEmail"><strong>Email:</strong> {{ lift.clientEmail }}</p>
            <p><strong>Installation:</strong> {{ lift.installationDate | date }}</p>
            <p><strong>Next Maintenance:</strong> {{ lift.nextMaintenanceDate ? (lift.nextMaintenanceDate | date) : 'Not set' }}</p>
            <p><strong>Interval:</strong> {{ lift.maintenanceInterval }} months</p>
          </div>
          <div class="lift-actions">
            <button class="btn btn-view" (click)="viewLift(lift.id!)">View</button>
            <button class="btn btn-edit" (click)="editLift(lift.id!)">Edit</button>
            <button class="btn btn-delete" (click)="deleteLift(lift.id!)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lift-list-container {
      padding: 1rem;
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .btn-primary {
      background-color: #1976d2;
      color: white;
      margin-bottom: 1.5rem;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
      background: white;
      border-radius: 8px;
    }
    .lift-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .lift-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .lift-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .lift-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e0e0e0;
    }
    .lift-header h3 {
      margin: 0;
      color: #1976d2;
    }
    .badge {
      background-color: #4caf50;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    .lift-body p {
      margin: 0.5rem 0;
      color: #555;
    }
    .lift-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .btn-view {
      background-color: #2196f3;
      color: white;
    }
    .btn-edit {
      background-color: #ff9800;
      color: white;
    }
    .btn-delete {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class LiftListComponent implements OnInit {
  lifts: Lift[] = [];

  constructor(
    private liftService: LiftService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLifts();
  }

  loadLifts(): void {
    this.liftService.getAllLifts().subscribe({
      next: (data) => this.lifts = data,
      error: (err) => console.error('Error loading lifts:', err)
    });
  }

  createNewLift(): void {
    this.router.navigate(['/lifts/new']);
  }

  viewLift(id: number): void {
    this.router.navigate(['/lifts', id]);
  }

  editLift(id: number): void {
    this.router.navigate(['/lifts', id, 'edit']);
  }

  deleteLift(id: number): void {
    if (confirm('Are you sure you want to delete this lift?')) {
      this.liftService.deleteLift(id).subscribe({
        next: () => this.loadLifts(),
        error: (err) => console.error('Error deleting lift:', err)
      });
    }
  }
}
