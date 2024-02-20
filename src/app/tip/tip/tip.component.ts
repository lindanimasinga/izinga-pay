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
  tipAmount: number
  tippingStore: StoreProfile

  constructor(private izingaService: IzingaOrderManagementService,  private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log(`Loading messanger details...`)
    this.route.queryParams.subscribe(queryParamMap => {
      this.messangerId = queryParamMap['messengerId']
      this.izingaService.getCustomerById(this.messangerId)
        .subscribe(mssg => this.messanger = mssg)
    })

    this.izingaService.getStoreById(environment.tipStoreId)
      .subscribe(store => this.tippingStore = store)
  }
  
  startYocoPayment() {
    console.log(`loading payment screen.. ${this.tipAmount}`)
    var stock = this.tippingStore.stockList[0]
    var order: Order = {
      shopId: this.tippingStore.id,
      orderType: Order.OrderTypeEnum.ONLINE,
      tip: 100,
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
        toAddress: "Shop 38, Arbour Crossing Retail Centre, 2 Oppenheimer Rd, Durban, 4126",
        buildingType: ShippingData.BuildingTypeEnum.HOUSE,
        messengerId: this.messangerId,
        additionalInstructions:  "",
        type: ShippingData.TypeEnum.DELIVERY
      }
    }
    this.izingaService.startOrder(order)
      .subscribe(order => {
        console.log("Tipping Order initiated... Redirecting to payment screen")
        this.router.navigate([''], { queryParams: {"TransactionReference": order.id, "status": "init", "type": "yoco"} })
      })
  }
}
