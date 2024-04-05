import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProductosBajosStockComponent } from './card-productos-bajos-stock.component';

describe('CardProductosBajosStockComponent', () => {
  let component: CardProductosBajosStockComponent;
  let fixture: ComponentFixture<CardProductosBajosStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardProductosBajosStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardProductosBajosStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
