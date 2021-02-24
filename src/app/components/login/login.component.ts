import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/service/data-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private _service: DataServiceService, private _router: Router) { 
    if (localStorage.getItem('itemKey')){
      this._router.navigateByUrl('/dashboard')
    }
  }
  signInForm: FormGroup
  ngOnInit(): void {
    this.signInForm=this.fb.group({
      email: [''],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }
  get email() {
    return this.signInForm.get('email');
  }
 
  get password() {
    return this.signInForm.get('password');
  }

  onSubmit(){
    this._service.login(this.signInForm.value).subscribe(
      (res)=>{
        if (res['status']==true){
          localStorage.setItem('itemKey',res['key'])
          this._router.navigate(['/dashboard'])
        }
      }
    )
  }
}
