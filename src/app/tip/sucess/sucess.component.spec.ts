import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SucessComponent } from './sucess.component';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';

const mockOrder: any = {
  id: 'TEST01',
  totalAmount: 150,
  serviceFee: 10,
  freeDelivery: true,
  basket: { items: [] },
  shippingData: { fee: 0 }
};

const mockOrderService = {
  getOrderById: jasmine.createSpy('getOrderById').and.returnValue(of(mockOrder))
};

function makeRoute(id: string, ref: string | null) {
  return {
    snapshot: {
      paramMap: convertToParamMap({ id }),
      queryParamMap: convertToParamMap(ref ? { ref } : {})
    }
  };
}

function buildTestBed(id: string, ref: string | null) {
  TestBed.configureTestingModule({
    declarations: [SucessComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      { provide: IzingaOrderManagementService, useValue: mockOrderService },
      { provide: ActivatedRoute, useValue: makeRoute(id, ref) }
    ]
  }).compileComponents();
}

// ─────────────────────────────────────────────────────────────
//  Group 1 — no ref param
// ─────────────────────────────────────────────────────────────
describe('SucessComponent (no ref param)', () => {
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  beforeEach(() => {
    buildTestBed('TEST01', null);
    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockOrderService.getOrderById.calls.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the order by id', () => {
    // detectChanges triggers ngOnInit-equivalent in the constructor
    expect(component.order).toEqual(mockOrder);
  });

  it('redirectRef should be null', () => {
    expect(component.redirectRef).toBeNull();
  });

  it('no timer should be scheduled', fakeAsync(() => {
    tick(3000);
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('getDanceFile() should return a lottie.host URL', () => {
    const url = component.getDanceFile();
    expect(url).toMatch(/^https:\/\/lottie\.host\//);
  });
});

// ─────────────────────────────────────────────────────────────
//  Group 2 — trusted ref param
// ─────────────────────────────────────────────────────────────
describe('SucessComponent (trusted ref param)', () => {
  const TRUSTED_REF = 'https://shop.izinga.co.za/order/TEST01';
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  beforeEach(() => {
    buildTestBed('TEST01', TRUSTED_REF);
    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should set redirectRef', () => {
    expect(component.redirectRef).toBe(TRUSTED_REF);
  });

  it('should schedule a redirect timer', fakeAsync(() => {
    expect(component['_redirectTimer']).not.toBeNull();
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));

  it('continue() should clear the timer', fakeAsync(() => {
    expect(component['_redirectTimer']).not.toBeNull();
    component.continue();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('ngOnDestroy() should clear the timer', fakeAsync(() => {
    component.ngOnDestroy();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('ngOnDestroy() should be idempotent', fakeAsync(() => {
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
    discardPeriodicTasks();
  }));
});

// ─────────────────────────────────────────────────────────────
//  Group 3 — untrusted ref param
// ─────────────────────────────────────────────────────────────
describe('SucessComponent (untrusted ref param)', () => {
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  beforeEach(() => {
    buildTestBed('TEST01', 'https://phishing.example.com/steal');
    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('redirectRef should remain null for an untrusted URL', () => {
    expect(component.redirectRef).toBeNull();
  });

  it('no timer should be scheduled for an untrusted URL', fakeAsync(() => {
    tick(3000);
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));
});

// ─────────────────────────────────────────────────────────────
//  Group 4 — isTrustedRedirect() unit tests
// ─────────────────────────────────────────────────────────────
describe('SucessComponent.isTrustedRedirect()', () => {
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  beforeEach(() => {
    buildTestBed('TEST01', null);
    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should accept allowed hostnames', () => {
    expect(component.isTrustedRedirect('https://shop.izinga.co.za/order/X')).toBeTrue();
    expect(component.isTrustedRedirect('https://furniture.izinga.co.za/order/X')).toBeTrue();
    expect(component.isTrustedRedirect('https://ingalabesi.co.za/order/X')).toBeTrue();
    expect(component.isTrustedRedirect('https://pay.izinga.co.za/order/X')).toBeTrue();
    expect(component.isTrustedRedirect('https://izinga.co.za/order/X')).toBeTrue();
  });

  it('should reject untrusted hostnames', () => {
    expect(component.isTrustedRedirect('https://phishing.com/fake')).toBeFalse();
    expect(component.isTrustedRedirect('https://evil.izinga.co.za.attacker.com/x')).toBeFalse();
  });

  it('should reject javascript: and data: URIs', () => {
    expect(component.isTrustedRedirect('javascript:alert(1)')).toBeFalse();
    expect(component.isTrustedRedirect('data:text/html,<script>alert(1)</script>')).toBeFalse();
  });

  it('should reject malformed input', () => {
    expect(component.isTrustedRedirect('not-a-url')).toBeFalse();
    expect(component.isTrustedRedirect('')).toBeFalse();
  });
});
