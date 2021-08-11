import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public router: Router,
    public loadingController: LoadingController,
    public authService: AuthService,
    public fb: FormBuilder
  ) {}

  loginform: FormGroup;

  ngOnInit() {
    this.loginform = this.fb.group({
      email: ['jesse.born@tt.ch', [Validators.required, Validators.email]],
      password: ['testpw2021', [Validators.required, Validators.minLength(6)]],
    });

    this.loginform.valueChanges.subscribe(console.log);
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'logging in...',
    });
    await loading.present();
    await this.authService.login(this.email.value, this.password.value);
    this.loadingController.dismiss();
    await loading.onDidDismiss();
  }

  signUp() {
    this.router.navigateByUrl('/signup');
  }

  resetPW() {
    this.router.navigateByUrl('/reset');
  }

  get email() {
    return this.loginform.get('email');
  }
  get password() {
    return this.loginform.get('password');
  }
}
