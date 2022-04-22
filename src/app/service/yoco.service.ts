import { Injectable } from '@angular/core';

declare var YocoSDK: any;
@Injectable({
  providedIn: 'root'
})
export class YocoService {

  inline;
  sdk

  constructor() { 
    this.ngOnInit()
  }

  ngOnInit(): void {
    this.sdk = new YocoSDK({
      publicKey: 'pk_test_ed3c54a6gOol69qa7f45'
    });
    // Create a new dropin form instance
    this.inline = this.sdk.inline({
      layout: 'basic',
      amountInCents: 2499,
      currency: 'ZAR'
    });
    // this ID matches the id of the element we created earlier.
    this.inline.mount('#card-frame');
  }

  startYocoPayment(envent: any) {
    event.preventDefault()
    // Disable the button to prevent multiple clicks while processing
    //submitButton.disabled = true;
    // This is the inline object we created earlier with the sdk
    this.inline.createToken().then(function (result) {
      // Re-enable button now that request is complete
      // (i.e. on success, on error and when auth is cancelled)
     // submitButton.disabled = false;
      if (result.error) {
        const errorMessage = result.error.message;
        errorMessage && alert("error occured: " + errorMessage);
      } else {
        const token = result;
        alert("card successfully tokenised: " + token.id);
      }
    }).catch(function (error) {
      // Re-enable button now that request is complete
     // submitButton.disabled = false;
      alert("error occured: " + error);
    });
  }
}
