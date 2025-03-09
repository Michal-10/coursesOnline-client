import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Lesson } from '../../models/Lesson';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LessonsService  {

  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  lessons$ = this.lessonsSubject.asObservable();
    
  constructor(private http: HttpClient, private route: ActivatedRoute){
  }

  private loadLessons(courseId:number) {
      this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`)
        .subscribe(lessons => { this.lessonsSubject.next(lessons); // עדכון הנתונים
        });    
      }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('userToken')}`
    });
  }

  getAllLessons(courseId:number):Observable<Lesson[]>{
    return this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}`}
    }).pipe(     
      tap(lessons => this.lessonsSubject.next(lessons)),    
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching lessons:', error);
        return of([]);
      })
    );}

  getLessonById(id: number,courseId:number): Observable<Lesson> {
    return this.http.get<Lesson>(`http://localhost:3000/api/courses/${courseId}/lessons/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          alert("getLessonById failed: " + error.message);
          return of({} as Lesson);
        })
      );
  }

  addLesson(lesson: Lesson,courseId:number): Observable<Lesson> {
    return this.http.post<Lesson>(`http://localhost:3000/api/courses/${courseId}/lessons`, lesson, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          alert("addLesson failed: " + error.message);
          return of({} as Lesson);
        }),tap( ()=> this.loadLessons(courseId)
      ));
  }

  updateLesson(id: number, lesson: Lesson,courseId:number): Observable<Lesson> {
    return this.http.put<Lesson>(`http://localhost:3000/api/courses/${courseId}/lessons/${id}`, {...lesson,courseId:courseId}, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          alert("updateLesson failed: " + error.message);
          return of({} as Lesson);
        }),tap(() => this.loadLessons(courseId)
      ));
  }

  deleteLesson(id: number,courseId:number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/courses/${courseId}/lessons/${id}`, { headers: this.getHeaders() })
      .pipe(tap(() => this.loadLessons(courseId),
        catchError(error => {
          alert("deleteLesson failed: " + error.message);
          return of();
        })
      ));
  }
}
