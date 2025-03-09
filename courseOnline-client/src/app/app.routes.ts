import { Routes } from '@angular/router';
import { BtnsLoginRegisterComponent } from '../components/btns-login-register/btns-login-register.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { LessonsComponent } from '../components/lessons/lessons.component';
import { ListUsersComponent } from '../components/list-users/list-users.component';
import { MenuComponent } from '../components/menu/menu.component';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [

    {
        path: '',
        component: MenuComponent,
        canActivate: [authGuard],
    },
    { path: 'homePage', component: HomePageComponent },
    {
        path: "courses", component: CoursesComponent,
        children: [
            {
                path: ':courseId/lessons', component: LessonsComponent,
                children: [
                    { path: ':id', component: LessonsComponent }
                ]
            }
        ],
    },
    {
        path: "users", component: ListUsersComponent
    },
    { path: "login", component: BtnsLoginRegisterComponent },

];
