import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasComponent } from './ofertas.component';

describe('OfertasComponent', () => {
  let component: OfertasComponent;
  let fixture: ComponentFixture<OfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
