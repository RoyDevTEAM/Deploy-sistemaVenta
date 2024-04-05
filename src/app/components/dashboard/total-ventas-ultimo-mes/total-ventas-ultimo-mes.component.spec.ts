import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVentasUltimoMesComponent } from './total-ventas-ultimo-mes.component';

describe('TotalVentasUltimoMesComponent', () => {
  let component: TotalVentasUltimoMesComponent;
  let fixture: ComponentFixture<TotalVentasUltimoMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalVentasUltimoMesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalVentasUltimoMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
