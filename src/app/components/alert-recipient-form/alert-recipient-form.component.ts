import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertRecipientService } from '../../services/alert-recipient.service';
import { AlertRecipient } from '../../models/lift.model';

@Component({
  selector: 'app-alert-recipient-form',
  template: `
    <div class="recipient-form-container">
      <h2>{{ isEditMode ? 'Edit Alert Recipient' : 'Add Alert Recipient' }}</h2>
      
      <form (ngSubmit)="onSubmit()" #recipientForm="ngForm">
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text" id="name" name="name" [(ngModel)]="recipient.name" required class="form-control">
        </div>
        
        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" [(ngModel)]="recipient.email" required class="form-control">
        </div>
        
        <div class="form-group">
          <label for="phone">Phone (Optional)</label>
          <input type="tel" id="phone" name="phone" [(ngModel)]="recipient.phone" class="form-control">
        </div>
        
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" [(ngModel)]="recipient.active" name="active">
            Active (will receive notifications)
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!recipientForm.valid">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .recipient-form-container {
      max-width: 500px;
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
    }
    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: normal;
    }
    .checkbox-group input[type="checkbox"] {
      width: auto;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
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
  `]
})
export class AlertRecipientFormComponent implements OnInit {
  recipient: AlertRecipient = {
    name: '',
    email: '',
    active: true
  };
  isEditMode = false;
  recipientId?: number;

  constructor(
    private alertRecipientService: AlertRecipientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipientId = +id;
      this.loadRecipient(this.recipientId);
    }
  }

  loadRecipient(id: number): void {
    this.alertRecipientService.getRecipientById(id).subscribe({
      next: (data) => this.recipient = data,
      error: (err) => console.error('Error loading recipient:', err)
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.recipientId) {
      this.alertRecipientService.updateRecipient(this.recipientId, this.recipient).subscribe({
        next: () => this.router.navigate(['/alert-recipients']),
        error: (err) => console.error('Error updating recipient:', err)
      });
    } else {
      this.alertRecipientService.createRecipient(this.recipient).subscribe({
        next: () => this.router.navigate(['/alert-recipients']),
        error: (err) => console.error('Error creating recipient:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/alert-recipients']);
  }
}
