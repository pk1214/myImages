import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userType: 'user' | 'artist' | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Determine if the current route is for user or artist
    const routePath = this.route.snapshot.url[0].path;
    this.userType = routePath === 'artist' ? 'artist' : 'user';
    console.log(this.userType)

    // Initialize reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    if (this.loginForm.valid && this.userType) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password, this.userType).subscribe(
        (res) => {
          alert(`${this.userType} logged in successfully!`);
          localStorage.setItem('token', res.token);
          const redirectUrl =
            this.userType === 'artist' ? '/artist/dashboard' : '/user/home';
          this.router.navigate([redirectUrl]);
        },
        (error) => {
          alert('Login failed!');
        }
      );
    }
  }

  goToSignup(): void {
    this.router.navigate([`/${this.userType}/signup`]);
  }
}
