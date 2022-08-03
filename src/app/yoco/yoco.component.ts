import { Component, Inject, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';
import { IzingaOrderManagementService } from '../service/izinga-order-management.service';

declare var YocoSDK: any;

@Component({
  selector: 'app-yoco',
  templateUrl: './yoco.component.html',
  styleUrls: ['./yoco.component.css']
})
export class YocoComponent implements OnInit {

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

  ngOnInit(): void {
    setTimeout(() => {
      this.sdk = new YocoSDK({
        publicKey: environment.yoco_public_key
      });
      // Create a new dropin form instance
      this.inline = this.sdk.inline({
        layout: 'basic',
        amountInCents: this.order.totalAmount * 100,
        currency: 'ZAR'
      });
      // this ID matches the id of the element we created earlier.
      this.inline.mount('#card-frame');
    }, 100)
  }

  startCODPayment() {
    this.order.paymentType = Order.PaymentTypeEnum.SPEED_POINT
    this.finishOrder()
  }

  startYocoPayment(envent: any) {
    event.preventDefault()
    // Disable the button to prevent multiple clicks while processing
    //submitButton.disabled = true;
    // This is the inline object we created earlier with the sdk
    this.isBusy = true
    this.inline.createToken().then( (result) => {
      // Re-enable button now that request is complete
      // (i.e. on success, on error and when auth is cancelled)
     // submitButton.disabled = false;
      if (result.error) {
        const errorMessage = result.error.message;
        errorMessage && alert("error occured: " + errorMessage);
        this.isBusy = false
      } else {
        const token = result;
        console.log(`token is ${token.id}`)
        this.order.description = `yoco-${token}`
        this.order.paymentType = Order.PaymentTypeEnum.YOCO
        this.finishOrder()
      }
    }).catch(function (error) {
      // Re-enable button now that request is complete
     // submitButton.disabled = false;
      this.isBusy = false
      alert("error occured: " + error);
    });
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
}
