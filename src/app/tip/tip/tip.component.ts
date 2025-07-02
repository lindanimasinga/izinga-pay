import { BuiltinType, BuiltinTypeName } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order';
import { ShippingData } from 'src/app/model/shippingData';
import { StoreProfile } from 'src/app/model/storeProfile';
import { UserProfile } from 'src/app/model/userProfile';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class TipComponent {

  messanger: UserProfile
  messangerId: string
  cardId: string
  tipAmount: number = 0
  tippingStore: StoreProfile
  mobileNumber: string;

  constructor(private izingaService: IzingaOrderManagementService,  private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log(`Loading messanger details...`)
    this.route.queryParams.subscribe(queryParamMap => {
      this.messangerId = queryParamMap['messengerId']
      this.cardId = queryParamMap['linkCode']

      if(this.messangerId) {
        this.getCustomer(this.messangerId)
      } else if (this.cardId) {
        this.izingaService.getLinkedUserToCard(this.cardId)
        .subscribe(mssg => {
            if(mssg) {
              this.messangerId = mssg.userId 
              this.getCustomer(mssg.userId)
            } else window.location.href = 'https://onboard.izinga.co.za'
        })
      } else {
        console.error("No user Id or cardId provided")
      }
    })

    this.izingaService.getStoreById(environment.tipStoreId)
      .subscribe(store => this.tippingStore = store)
  }
  
  startYocoPayment() {
    
    if(this.tipAmount < 10 || this.tipAmount > 3000) {
      return
    }

    console.log(`loading payment screen.. ${this.tipAmount}`)
    var stock = this.tippingStore.stockList[0]
    var order: Order = {
      shopId: this.tippingStore.id,
      orderType: Order.OrderTypeEnum.INSTORE,
      tip: this.tipAmount,
      basket : {
        items : [
          {
            name:  stock.name,
            image: stock.images[0],
            price: this.tipAmount,
            quantity: 1,
            options: []
          }
        ]
      },
      customerId: "650f5078-10aa-4f98-b6e3-eac2fbd276ad",
      shippingData: {
        fromAddress: this.tippingStore.name,
        toAddress: this.messanger.name,
        buildingType: ShippingData.BuildingTypeEnum.HOUSE,
        messengerId: this.messanger.id,
        additionalInstructions:  "",
        type: ShippingData.TypeEnum.DELIVERY
      }
    }
    this.izingaService.startOrder(order)
      .subscribe(order => {
        console.log("Tipping Order initiated... Redirecting to payment screen")
        this.router.navigate([''], { queryParams: {"TransactionReference": order.id, "status": "init", "type": "yoco", "callback": window.location.origin} })
      })
  }

  getCustomer(messangerId: string) {
    this.izingaService.getCustomerById(messangerId)
          .subscribe(mssg => this.messanger = mssg)
  }

  lookupMessengerByMobile() {
    if(!this.mobileNumber) {
      console.error("No mobile number provided")
      return
    }
    this.izingaService.getCustomerByPhoneNumber(this.mobileNumber)
      .subscribe(mssg => {
        if(mssg) {
          this.messanger = mssg
        } else {
          console.error("No messenger found with the provided mobile number")
        }
      })
  }
}

