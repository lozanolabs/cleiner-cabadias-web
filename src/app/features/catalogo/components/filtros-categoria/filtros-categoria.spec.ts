import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltrosCategoria } from './filtros-categoria';

describe('FiltrosCategoria', () => {
  let component: FiltrosCategoria;
  let fixture: ComponentFixture<FiltrosCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosCategoria],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
