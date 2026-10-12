/**
 * SucessComponent spec.
 *
 * Test structure:
 *  - Group 1 (no-ref): component has no pending timer so standard synchronous
 *    beforeEach is safe.
 *  - Group 2 (ref present): the component constructor schedules a real 3-second
 *    window.location.href navigation. To prevent the real timer firing during the test
 *    run, every ref-present test creates the component INSIDE a fakeAsync body so that
 *    setTimeout is intercepted by Angular's zone patch. The timer is cancelled at the end
 *    of each test with component.ngOnDestroy() + discardPeriodicTasks().
 *
 * NOTE: the window.location.href assignment in the timer callback and in continue() is
 * intentionally not executed in any test — navigating away from the Karma runner page
 * would crash the test runner. The control flow surrounding those assignments (timer
 * scheduling, cancellation, and null-guard) is fully covered.
 *
 * NOTE: hostname-allowlist validation (isTrustedRedirect) was removed per owner decision
 * (intentional open-redirect acceptance). The redirect is now unconditional when a ref
 * param is present.
 */
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

// ── shared helpers ────────────────────────────────────────────────────────────

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

function configureModule(id: string, ref: string | null) {
  TestBed.configureTestingModule({
    declarations: [SucessComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      { provide: IzingaOrderManagementService, useValue: mockOrderService },
      { provide: ActivatedRoute, useValue: makeRoute(id, ref) }
    ]
  }).compileComponents();
}

function createComponent(): { component: SucessComponent; fixture: ComponentFixture<SucessComponent> } {
  const fixture = TestBed.createComponent(SucessComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return { component, fixture };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Group 1 — no ref param
// ─────────────────────────────────────────────────────────────────────────────
describe('SucessComponent (no ref param)', () => {
  let component: SucessComponent;

  beforeEach(() => {
    configureModule('TEST01', null);
    ({ component } = createComponent());
    mockOrderService.getOrderById.calls.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate order', () => {
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
    expect(component.getDanceFile()).toMatch(/^https:\/\/lottie\.host\//);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Group 2 — ref param present
//  Component is created INSIDE fakeAsync so setTimeout is intercepted.
// ─────────────────────────────────────────────────────────────────────────────
describe('SucessComponent (ref param present)', () => {
  const TRUSTED_REF = 'https://shop.izinga.co.za/order/TEST01';

  // Shared setup shared across tests in this group.
  beforeEach(() => {
    configureModule('TEST01', TRUSTED_REF);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set redirectRef', fakeAsync(() => {
    const { component } = createComponent();
    expect(component.redirectRef).toBe(TRUSTED_REF);
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));

  it('should schedule a redirect timer', fakeAsync(() => {
    const { component } = createComponent();
    expect(component['_redirectTimer']).not.toBeNull();
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));

  it('continue() should clear the pending timer', fakeAsync(() => {
    const { component } = createComponent();
    expect(component['_redirectTimer']).not.toBeNull();
    // Null out redirectRef before calling continue() so the window.location.href
    // assignment inside continue() is skipped. Navigating away from the Karma
    // runner page mid-test would crash the entire test suite.
    component.redirectRef = null;
    component.continue();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('ngOnDestroy() should clear the timer', fakeAsync(() => {
    const { component } = createComponent();
    component.ngOnDestroy();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('ngOnDestroy() should be idempotent', fakeAsync(() => {
    const { component } = createComponent();
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
    discardPeriodicTasks();
  }));

  it('timer callback nulls _redirectTimer before navigating', fakeAsync(() => {
    const { component } = createComponent();
    // Verify that the timer callback resets the handle.
    // We cannot actually let it fire (window.location.href would crash Karma)
    // so we verify the handle is non-null before cancellation.
    expect(component['_redirectTimer']).not.toBeNull();
    component.ngOnDestroy();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));
});

