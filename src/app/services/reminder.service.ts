import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReminderSetting } from '../models/lift.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private baseUrl = `${environment.apiBaseUrl}/lifts`;

  constructor(private http: HttpClient) { }

  getRemindersForLift(liftId: number): Observable<ReminderSetting[]> {
    return this.http.get<ReminderSetting[]>(`${this.baseUrl}/${liftId}/reminders`);
  }

  createReminder(liftId: number, reminder: ReminderSetting): Observable<ReminderSetting> {
    return this.http.post<ReminderSetting>(`${this.baseUrl}/${liftId}/reminders`, reminder);
  }

  updateReminder(liftId: number, id: number, reminder: ReminderSetting): Observable<ReminderSetting> {
    return this.http.put<ReminderSetting>(`${this.baseUrl}/${liftId}/reminders/${id}`, reminder);
  }

  deleteReminder(liftId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${liftId}/reminders/${id}`);
  }
}
