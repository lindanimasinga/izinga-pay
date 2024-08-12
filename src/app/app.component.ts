import { Component } from '@angular/core';
import { StorageService } from './service/storage-service.service';

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
document.body.classList.toggle('dark-theme', prefersDarkScheme.matches);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'izinga-pay';

  constructor(private storageService: StorageService) {
    this.clearError()
  }

  get hasError(): boolean {
    return this.storageService.errorMessage != null 
  }

  clearError() {
    this.storageService.errorMessage = null;
  }

  get errorMessage() {
    return this.storageService.errorMessage
  }

}
