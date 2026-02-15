import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertRecipientService } from '../../services/alert-recipient.service';
import { AlertRecipient } from '../../models/lift.model';

@Component({
  selector: 'app-alert-recipient-list',
  template: `
    <div class="alert-recipient-list-container">
      <h2>Alert Recipients</h2>
      <button class="btn btn-primary" (click)="createNewRecipient()">+ Add New Recipient</button>
      
      <div *ngIf="recipients.length === 0" class="empty-state">
        <p>No alert recipients found. Click "Add New Recipient" to create one.</p>
      </div>
      
      <div class="recipient-grid" *ngIf="recipients.length > 0">
        <div class="recipient-card" *ngFor="let recipient of recipients">
          <div class="recipient-header">
            <h3>{{ recipient.name }}</h3>
            <span class="badge" [class.active]="recipient.active" [class.inactive]="!recipient.active">
              {{ recipient.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="recipient-body">
            <p><strong>Email:</strong> {{ recipient.email }}</p>
            <p *ngIf="recipient.phone"><strong>Phone:</strong> {{ recipient.phone }}</p>
          </div>
          <div class="recipient-actions">
            <button class="btn btn-edit" (click)="editRecipient(recipient.id!)">Edit</button>
            <button class="btn btn-delete" (click)="deleteRecipient(recipient.id!)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-recipient-list-container {
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
    .btn-edit {
      background-color: #ff9800;
      color: white;
    }
    .btn-delete {
      background-color: #f44336;
      color: white;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
      background: white;
      border-radius: 8px;
    }
    .recipient-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .recipient-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .recipient-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .recipient-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e0e0e0;
    }
    .recipient-header h3 {
      margin: 0;
      color: #1976d2;
    }
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    .badge.active {
      background-color: #4caf50;
      color: white;
    }
    .badge.inactive {
      background-color: #9e9e9e;
      color: white;
    }
    .recipient-body p {
      margin: 0.5rem 0;
      color: #555;
    }
    .recipient-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `]
})
export class AlertRecipientListComponent implements OnInit {
  recipients: AlertRecipient[] = [];

  constructor(
    private alertRecipientService: AlertRecipientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecipients();
  }

  loadRecipients(): void {
    this.alertRecipientService.getAllRecipients().subscribe({
      next: (data) => this.recipients = data,
      error: (err) => console.error('Error loading alert recipients:', err)
    });
  }

  createNewRecipient(): void {
    this.router.navigate(['/alert-recipients/new']);
  }

  editRecipient(id: number): void {
    this.router.navigate(['/alert-recipients', id, 'edit']);
  }

  deleteRecipient(id: number): void {
    if (confirm('Are you sure you want to delete this alert recipient?')) {
      this.alertRecipientService.deleteRecipient(id).subscribe({
        next: () => this.loadRecipients(),
        error: (err) => console.error('Error deleting alert recipient:', err)
      });
    }
  }
}
