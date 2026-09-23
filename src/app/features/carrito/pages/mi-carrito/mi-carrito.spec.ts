import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCarrito } from './mi-carrito';

describe('MiCarrito', () => {
  let component: MiCarrito;
  let fixture: ComponentFixture<MiCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiCarrito],
    }).compileComponents();

    fixture = TestBed.createComponent(MiCarrito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
