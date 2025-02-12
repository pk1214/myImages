import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3005'; // Backend URL

  constructor(private http: HttpClient) {}

  // Login request
  login(email: string, password: string, userType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userType}/login`, {
      email,
      password,
    });
  }

  // Signup request
  signup(data: any, userType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userType}/signup`, data);
  }

  // getBearerToken(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get<any>(`${this.apiUrl}/user/profile`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // }

  // Decode JWT without external library (simplistic)
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }

  getLocalStorageToken(): string | null {
    return localStorage.getItem('token');
  }
  

  // Check role
  hasRole(role: string):boolean{
    const token = this.getLocalStorageToken()
    if(token){
      const decoded = this.decodeToken(token);
      return decoded.role===role;
    }
    return role==="visitor";
  }
}
