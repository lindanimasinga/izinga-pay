import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/order';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.css']
})
export class SucessComponent implements OnDestroy {

  order: Order
  redirectRef: string | null = null
  private _redirectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private izingaService: IzingaOrderManagementService, activatedRoute: ActivatedRoute) {
      var orderId = activatedRoute.snapshot.paramMap.get('id');
      this.izingaService.getOrderById(orderId).subscribe(order => this.order = order)

      const rawRef = activatedRoute.snapshot.queryParamMap.get('ref');
      if (rawRef && this.isTrustedRedirect(rawRef)) {
        this.redirectRef = rawRef;
        this._redirectTimer = setTimeout(() => {
          this._redirectTimer = null;
          window.location.href = this.redirectRef;
        }, 3000);
      }
  }

  /** Validates that a redirect URL's hostname is in the configured allowlist. */
  isTrustedRedirect(url: string): boolean {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      return environment.allowedRedirectHosts.some(
        allowed => host === allowed || host.endsWith('.' + allowed)
      );
    } catch {
      return false;
    }
  }

  continue() {
    if (this._redirectTimer !== null) {
      clearTimeout(this._redirectTimer);
      this._redirectTimer = null;
    }
    if (this.redirectRef) {
      window.location.href = this.redirectRef;
    }
  }

  ngOnDestroy() {
    if (this._redirectTimer !== null) {
      clearTimeout(this._redirectTimer);
      this._redirectTimer = null;
    }
  }

  getDanceFile() {
    var random = Math.random() * 3
    var file = "https://lottie.host/3b2b08ed-2c8f-4296-9a7e-fb39d0e48aa2/9MD0ZD3xpt.json"
    if (random >= 1) {
      file = "https://lottie.host/353e9521-51e3-4830-aec9-dd16f10ba7ef/YsB7e7XBAq.json"
    }
    return file
  }

}
