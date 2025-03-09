import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterOutlet,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnChanges {

  showUsersOrCourses: boolean = true;
  constructor(private route: Router) { }
  ngOnChanges() {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof window !== 'undefined' && window.history.state) {
          const state = window.history.state;
          if (state.returnedValue) {
            this.showUsersOrCourses = state.returnedValue;
          }
        }
      }
    });
  }

  goTo(s: string) {
    this.showUsersOrCourses = !this.showUsersOrCourses;
    this.route.navigate([`/${s}`]);
  }

}
