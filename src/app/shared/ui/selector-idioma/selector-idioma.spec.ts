import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectorIdioma } from './selector-idioma';

describe('SelectorIdioma', () => {
  let component: SelectorIdioma;
  let fixture: ComponentFixture<SelectorIdioma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorIdioma],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorIdioma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
