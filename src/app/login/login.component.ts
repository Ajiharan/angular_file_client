import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public errorMsg: string = '';
  private subscription: Subscription;

  public loading: boolean;

  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private route: Router, private service: AuthService) {
    this.subscription = new Subscription();
    this.loading = false;
  }

  ngOnInit(): void {}

  submitForm(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        this.route.navigate([`/${res}`]);
      },
      error: (err) => {
        this.errorMsg = err;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
