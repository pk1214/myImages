import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  userType: 'user' | 'artist' | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.url[0].path;
    this.userType = routePath === 'artist' ? 'artist' : 'user';

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signup(): void {
    if (this.signupForm.valid && this.userType) {
      const signupData = this.signupForm.value;
      this.authService.signup(signupData, this.userType).subscribe(
        () => {
          alert(`${this.userType} signed up successfully!`);
          this.router.navigate([`/${this.userType}/login`]);
        },
        (error) => {
          alert('Signup failed!');
        }
      );
    }
  }
}
