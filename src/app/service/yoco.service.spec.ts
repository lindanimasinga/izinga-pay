import { TestBed } from '@angular/core/testing';

import { YocoService } from './yoco.service';

describe('YocoService', () => {
  let service: YocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YocoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
