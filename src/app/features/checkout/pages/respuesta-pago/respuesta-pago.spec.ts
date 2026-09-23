import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RespuestaPago } from './respuesta-pago';

describe('RespuestaPago', () => {
  let component: RespuestaPago;
  let fixture: ComponentFixture<RespuestaPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespuestaPago],
    }).compileComponents();

    fixture = TestBed.createComponent(RespuestaPago);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
