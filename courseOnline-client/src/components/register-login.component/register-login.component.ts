
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, User, userPartial } from '../../models/User';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register-login',
  imports: [ReactiveFormsModule],
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.css'
})
export class RegisterLoginComponent implements OnInit, OnChanges {

  @Input() showPopup: boolean = true;
  @Input() userStatus: 'login' | 'register' = 'login';
  @Output() closePopup = new EventEmitter<void>();

  user!: User;
  form_enter_to_system!: FormGroup;

  constructor(private fb: FormBuilder, private service: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStatus']) {
      this.initForm();  // יצירה מחדש של הטופס בכל שינוי
    }
  }
  
  onClose() {
    this.closePopup.emit();
  }

  private initForm(): void {
    this.form_enter_to_system = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    if (this.userStatus === 'register') {
      this.form_enter_to_system.addControl('name', new FormControl('', Validators.required));
      this.form_enter_to_system.addControl('role', new FormControl('', Validators.required));
    }
  }

  get getFormFields(): string[] {
    return Object.keys(this.form_enter_to_system.controls);
  }

  async onSubmit() {
    try {
      const userData = this.form_enter_to_system.value;

      let data: userPartial = {
        email: userData['email'],
        password: userData['password'],
      };

      if (this.userStatus === "register") {
        data['name'] = userData['name'];
        data['role'] = userData['role'];
      }
      this.service.postLoginOrRegister(data, this.userStatus).subscribe({
        next: (res) => {
          sessionStorage.setItem("userToken", res.token);
          sessionStorage.setItem("userId", res.userId.toString());
          this.router.navigate(['/']).then(() => {
            this.router.navigate(['homePage'])
          }); // ניווט רק אם הצליח
        },
        error: (err) => {
          console.error("Error during request:", err);
          alert("אירעה שגיאה במהלך ההתחברות. נסה שוב."); // הצגת הודעה במקרה של כישלון
          this.closePopup.emit();
        }
      });

    } catch (error) {
      console.error("Unexpected error:", error);
    }
    this.form_enter_to_system.reset();
  }
}