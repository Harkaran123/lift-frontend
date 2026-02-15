import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LiftService } from '../../services/lift.service';
import { ReminderService } from '../../services/reminder.service';
import { Lift, ReminderSetting } from '../../models/lift.model';

@Component({
  selector: 'app-lift-detail',
  template: `
    <div class="lift-detail-container" *ngIf="lift">
      <div class="header-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back to List</button>
        <div class="header-actions-right">
          <button class="btn btn-edit" (click)="editLift()">Edit Lift</button>
          <button class="btn btn-delete" (click)="deleteLift()">Delete Lift</button>
        </div>
      </div>
      
      <div class="lift-info">
        <h2>{{ lift.name }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Area:</span>
            <span class="value">{{ lift.area }}</span>
          </div>
          <div class="info-item">
            <span class="label">Building:</span>
            <span class="value">{{ lift.building }}</span>
          </div>
          <div class="info-item">
            <span class="label">Client:</span>
            <span class="value">{{ lift.clientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">{{ lift.clientPhone }}</span>
          </div>
          <div class="info-item" *ngIf="lift.clientEmail">
            <span class="label">Email:</span>
            <span class="value">{{ lift.clientEmail }}</span>
          </div>
          <div class="info-item">
            <span class="label">Installation Date:</span>
            <span class="value">{{ lift.installationDate | date }}</span>
          </div>
          <div class="info-item">
            <span class="label">Maintenance Interval:</span>
            <span class="value">{{ lift.maintenanceInterval }} months</span>
          </div>
          <div class="info-item">
            <span class="label">Next Maintenance:</span>
            <span class="value">{{ lift.nextMaintenanceDate ? (lift.nextMaintenanceDate | date) : 'Not set' }}</span>
          </div>
        </div>
      </div>

      <div class="reminders-section">
        <div class="reminders-header">
          <h3>Reminder Settings</h3>
        </div>

        <div class="reminders-list" *ngIf="reminders.length > 0">
          <div class="reminder-item" *ngFor="let reminder of reminders">
            <div class="reminder-info">
              <span class="reminder-timing">{{ reminder.reminderTiming }} days before maintenance</span>
              <span class="reminder-method">via {{ reminder.notificationMethod }}</span>
            </div>
          </div>
        </div>
        
        <div class="no-reminders" *ngIf="reminders.length === 0">
          <p>No reminders set. Go to Edit to add reminders.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lift-detail-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .header-actions-right {
      display: flex;
      gap: 0.5rem;
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
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary {
      background-color: #1976d2;
      color: white;
    }
    .btn-secondary {
      background-color: #757575;
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
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    .lift-info {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .lift-info h2 {
      margin: 0 0 1.5rem 0;
      color: #1976d2;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 0.25rem;
    }
    .value {
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }
    .reminders-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .reminders-header {
      margin-bottom: 1.5rem;
    }
    .reminders-header h3 {
      margin: 0;
      color: #333;
    }
    .reminders-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .reminder-item {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 6px;
      border-left: 4px solid #1976d2;
    }
    .reminder-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .reminder-timing {
      font-weight: 500;
      color: #333;
    }
    .reminder-method {
      font-size: 0.85rem;
      color: #666;
    }
    .no-reminders {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class LiftDetailComponent implements OnInit {
  lift?: Lift;
  reminders: ReminderSetting[] = [];

  constructor(
    private liftService: LiftService,
    private reminderService: ReminderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLift(+id);
      this.loadReminders(+id);
    }
  }

  loadLift(id: number): void {
    this.liftService.getLiftById(id).subscribe({
      next: (data) => this.lift = data,
      error: (err: any) => console.error('Error loading lift:', err)
    });
  }

  loadReminders(liftId: number): void {
    this.reminderService.getRemindersForLift(liftId).subscribe({
      next: (data) => this.reminders = data,
      error: (err: any) => console.error('Error loading reminders:', err)
    });
  }

  editLift(): void {
    if (this.lift?.id) {
      this.router.navigate(['/lifts', this.lift.id, 'edit']);
    }
  }

  deleteLift(): void {
    if (!this.lift?.id) return;
    
    if (confirm('Are you sure you want to delete this lift?')) {
      this.liftService.deleteLift(this.lift.id).subscribe({
        next: () => this.router.navigate(['/lifts']),
        error: (err: any) => console.error('Error deleting lift:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/lifts']);
  }
}
