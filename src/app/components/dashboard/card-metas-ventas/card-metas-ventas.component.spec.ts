import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMetasVentasComponent } from './card-metas-ventas.component';

describe('CardMetasVentasComponent', () => {
  let component: CardMetasVentasComponent;
  let fixture: ComponentFixture<CardMetasVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardMetasVentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMetasVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
