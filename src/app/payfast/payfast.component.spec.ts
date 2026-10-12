import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PayfastComponent } from './payfast.component';
import { StorageService } from '../service/storage-service.service';

describe('PayfastComponent', () => {
  let component: PayfastComponent;
  let fixture: ComponentFixture<PayfastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayfastComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [StorageService]
    }).compileComponents();

    fixture = TestBed.createComponent(PayfastComponent);
    component = fixture.componentInstance;
    // PayfastComponent.ngOnInit reads this.order — provide a minimal stub before detectChanges
    component.order = { id: 'stub', totalAmount: 100, depositAmount: 50, minimumDepositAllowedPerc: 1 } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
