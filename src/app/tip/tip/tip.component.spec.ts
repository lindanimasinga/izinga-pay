import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TipComponent } from './tip.component';
import { IzingaOrderManagementService } from 'src/app/service/izinga-order-management.service';

describe('TipComponent', () => {
  let component: TipComponent;
  let fixture: ComponentFixture<TipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipComponent],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: IzingaOrderManagementService,
          useValue: { getStoreById: () => of(null), getCustomerById: () => of(null), getCustomerByPhoneNumber: () => of(null), getLinkedUserToCard: () => of(null) }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({}), queryParamMap: convertToParamMap({}) },
            queryParams: of({})
          }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
