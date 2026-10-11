import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UkhesheService } from './ukheshe.service';
import { StorageService } from './storage-service.service';

describe('UkhesheService', () => {
  let service: UkhesheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StorageService, UkhesheService]
    });
    service = TestBed.inject(UkhesheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
