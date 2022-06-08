import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private fb: FormBuilder, private storeService: HttpService, private router: Router) { }

  formGroup = this.fb.group({
    'name': new FormControl('', Validators.required),
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  });

  ngOnInit(): void {
  }

  submit() {
    this.storeService.signUpUser(this.formGroup.value).subscribe(res => {
      console.log(res);
      this.router.navigateByUrl('/login')
    })
  }

}
