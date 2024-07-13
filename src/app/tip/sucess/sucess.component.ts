import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/order';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.css']
})
export class SucessComponent {

  order: Order

  constructor(private izingaService: IzingaOrderManagementService, activatedRoute: ActivatedRoute) {
      var orderId = activatedRoute.snapshot.paramMap.get('id');
      this.izingaService.getOrderById(orderId).subscribe(order => this.order = order)
  }

  getDanceFile() {
    var random = Math.random() * 3
    var file = "https://lottie.host/3b2b08ed-2c8f-4296-9a7e-fb39d0e48aa2/9MD0ZD3xpt.json"
    if (random >=1 ) {
      file = "https://lottie.host/353e9521-51e3-4830-aec9-dd16f10ba7ef/YsB7e7XBAq.json"
    }
    return file
  }

}
