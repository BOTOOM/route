import { TestBed } from '@angular/core/testing';

import { GeoipService } from './geoip.service';

describe('GeoipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoipService = TestBed.get(GeoipService);
    expect(service).toBeTruthy();
  });
});
