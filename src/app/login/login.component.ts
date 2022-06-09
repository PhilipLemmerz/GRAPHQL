import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor( private fb: FormBuilder, private storeService: HttpService, private router: Router) { }

  formGroup = this.fb.group({
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  });

  ngOnInit(): void {
  }

  submit() {
    this.storeService.login(this.formGroup.value).subscribe( res => {
      console.log(res)
      localStorage.setItem('token', res.data.login.token);
      this.router.navigateByUrl('').then(() => {
        window.location.reload();
      });
    })
  }




}
