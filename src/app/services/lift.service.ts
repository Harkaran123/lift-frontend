import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lift } from '../models/lift.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiftService {
  private apiUrl = `${environment.apiBaseUrl}/lifts`;

  constructor(private http: HttpClient) { }

  getAllLifts(): Observable<Lift[]> {
    return this.http.get<Lift[]>(this.apiUrl);
  }

  getLiftById(id: number): Observable<Lift> {
    return this.http.get<Lift>(`${this.apiUrl}/${id}`);
  }

  createLift(lift: Lift): Observable<Lift> {
    return this.http.post<Lift>(this.apiUrl, lift);
  }

  updateLift(id: number, lift: Lift): Observable<Lift> {
    return this.http.put<Lift>(`${this.apiUrl}/${id}`, lift);
  }

  deleteLift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
