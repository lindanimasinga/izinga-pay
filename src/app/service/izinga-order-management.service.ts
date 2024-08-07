import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {StoreProfile, Order, UserProfile, Promotion} from '../model/models'
import { StorageService } from './storage-service.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { YocoPaymentInitiate, YocoPaymentInitiateResponse } from '../model/yoco-payment-initiate';
import { UserCardLink } from '../model/user-card-link';

@Injectable({
  providedIn: 'root'
})
export class IzingaOrderManagementService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  getStoreById(id : string): Observable<StoreProfile> {
    return this.http.get<StoreProfile>(`${environment.izingaUrl}/store/${id}`, {headers: this.headers});
  }

  get headers(){ 
    return {
    "Content-type": "application/json",
    "app-version": "3.0.0",
    };
  }

  startOrder(order: Order) : Observable<Order> {
    return this.http
        .post<Order>(`${environment.izingaUrl}/order`, order, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          })
        )
  }

  finishOrder(order: Order) : Observable<Order> {
    return this.http
        .patch<Order>(`${environment.izingaUrl}/order/${order.id}`, order, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  applyPromo(order: Order, promoCode: string): Observable<Order> {
    return this.http
        .patch<Order>(`${environment.izingaUrl}/order/${order.id}/promocode/${promoCode}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getAllOrdersByMobileNumber(mobileNumber: string) : Observable<Array<Order>> {
    return this.http
        .get<Array<Order>>(`${environment.izingaUrl}/order?phone=${mobileNumber}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getAllOrdersByStoreId(storeId: string) {
    return this.http
        .get<Array<Order>>(`${environment.izingaUrl}/order?storeId=${storeId}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getAllPromotionsByStoreId(storeId: string) {
    return this.http
        .get<Array<Promotion>>(`${environment.izingaUrl}/promotion?storeType=${environment.storeType}&storeId=${storeId}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getOrderById(orderId: string) : Observable<Order> {
    return this.http
    .get<Order>(`${environment.izingaUrl}/order/${orderId}`, {headers: this.headers})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this.storage.errorMessage = error.error.message
        return throwError(error)
      }))
  }

  registerCustomer(userProfile: UserProfile) : Observable<UserProfile> {
    return this.http
        .post<UserProfile>(`${environment.izingaUrl}/user`, userProfile, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getCustomerByPhoneNumber(mobileNumber: string): Observable<UserProfile> {
    return this.http
        .get<UserProfile>(`${environment.izingaUrl}/user/${mobileNumber}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getLinkedUserToCard(cardId: string): Observable<UserCardLink>  {
    return this.http
        .get<UserProfile>(`${environment.izingaUrl}/linkCode/${cardId}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  getCustomerById(customerId: string): Observable<UserProfile> {
    return this.http
        .get<UserProfile>(`${environment.izingaUrl}/user/${customerId}`, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }

  initialiseYocoPayment(yocoData: YocoPaymentInitiate): Observable<YocoPaymentInitiateResponse> {
    return this.http
        .post<UserProfile>(`${environment.izingaUrl}/yoco/payment/initiate`, yocoData, {headers: this.headers})
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.storage.errorMessage = error.error.message
            return throwError(error)
          }))
  }
}
