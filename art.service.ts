import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Artwork {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  medium: string;
  style: string;
  artist: string;
  isPromoted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ArtService {
  private getArtsByArtistIdUrl = 'http://localhost:3005/artist/dashboard';
  private uploadArtUrl = 'http://localhost:3005/artist/upload';
  private getArtsUrl = 'http://localhost:3005/user/home';
  private getArtbyIdUrl = 'http://localhost:3005/artwork/details';
  private baseUrl="http://localhost:3005";

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all artworks from the backend
  getArtworks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.getArtsUrl}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  // Get artworks uploaded by a specific artist
  getArtworksByArtist(artistId: string): Observable<Artwork[]> {
    // console.log(artistId)
    return this.http.get<Artwork[]>(
      `${this.getArtsByArtistIdUrl}?artistId=${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
        },
      }
    );
  }

  uploadArtwork(formData: FormData): Observable<any> {
    console.log('inside upload service');
    return this.http.post<any>(this.uploadArtUrl, formData, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  getArtworkDetails(artworkId: string): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.getArtbyIdUrl}/${artworkId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getLocalStorageToken()}`,
      },
    });
  }

  // In ArtService class
  deleteArtwork(artworkId: string): Observable<any> {
    const token = this.authService.getLocalStorageToken();
    return this.http.delete<any>(`${this.baseUrl}/artist/artwork/${artworkId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  promoteArtwork(artworkId: string): Observable<any> {
    const token = this.authService.getLocalStorageToken();
    return this.http.put<any>(
      `${this.baseUrl}/artist/artwork/promote/${artworkId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
