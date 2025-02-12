import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Purchase {
  artwork: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  _id:string;
  address: string;
  phoneNumber: string;
  paymentMethod: string;
  purchaseDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private purchaseUrl = 'http://localhost:3005/user/purchase';
  private purchaseHistoryUrl = 'http://localhost:3005/user/purchase-history';
  constructor(private http: HttpClient, private authService: AuthService) {}

  addToFavorites(artworkId: string): Observable<any> {
    // console.log("inside user serv")
    const token = this.authService.getLocalStorageToken();
    // console.log(token)
    return this.http.post<any>(
      'http://localhost:3005/user/favorites',
      { artworkId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  getFavorites(): Observable<any> {
    const token = this.authService.getLocalStorageToken();
    return this.http.get<any>('http://localhost:3005/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
   // New method to remove a favorite artwork
   removeFromFavorites(artworkId: string): Observable<any> {
    const token = this.authService.getLocalStorageToken();
    return this.http.delete<any>(`http://localhost:3005/user/favorites/${artworkId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  purchaseArtwork(orderPayload: any): Observable<any> {
    const token = this.authService.getLocalStorageToken();
    return this.http.post<any>(this.purchaseUrl, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPurchaseHistory(): Observable<Purchase[]> {
    const token=this.authService.getLocalStorageToken()
    return this.http.get<Purchase[]>(this.purchaseHistoryUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
