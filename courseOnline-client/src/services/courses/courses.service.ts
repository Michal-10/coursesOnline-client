import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Course } from '../../models/Course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();
  
  constructor(private http: HttpClient) {
  }

  private loadCourses() {
    this.http.get<Course[]>('http://localhost:3000/api/courses')
      .subscribe(courses => {
        this.coursesSubject.next(courses);
      });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("http://localhost:3000/api/courses", { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          alert("getAllCourses failed: " + error.message);
          return of([]);  
        })
      );
  }

  getCoursesByStudent(id: number): Observable<Course[]> {
    return this.http.get<Course[]>( "http://localhost:3000/api/courses/student/"+ id, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }
  
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`http://localhost:3000/api/courses/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          alert("getCourseById failed: " + error.message);
          return of({} as Course); 
        })
      );
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>("http://localhost:3000/api/courses", course, { headers: this.getHeaders() })
      .pipe(tap(() => this.loadCourses()),
        catchError(error => {
          alert("addCourse failed: " + error.message);
          return of({} as Course); 
        })
      );
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    
    return this.http.put<Course>(`http://localhost:3000/api/courses/${id}`, 
    {        
        title:course.title,
        description:course.description,
        teacherId:course.teacherId
    },   
     { headers: this.getHeaders() })
      .pipe(tap(() => this.loadCourses()),
        catchError(error => {
          alert("updateCourse failed: " + error.message);
          return of({} as Course); 
        }),
      );
      
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/courses/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.loadCourses()),
        catchError(error => {
          alert("deleteCourse failed: " + error.message);
          return of(); 
        }),
      );
  }
  joinCourse(userId: number, courseId: number): Observable<Course> {
    return this.http.post<Course>(`http://localhost:3000/api/courses/${courseId}/enroll`, { userId }, { headers: this.getHeaders() })
      .pipe( 
        catchError(error => {
          alert("Error: Failed to join the course");
          return of({} as Course); 
        })
      );
  }

  leaveCourse(userId: number, courseId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/courses/${courseId}/unenroll`, {
      body: { userId: userId },
      headers: this.getHeaders()
    })
    .pipe(
      catchError(error => {
        alert("Error: Failed to leave the course");
        return of(); 
      })
    );
  }
}
