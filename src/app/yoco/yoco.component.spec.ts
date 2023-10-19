import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YocoComponent } from './yoco.component';

describe('YocoComponent', () => {
  let component: YocoComponent;
  let fixture: ComponentFixture<YocoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YocoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
