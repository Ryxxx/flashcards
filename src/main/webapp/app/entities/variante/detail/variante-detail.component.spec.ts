import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VarianteDetailComponent } from './variante-detail.component';

describe('Variante Management Detail Component', () => {
  let comp: VarianteDetailComponent;
  let fixture: ComponentFixture<VarianteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VarianteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ variante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VarianteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VarianteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load variante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.variante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
