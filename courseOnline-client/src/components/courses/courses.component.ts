import { Component, EventEmitter, inject, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '../../models/Course';
import { CoursesService } from '../../services/courses/courses.service';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe, RouterOutlet, RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnChanges, OnInit {

  modalMode: 'add' | 'update' | 'getById' = 'add';
  modalOpen: boolean = false;
  courseIdStatusForUpdate!: number;
  selectedCourse: any = null;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  enrolledCourses!: Course[];
  CoursesUser: Course[] = [];
  static count = 0;
  statusClick: string = '';
  listCourses$: Observable<Course[]>;
  course!: Course;
  formGroup!: FormGroup;
  flag: boolean = false;
  @Output() backToParent = new EventEmitter<void>();


  constructor(private coursesService: CoursesService, public authService: AuthService,
    private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      teacherId: ['', Validators.required]
    });

    this.listCourses$ = this.coursesService.getAllCourses();
  }
  ngOnInit(): void {    
    this.coursesService.getCoursesByStudent(this.getUserID()).subscribe(
      (courses) => { this.enrolledCourses = courses }
    )
  }
  ngOnChanges() {
    () => this.reset();

  }
  reset = () => {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof window !== 'undefined' && window.history.state) {
          const state = window.history.state;
          if (state.returnedValue) {
            this.flag = state.returnedValue;
          }
        }
      }
    });
  }

  whichClick(status: string) {
    this.statusClick = status;
  };

  showLesson() {
    this.flag = true;
  }

  backFromLessons() {
    this.flag = false; // חזרה לקורסים
  }

  goBack() {
    this.backToParent.emit();
    this.router.navigate(['/homePage'])
  }

  get getFormFields(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  getCourses() {
    this.listCourses$ = this.coursesService.getAllCourses()
  }

  getByStudentId() {
    this.coursesService.getCoursesByStudent(this.getUserID()).subscribe({
      next: (course) => {
        this.CoursesUser = course || {} as Course;
      },
      error: (error) => console.log(error)
    });
  }

  async addCourse() {
    this.course = this.formGroup.value;
    this.coursesService.addCourse(this.course).subscribe((c) => {
      if (c && c.id) {
        this.course.id = c.id;
      }
      this.statusClick = '';
    });
    this.listCourses$ = this.coursesService.getAllCourses();
    this.formGroup.reset();
  }

  updateCourse(idCourse: number) {
    this.course = this.formGroup.value;
    this.coursesService.updateCourse(idCourse, this.course).subscribe(
      {
        next: () => { this.listCourses$ = this.coursesService.courses$ },
        error: (error) => console.log(error)
      }
    )
    this.statusClick = '';
    this.formGroup.reset();
    this.courseIdStatusForUpdate = -1
  }

  deleteCourse(idCourse: number) {
    this.coursesService.deleteCourse(idCourse).subscribe(
      () => {
        this.statusClick = '';
        this.listCourses$ = this.coursesService.getAllCourses();
      }
    );
  }

  openModal(mode: 'add' | 'update' | 'getById', course: Course | null = null) {
    this.modalMode = mode;
    this.selectedCourse = course;

    if (mode === 'update' && course) {
      this.courseIdStatusForUpdate = course.id
      this.formGroup.patchValue({
        title: course.title,
        description: course.description
      });
    } else {
      this.formGroup.reset();
    }

    this.dialog.open(this.modalTemplate);
  }

  closeModal() {
    this.dialog.closeAll();
  }

  getUserID(): number {
    const ID = sessionStorage.getItem('userId');
    if (ID) {
      return +ID;
    }
    return -1;
  }

  isEnrolled(course: Course) {
    return this.enrolledCourses.find(c => c.id === course.id) !== undefined;
  }

  joinAuth(course: Course) {
    this.coursesService.joinCourse(this.getUserID(), course.id).subscribe(() => {
      this.enrolledCourses.push(course); // עדכון מיידי של הרשימה
    });
  }

  leaveAuth(course: Course) {
    this.coursesService.leaveCourse(this.getUserID(), course.id).subscribe(() => {
      this.enrolledCourses = this.enrolledCourses.filter(c => c.id !== course.id);
    });
  }
}
