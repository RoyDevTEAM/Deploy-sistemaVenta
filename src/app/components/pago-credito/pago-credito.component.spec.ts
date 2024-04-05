import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoCreditoComponent } from './pago-credito.component';

describe('PagoCreditoComponent', () => {
  let component: PagoCreditoComponent;
  let fixture: ComponentFixture<PagoCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoCreditoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagoCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
