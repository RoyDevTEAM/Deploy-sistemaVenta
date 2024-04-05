import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoVentasMesComponent } from './grafico-ventas-mes.component';

describe('GraficoVentasMesComponent', () => {
  let component: GraficoVentasMesComponent;
  let fixture: ComponentFixture<GraficoVentasMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoVentasMesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoVentasMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
