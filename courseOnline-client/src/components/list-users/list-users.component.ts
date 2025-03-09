import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-users',
  imports: [ ReactiveFormsModule, AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent  {

  @Output() backHomePage:EventEmitter<void> = new EventEmitter<void>();
    listUsers$: Observable<User[]>;   
    user! : User ;
    userId! : number ;
    formGroup! : FormGroup;
    statusClick!:string;
    @Output() backToParent = new EventEmitter<void>();


  constructor(private userService:AuthService,private fb:FormBuilder, private router:Router, private route:ActivatedRoute) {
    this.listUsers$ = this.userService.getAllUsers();
    this.formGroup = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required],
      name:['',Validators.required],
      role:['',Validators.required]
    });
  }

  whichClick(status:string){
    this.statusClick = status;
  };

  goBack() {
      this.router.navigate(['/homePage'])
  }


  get getFormFields(): string[] {
    return Object.keys(this.formGroup.controls);
  }
  
  getUsers() {
    this.userService.getAllUsers().subscribe(
      ()=>{this.listUsers$ = this.userService.users$;},
      (error)=>{console.log("you dont have a permission");
      }
    );
  }

  getUserById(idCourse:number){
    this.userService.getUserById(idCourse).subscribe(res=>this.user = res);
  }


  async updateUser(idCourse:number){
    this.statusClick == 'update';
    this.user = this.formGroup.value;
    this.userService.updateUser(idCourse,this.user).subscribe(()=>{
      this.listUsers$ = this.userService.users$;
    });;
    this.statusClick = '';
    this.formGroup.reset();
  }

 
  deleteUser(idCourse: number) {
    this.userService.deleteUser(idCourse).subscribe(()=>{
      this.listUsers$ = this.userService.users$;
    });
  }

}
