import { TestBed } from '@angular/core/testing';

import { ChirpService } from './chirp.service';

describe('ChirpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChirpService = TestBed.get(ChirpService);
    expect(service).toBeTruthy();
  });
});
