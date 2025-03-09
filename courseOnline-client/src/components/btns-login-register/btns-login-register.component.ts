import { Component, EventEmitter, Output } from '@angular/core';
import { RegisterLoginComponent } from '../register-login.component/register-login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-btns-login-register',
  imports: [RegisterLoginComponent,
    MatToolbarModule, MatButtonModule],
  templateUrl: './btns-login-register.component.html',
  styleUrl: './btns-login-register.component.css'
})
export class BtnsLoginRegisterComponent {

  showPopup = false;
  statusLoginOrRegister: 'login' | 'register' = 'login';

  openPopup(status: 'login' | 'register') {
    this.statusLoginOrRegister = status;    
    this.showPopup = true;    
  }

  closePopup() {
    this.showPopup = false;
  }

}
