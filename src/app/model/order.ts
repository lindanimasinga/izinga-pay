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
import { Basket } from './basket';
import { ShippingData } from './shippingData';


export interface Order { 
    basket: Basket;
    basketAmount?: number;
    customerId: string;
    date?: Date;
    description?: string;
    hasVat?: boolean;
    id?: string;
    messengerPaid?: boolean;
    modifiedDate?: Date;
    orderType?: Order.OrderTypeEnum;
    paymentType?: Order.PaymentTypeEnum;
    paymentTypesAllowed?: Array<Order.PaymentTypeEnum>;
    serviceFee?: number;
    shippingData: ShippingData;
    shopId: string;
    shopPaid?: boolean;
    stage?: Order.StageEnum;
    totalAmount?: number;
    freeDelivery?: boolean;
    minimumDepositAllowedPerc?: number;
    depositAmount?: number,
    tip?: number
}

export namespace Order {

    export type OrderTypeEnum = 'ONLINE' | 'INSTORE';
    export const OrderTypeEnum = {
        ONLINE: 'ONLINE' as OrderTypeEnum,
        INSTORE: 'INSTORE' as OrderTypeEnum
    };
    export type PaymentTypeEnum = 'UKHESHE' | 'CASH' | "OZOW" | "PAYFAST" | "YOCO" | "SPEED_POINT";
    export const PaymentTypeEnum = {
        UKHESHE: 'UKHESHE' as PaymentTypeEnum,
        CASH: 'CASH' as PaymentTypeEnum,
        OZOW: 'OZOW' as PaymentTypeEnum,
        PAYFAST: 'PAYFAST' as PaymentTypeEnum,
        YOCO: 'YOCO' as PaymentTypeEnum,
        SPEED_POINT: 'SPEED_POINT' as PaymentTypeEnum
    };
    export type StageEnum = 'STAGE_0_CUSTOMER_NOT_PAID' | 'STAGE_1_WAITING_STORE_CONFIRM' | 'STAGE_2_STORE_PROCESSING' | 'STAGE_3_READY_FOR_COLLECTION' | 'STAGE_4_ON_THE_ROAD' | 'STAGE_5_ARRIVED' | 'STAGE_6_WITH_CUSTOMER' | 'STAGE_7_ALL_PAID';
    export const StageEnum = {
        _0CUSTOMERNOTPAID: 'STAGE_0_CUSTOMER_NOT_PAID' as StageEnum,
        _1WAITINGSTORECONFIRM: 'STAGE_1_WAITING_STORE_CONFIRM' as StageEnum,
        _2STOREPROCESSING: 'STAGE_2_STORE_PROCESSING' as StageEnum,
        _3READYFORCOLLECTION: 'STAGE_3_READY_FOR_COLLECTION' as StageEnum,
        _4ONTHEROAD: 'STAGE_4_ON_THE_ROAD' as StageEnum,
        _5ARRIVED: 'STAGE_5_ARRIVED' as StageEnum,
        _6WITHCUSTOMER: 'STAGE_6_WITH_CUSTOMER' as StageEnum,
        _7ALLPAID: 'STAGE_7_ALL_PAID' as StageEnum
    };

    export const stageEnumText = {
        STAGE_0_CUSTOMER_NOT_PAID : "Not Paid",
        STAGE_1_WAITING_STORE_CONFIRM: "Waiting Confirmation",
        STAGE_2_STORE_PROCESSING: "Processing",
        STAGE_3_READY_FOR_COLLECTION: "Ready For Collection",
        STAGE_4_ON_THE_ROAD: "Arriving",
        STAGE_5_ARRIVED: "Arrived",
        STAGE_6_WITH_CUSTOMER: "Delivered",
        STAGE_7_ALL_PAID: "Completed"
    };
}
