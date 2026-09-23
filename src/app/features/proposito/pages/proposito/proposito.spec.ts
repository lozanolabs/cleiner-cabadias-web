import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Proposito } from './proposito';

describe('Proposito', () => {
  let component: Proposito;
  let fixture: ComponentFixture<Proposito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proposito],
    }).compileComponents();

    fixture = TestBed.createComponent(Proposito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
