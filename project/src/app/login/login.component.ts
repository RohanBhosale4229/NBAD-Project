import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSignedIn = false
  constructor(public firebaseService: FirebaseService, public router: Router) {
  }
  ngOnInit() {
    if(localStorage.getItem('user')!==null)
    this.isSignedIn = true
    else
    this.isSignedIn = false
  }
  async onSignin(email:string,password:string){
    await this.firebaseService.signin(email,password).then((result)=>{

    if(this.firebaseService.isLoggedIn){
    this.isSignedIn = true
    this.router.navigate(['/dashboard'])
  }
}).catch((error)=>{
  window.alert(error.message)
})
}
handleLogout(){
  this.isSignedIn = false
}

}
