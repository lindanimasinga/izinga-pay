import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IzingaOrderManagementService } from './service/izinga-order-management.service';
import { StorageService } from './service/storage-service.service';
import { PaymentService } from './service/payment.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {PayfastComponent} from './payfast/payfast.component'
import {OzowPaymentComponent} from './ozow-payment/ozow-payment.component';
import { PayComponent } from './pay/pay.component'

@NgModule({
  declarations: [
    AppComponent,
    PayfastComponent,
    OzowPaymentComponent,
    PayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [    
    IzingaOrderManagementService,
    StorageService,
    PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
