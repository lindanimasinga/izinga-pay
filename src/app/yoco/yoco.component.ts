import { Component, Inject, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';
import { YocoPaymentInitiate } from '../model/yoco-payment-initiate';
import { IzingaOrderManagementService } from '../service/izinga-order-management.service';

declare var YocoSDK: any;

@Component({
  selector: 'app-yoco',
  templateUrl: './yoco.component.html',
  styleUrls: ['./yoco.component.css']
})
export class YocoComponent {

  inline;
  sdk
  orderSuccessful

  @Input()
  order: Order

  @Input()
  callBackUrl: string

  isBusy = false

  payOndeliery = false

  constructor(private orderService: IzingaOrderManagementService) { }

  startCODPayment() {
    this.order.paymentType = Order.PaymentTypeEnum.SPEED_POINT
    this.finishOrder()
  }

  startYocoPayment() {
    var yocoData: YocoPaymentInitiate = {
       amount: this.order.totalAmount,
       successUrl: `${this.callBackUrl}/order/${this.order.id}`,
       metadata : {
        orderId: this.order.id
       }
    }
    this.isBusy = true
    this.orderService.initialiseYocoPayment(yocoData).subscribe(resp => {
      window.location.href = resp.redirectUrl
    })
  }

  finishOrder() {
    this.orderService.finishOrder(this.order)
    .subscribe(order => {
      this.order = order
      this.orderSuccessful = true

      if(this.callBackUrl) {
        window.location.href = `${this.callBackUrl}/order/${order.id}`
      } else window.close()

      this.isBusy = false
    }, error => {
      var errorMessage = this.resolveError(error.error.message)
      alert("error occured: " + errorMessage);
      this.isBusy = false
    }, () => {
      this.isBusy = false
    })
  }

  resolveError(error: string) {
    var message = error
    if(error.startsWith("400 Bad Request:") || error.startsWith("500 Internal Server Error")) {
      var errorString = error.replace("400 Bad Request:", "").replace("500 Internal Server Error", "").trim()
      var json = JSON.parse(errorString.replace("\\\"", "\""))
      console.log(json)
      message = json[0].displayMessage
    }
    return message
  }

  payOnDeliveryAllowed() {
    return this.order.paymentTypesAllowed != null && this.order.paymentTypesAllowed.filter(item => item == Order.PaymentTypeEnum.SPEED_POINT).length > 0
  }
}
