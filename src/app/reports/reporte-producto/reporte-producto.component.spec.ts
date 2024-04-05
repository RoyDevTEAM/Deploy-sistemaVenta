import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProductoComponent } from './reporte-producto.component';

describe('ReporteProductoComponent', () => {
  let component: ReporteProductoComponent;
  let fixture: ComponentFixture<ReporteProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
