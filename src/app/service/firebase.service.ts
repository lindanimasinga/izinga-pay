import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, ConfirmationResult, RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app: FirebaseApp;
  private auth: Auth;
  recaptchaVerifier: RecaptchaVerifier;
  confirmResults: ConfirmationResult;

  constructor(private storage: StorageService) {
    // Guard against duplicate initialisation (e.g. during hot-module reload)
    this.app = getApps().length === 0
      ? initializeApp({
          apiKey: environment.firebase_apiKey,
          authDomain: environment.authDomain,
          databaseURL: environment.databaseURL,
          projectId: environment.projectId,
          messagingSenderId: environment.messagingSenderId,
          appId: environment.appId,
          measurementId: environment.measurementId
        })
      : getApp();
    this.auth = getAuth(this.app);
  }

  createCapture() {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {});
    this.recaptchaVerifier.render();
  }

  requestVerification(phoneNumber: string): Observable<ConfirmationResult> {
    const appVerifier = this.recaptchaVerifier;
    const promise = signInWithPhoneNumber(this.auth, phoneNumber, appVerifier);
    return from(promise).pipe(
      map(resp => {
        this.confirmResults = resp;
        return resp;
      })
    );
  }

  confirmCode(code: string) {
    return from(this.confirmResults.confirm(code)).pipe(
      catchError((error: HttpErrorResponse) => {
        this.storage.errorMessage = error.message;
        return throwError(error);
      })
    );
  }
}
