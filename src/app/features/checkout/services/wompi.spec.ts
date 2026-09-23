import { TestBed } from '@angular/core/testing';
import { Wompi } from './wompi';

describe('Wompi', () => {
  let service: Wompi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wompi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
