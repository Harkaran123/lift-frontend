import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertRecipient } from '../models/lift.model';


@Injectable({
  providedIn: 'root'
})
export class AlertRecipientService {
  private apiUrl = `${environment.apiBaseUrl}/alert-recipients`;

  constructor(private http: HttpClient) { }

  getAllRecipients(): Observable<AlertRecipient[]> {
    console.log(this.apiUrl);
    return this.http.get<AlertRecipient[]>(this.apiUrl);
  }

  getActiveRecipients(): Observable<AlertRecipient[]> {
    return this.http.get<AlertRecipient[]>(`${this.apiUrl}/active`);
  }

  getRecipientById(id: number): Observable<AlertRecipient> {
    return this.http.get<AlertRecipient>(`${this.apiUrl}/${id}`);
  }

  createRecipient(recipient: AlertRecipient): Observable<AlertRecipient> {
    return this.http.post<AlertRecipient>(this.apiUrl, recipient);
  }

  updateRecipient(id: number, recipient: AlertRecipient): Observable<AlertRecipient> {
    return this.http.put<AlertRecipient>(`${this.apiUrl}/${id}`, recipient);
  }

  deleteRecipient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
