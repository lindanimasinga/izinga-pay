import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IzingaOrderManagementService } from './service/izinga-order-management.service';
import { StorageService } from './service/storage-service.service';
import { PaymentService } from './service/payment.service';
import { YocoService } from './service/yoco.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {PayfastComponent} from './payfast/payfast.component'
import {OzowPaymentComponent} from './ozow-payment/ozow-payment.component';
import { PayComponent } from './pay/pay.component';
import { YocoComponent } from './yoco/yoco.component'

@NgModule({
  declarations: [
    AppComponent,
    PayfastComponent,
    OzowPaymentComponent,
    PayComponent,
    YocoComponent
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
    PaymentService,
    YocoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
