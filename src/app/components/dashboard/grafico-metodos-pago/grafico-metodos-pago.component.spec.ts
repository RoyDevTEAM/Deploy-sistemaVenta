import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoMetodosPagoComponent } from './grafico-metodos-pago.component';

describe('GraficoMetodosPagoComponent', () => {
  let component: GraficoMetodosPagoComponent;
  let fixture: ComponentFixture<GraficoMetodosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoMetodosPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoMetodosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
