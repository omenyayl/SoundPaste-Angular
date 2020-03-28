import { TestBed } from '@angular/core/testing';

import { AesService } from './aes.service';

describe('AesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AesService = TestBed.get(AesService);
    expect(service).toBeTruthy();
  });
});
