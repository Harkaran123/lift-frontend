import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LiftService } from '../../services/lift.service';
import { ReminderService } from '../../services/reminder.service';
import { Lift, ReminderSetting } from '../../models/lift.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lift-form',
  template: `
    <div class="lift-form-container">
      <h2>{{ isEditMode ? 'Edit Lift' : 'Create New Lift' }}</h2>
      
      <form (ngSubmit)="onSubmit()" #liftForm="ngForm">
        <div class="section">
          <h3>Lift Details</h3>
          <div class="form-group">
            <label for="name">Lift Name *</label>
            <input type="text" id="name" name="name" [(ngModel)]="lift.name" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="area">Area *</label>
            <input type="text" id="area" name="area" [(ngModel)]="lift.area" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="building">Building *</label>
            <input type="text" id="building" name="building" [(ngModel)]="lift.building" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="clientName">Client Name *</label>
            <input type="text" id="clientName" name="clientName" [(ngModel)]="lift.clientName" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="clientPhone">Client Phone *</label>
            <input type="tel" id="clientPhone" name="clientPhone" [(ngModel)]="lift.clientPhone" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="clientEmail">Client Email</label>
            <input type="email" id="clientEmail" name="clientEmail" [(ngModel)]="lift.clientEmail" class="form-control">
          </div>
          
          <div class="form-group">
            <label for="installationDate">Installation Date *</label>
            <input type="date" id="installationDate" name="installationDate" [(ngModel)]="lift.installationDate" required class="form-control">
          </div>
          
          <div class="form-group">
            <label for="maintenanceInterval">Maintenance Interval (months) *</label>
            <input type="number" id="maintenanceInterval" name="maintenanceInterval" [(ngModel)]="lift.maintenanceInterval" required min="1" class="form-control">
          </div>
        </div>

        <div class="section reminder-section">
          <div class="reminder-header">
            <h3>Reminders (Optional)</h3>
            <button type="button" class="btn btn-sm btn-primary" (click)="addReminderField()">+ Add Reminder</button>
          </div>
          
          <div class="reminder-list">
            <div class="reminder-item" *ngFor="let reminder of pendingReminders; let i = index">
              <div class="reminder-fields">
                <div class="form-group">
                  <label>Days Before</label>
                  <input type="number" [(ngModel)]="reminder.reminderTiming" name="reminderTiming{{i}}" min="1" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Method</label>
                  <select [(ngModel)]="reminder.notificationMethod" name="notificationMethod{{i}}" class="form-control" required>
                    <option value="">Select</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-delete" (click)="removeReminder(i)">Remove</button>
            </div>
          </div>
          
          <p class="no-reminders" *ngIf="pendingReminders.length === 0">No reminders added yet. Click "Add Reminder" to set up maintenance notifications.</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!liftForm.valid || isSubmitting">
            {{ isSubmitting ? 'Creating...' : (isEditMode ? 'Update' : 'Create') }} Lift
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .lift-form-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    h3 {
      margin: 0 0 1rem 0;
      color: #555;
      font-size: 1.1rem;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }
    .section {
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: #1976d2;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: opacity 0.2s;
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
    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
    .btn-delete {
      background-color: #f44336;
      color: white;
    }
    .btn:hover:not(:disabled) {
      opacity: 0.9;
    }
    .reminder-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }
    .reminder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .reminder-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .reminder-item {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .reminder-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      flex: 1;
    }
    .reminder-fields .form-group {
      margin-bottom: 0;
    }
    .no-reminders {
      color: #666;
      font-style: italic;
      margin: 0;
    }
  `]
})
export class LiftFormComponent implements OnInit {
  lift: Lift = {
    name: '',
    area: '',
    building: '',
    clientName: '',
    clientPhone: '',
    installationDate: '',
    maintenanceInterval: 3
  };
  isEditMode = false;
  isSubmitting = false;
  liftId?: number;
  pendingReminders: ReminderSetting[] = [];

  constructor(
    private liftService: LiftService,
    private reminderService: ReminderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.liftId = +id;
      this.loadLift(this.liftId);
      this.loadReminders(this.liftId);
    }
  }

  loadLift(id: number): void {
    this.liftService.getLiftById(id).subscribe({
      next: (data: Lift) => this.lift = data,
      error: (err: any) => console.error('Error loading lift:', err)
    });
  }

  loadReminders(liftId: number): void {
    this.reminderService.getRemindersForLift(liftId).subscribe({
      next: (data: ReminderSetting[]) => {
        this.pendingReminders = data.map(r => ({
          id: r.id,
          reminderTiming: r.reminderTiming,
          notificationMethod: r.notificationMethod
        }));
      },
      error: (err: any) => console.error('Error loading reminders:', err)
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.liftId) {
      this.isSubmitting = true;
      this.liftService.updateLift(this.liftId, this.lift).subscribe({
        next: () => {
          if (this.pendingReminders.length > 0) {
            this.saveRemindersForExistingLift(this.liftId!);
          } else {
            this.isSubmitting = false;
            this.router.navigate(['/lifts']);
          }
        },
        error: (err: any) => {
          this.isSubmitting = false;
          console.error('Error updating lift:', err);
        }
      });
    } else {
      this.isSubmitting = true;
      this.liftService.createLift(this.lift).subscribe({
        next: (createdLift: Lift) => {
          if (this.pendingReminders.length > 0 && createdLift.id) {
            this.createRemindersForLift(createdLift.id);
          } else {
            this.isSubmitting = false;
            this.router.navigate(['/lifts']);
          }
        },
        error: (err: any) => {
          this.isSubmitting = false;
          console.error('Error creating lift:', err);
        }
      });
    }
  }

  addReminderField(): void {
    this.pendingReminders.push({
      reminderTiming: 7,
      notificationMethod: ''
    });
  }

  removeReminder(index: number): void {
    this.pendingReminders.splice(index, 1);
  }

  private createRemindersForLift(liftId: number): void {
    const validReminders = this.pendingReminders.filter(r => r.reminderTiming && r.notificationMethod);
    
    if (validReminders.length === 0) {
      this.isSubmitting = false;
      this.router.navigate(['/lifts']);
      return;
    }

    const reminderRequests = validReminders.map(reminder =>
      this.reminderService.createReminder(liftId, reminder)
    );

    forkJoin(reminderRequests).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/lifts']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error creating reminders:', err);
        this.router.navigate(['/lifts']);
      }
    });
  }

  private saveRemindersForExistingLift(liftId: number): void {
    const validReminders = this.pendingReminders.filter(r => r.reminderTiming && r.notificationMethod);
    
    if (validReminders.length === 0) {
      this.isSubmitting = false;
      this.router.navigate(['/lifts']);
      return;
    }

    // Only create reminders that don't have an id (new ones added during edit)
    const newReminders = validReminders.filter(r => !r.id);
    
    if (newReminders.length === 0) {
      this.isSubmitting = false;
      this.router.navigate(['/lifts']);
      return;
    }

    const reminderRequests = newReminders.map(reminder =>
      this.reminderService.createReminder(liftId, reminder)
    );

    forkJoin(reminderRequests).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/lifts']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error saving reminders:', err);
        this.router.navigate(['/lifts']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lifts']);
  }
}
