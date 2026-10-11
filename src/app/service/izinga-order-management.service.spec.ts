import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IzingaOrderManagementService } from './izinga-order-management.service';
import { StorageService } from './storage-service.service';

describe('IzingaOrderManagementService', () => {
  let service: IzingaOrderManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StorageService, IzingaOrderManagementService]
    });
    service = TestBed.inject(IzingaOrderManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
