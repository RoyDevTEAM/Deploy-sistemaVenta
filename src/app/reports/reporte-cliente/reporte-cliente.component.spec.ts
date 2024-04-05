import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteClienteComponent } from './reporte-cliente.component';

describe('ReporteClienteComponent', () => {
  let component: ReporteClienteComponent;
  let fixture: ComponentFixture<ReporteClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
