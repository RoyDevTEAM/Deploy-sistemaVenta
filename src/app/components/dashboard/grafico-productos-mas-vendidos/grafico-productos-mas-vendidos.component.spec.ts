import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoProductosMasVendidosComponent } from './grafico-productos-mas-vendidos.component';

describe('GraficoProductosMasVendidosComponent', () => {
  let component: GraficoProductosMasVendidosComponent;
  let fixture: ComponentFixture<GraficoProductosMasVendidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoProductosMasVendidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoProductosMasVendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
