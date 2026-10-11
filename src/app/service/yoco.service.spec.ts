import { TestBed } from '@angular/core/testing';
import { YocoService } from './yoco.service';

describe('YocoService', () => {
  let service: YocoService;

  beforeAll(() => {
    // YocoSDK is a global loaded via CDN <script> tag in index.html and is not
    // available in the headless test environment. Stub it so YocoService can
    // be instantiated without throwing.
    (window as any).YocoSDK = function() {
      return { inline: () => ({ mount: () => {} }) };
    };
  });

  afterAll(() => {
    delete (window as any).YocoSDK;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YocoService]
    });
    service = TestBed.inject(YocoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
