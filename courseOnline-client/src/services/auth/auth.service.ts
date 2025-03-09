import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, userPartial } from '../../models/User';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  constructor(private http:HttpClient ) {
    this.loadUsers();
    
   }
    private loadUsers() {
       this.http.get<User[]>('http://localhost:3000/api/users')
         .subscribe(courses => this.usersSubject.next(courses));
     }

   getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>("http://localhost:3000/api/users", { headers:
        { Authorization: `Bearer ${sessionStorage.getItem('userToken')}`  } 
      })
        .pipe(
          catchError(error => {
            if(error.status==403){
              alert("you dont have a permission")
            }
            return of([]);  
          })
        );
    }

  postLoginOrRegister( data : userPartial, userStatus: string): Observable<{ token: string ,userId:number}>{
    return this.http.post<{ token: string, userId:number }>(`http://localhost:3000/api/auth/${userStatus}`, data);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/api/users/:${id}`, { headers:
     { Authorization:` Bearer ${sessionStorage.getItem('userToken')}` } 
    }) .pipe(
        catchError(error => {
          alert("getCourseById failed: " + error.message);
          return of({} as User); 
        })
      );
  }

  updateUser(id: number, course: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/api/users/:id${id}`, course, { 
    headers: {Authorization: `Bearer ${sessionStorage.getItem('userToken')}`} 
    })
      .pipe(
        catchError(error => {
          alert("updateCourse failed: " + error.message);
          return of({} as User); 
        }),tap(() => this.loadUsers()
      ));
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/users/${id}`
    , { headers:  { Authorization: `Bearer ${sessionStorage.getItem('userToken')}`}
   })
      .pipe(
        catchError(error => {
          alert("deleteCourse failed: " + error.message);
          return of(); 
        }),tap(() => this.loadUsers()
      ));
  }

  // שמירת ה-Token בלוקאל סטורג'
  setToken(token: string): void {
    sessionStorage.setItem("userToken", token);
  }

  // קבלת ה-Token
  getToken(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('userToken') : null;
  }

  // מחיקת ה-Token (התנתקות)
  logout(): void {
    sessionStorage.removeItem("userToken");
  }

  // בדיקה אם המשתמש מחובר
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  roleUser(){    
    try{
      const token = this.getToken();
      if(!token){
        return null;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null
    }catch{
      alert("there isnt token");
    }
  }
}
