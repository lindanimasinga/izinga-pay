/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export class YocoPaymentInitiate { 
    amount?: number
    currency?: string = "ZAR"
    successUrl?: string
    metadata?: YocoPaymentMetadata
}

export class YocoPaymentMetadata {
    checkoutId?: string
    orderId?: string
}

export class YocoPaymentInitiateResponse { 
    redirectUrl?: string
    id?: string
    status?: string
}