import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private apiUrl = 'http://localhost:3005/commission'; // Adjust as needed

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Submit commission request (user side)
  submitCommissionRequest(requestData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit`, requestData, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  // Get commission requests for artist
  getCommissionRequestsForArtist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/artist`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  // Get commission requests for user
  getCommissionRequestsForUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  // Update commission (status and/or price)
  updateCommission(requestId: string, updateData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/update/${requestId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
        },
      }
    );
  }
}
