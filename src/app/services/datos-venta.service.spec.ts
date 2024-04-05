import { TestBed } from '@angular/core/testing';

import { DatosVentaService } from './datos-venta.service';

describe('DatosVentaService', () => {
  let service: DatosVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
