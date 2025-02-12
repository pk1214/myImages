import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Assumed service
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userType: 'visitor' | 'user' | 'artist' = 'visitor';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the logged in user type from AuthService or localStorage.
    // For example, if the token is stored, decode it and set the role.
    const token = localStorage.getItem('token');
    if (token) {
      // Example: assume AuthService has a method to decode token
      const decoded = this.authService.decodeToken(token);
      this.userType = decoded.role; // 'user' or 'artist'
      console.log(this.userType)
    } else {
      this.userType = 'visitor';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userType = 'visitor';
    this.router.navigate(['/']);
  }
}
