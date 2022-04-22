import { Component } from '@angular/core';

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
document.body.classList.toggle('dark-theme', prefersDarkScheme.matches);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'izinga-pay';

  constructor() {
  }

}
