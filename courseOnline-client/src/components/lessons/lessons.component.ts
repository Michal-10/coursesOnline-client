import { AsyncPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RouterOutlet, ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Course } from "../../models/Course";
import { Lesson } from "../../models/Lesson";
import { AuthService } from "../../services/auth/auth.service";
import { LessonsService } from "../../services/lessons/lessons.service";

@Component({
  selector: 'app-lessons',
  imports: [ReactiveFormsModule, RouterOutlet, AsyncPipe],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent implements OnInit{

  status: string = '';
  lessonIdForUpdate!: number;
  lesson!: Lesson;
  formGroup!: FormGroup;
  courseId!: number;
  @Input() courseInput!: Course;

  @Output() backToCourses: EventEmitter<void> = new EventEmitter<void>();

  listLessons$: Observable<Lesson[]>;

  constructor(private LessonsService: LessonsService, public authService: AuthService,
    private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.listLessons$ = this.LessonsService.lessons$;
    // this.LessonsService.lessons$.subscribe(lessons => this.listLessons = lessons);
    this.route.params.subscribe(params => {
      this.courseId = params['courseId']; // שם הפרמטר ב-URL
    });

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId');
      if (id) {
        this.courseId = +id; // המרה למספר ועדכון השירות
        this.listLessons$ = this.LessonsService.getAllLessons(this.courseId);
      }
    });
  }

  whichClick(status: string) {
    this.status = status;
  };

  get getFormFields(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  backCourses() {
    this.backToCourses.emit();
    this.router.navigate(['/'], { relativeTo: this.route, state: { returnedValue: false } }).then(() =>
      this.router.navigate(['/courses'])
    );
  }
  getLessons() {
    this.LessonsService.getAllLessons(this.courseId).subscribe(lessons => {
      this.listLessons$ = this.LessonsService.lessons$;
    });
  }

  async addLesson() {
    this.lesson = this.formGroup.value;
    this.LessonsService.addLesson(this.lesson, this.courseId).subscribe(
      () => this.listLessons$ = this.LessonsService.lessons$
    )
    this.status = '';
    this.formGroup.reset();
  }

  async updateLesson(idLesson: number) {
    this.lesson = this.formGroup.value;
    this.LessonsService.updateLesson(idLesson, this.lesson, this.courseId).subscribe(
      () => this.listLessons$ = this.LessonsService.lessons$
    );
    this.status = '';
    this.lessonIdForUpdate = -1;
    this.formGroup.reset();
  }

  deleteLesson(idCourse: number) {
    this.LessonsService.deleteLesson(idCourse, this.courseId).subscribe(
      () => this.listLessons$ = this.LessonsService.lessons$
    );
  }
}
