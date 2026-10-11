import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { YocoComponent } from './yoco.component';
import { IzingaOrderManagementService } from '../service/izinga-order-management.service';
import { StorageService } from '../service/storage-service.service';

describe('YocoComponent', () => {
  let component: YocoComponent;
  let fixture: ComponentFixture<YocoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YocoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        StorageService,
        {
          provide: IzingaOrderManagementService,
          useValue: { getStoreById: () => of({ storeType: 'TIPS' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YocoComponent);
    component = fixture.componentInstance;
    // YocoComponent.loadShop() requires component.order — set a minimal stub before detectChanges
    component.order = { id: 'stub', shopId: 'stub-shop' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
