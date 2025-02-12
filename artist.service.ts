import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Artist {
  _id: string;
  name: string;
  email: string;
  profile_picture: string;
  bio?: string;
  social_media?: Array<{ platform: string; link: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:3005/artist'; // Adjust the endpoint URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  getArtistProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  updateArtistProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }
  // Method to fetch all artists
  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/all`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }
}
