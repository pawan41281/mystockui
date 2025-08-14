import { TestBed } from '@angular/core/testing';

import { DownloadSerivceService } from './download-serivce-service';

describe('DownloadSerivceService', () => {
  let service: DownloadSerivceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadSerivceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
