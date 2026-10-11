import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SucessComponent } from './sucess.component';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';

describe('SucessComponent', () => {
  let component: SucessComponent;
  let fixture: ComponentFixture<SucessComponent>;

  const mockOrder = {
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

  function createRoute(id: string, ref: string | null) {
    return {
      snapshot: {
        paramMap: convertToParamMap({ id }),
        queryParamMap: convertToParamMap(ref ? { ref } : {})
      }
    };
  }

  async function createComponent(id: string, ref: string | null) {
    await TestBed.configureTestingModule({
      declarations: [SucessComponent],
      providers: [
        { provide: IzingaOrderManagementService, useValue: mockOrderService },
        { provide: ActivatedRoute, useValue: createRoute(id, ref) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    mockOrderService.getOrderById.calls.reset();
    if (component) {
      component.ngOnDestroy();
    }
  });

  it('should create with no ref param', async () => {
    await createComponent('TEST01', null);
    expect(component).toBeTruthy();
  });

  it('should fetch the order by id on construction', async () => {
    await createComponent('TEST01', null);
    expect(mockOrderService.getOrderById).toHaveBeenCalledWith('TEST01');
    expect(component.order).toEqual(mockOrder as any);
  });

  it('should set redirectRef when ref query param is present', async () => {
    await createComponent('TEST01', 'https://example.co.za/order/TEST01');
    expect(component.redirectRef).toBe('https://example.co.za/order/TEST01');
  });

  it('should leave redirectRef null when ref query param is absent', async () => {
    await createComponent('TEST01', null);
    expect(component.redirectRef).toBeNull();
  });

  it('should schedule a timer when redirectRef is set', fakeAsync(async () => {
    await createComponent('TEST01', 'https://example.co.za/order/TEST01');
    expect(component['_redirectTimer']).not.toBeNull();
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));

  it('should not schedule a timer when redirectRef is absent', fakeAsync(async () => {
    await createComponent('TEST01', null);
    tick(3000);
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('continue() should clear the pending timer', fakeAsync(async () => {
    await createComponent('TEST01', 'https://example.co.za/order/TEST01');
    expect(component['_redirectTimer']).not.toBeNull();
    component.continue();
    expect(component['_redirectTimer']).toBeNull();
    discardPeriodicTasks();
  }));

  it('ngOnDestroy() should clear the timer and be idempotent', fakeAsync(async () => {
    await createComponent('TEST01', 'https://example.co.za/order/TEST01');
    component.ngOnDestroy();
    expect(component['_redirectTimer']).toBeNull();
    // Second call should not throw
    expect(() => component.ngOnDestroy()).not.toThrow();
    discardPeriodicTasks();
  }));

  it('getDanceFile() should return a lottie.host URL', async () => {
    await createComponent('TEST01', null);
    const url = component.getDanceFile();
    expect(url).toMatch(/^https:\/\/lottie\.host\//);
  });
});
