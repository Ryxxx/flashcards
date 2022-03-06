import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OuvertureDetailComponent } from './ouverture-detail.component';

describe('Ouverture Management Detail Component', () => {
  let comp: OuvertureDetailComponent;
  let fixture: ComponentFixture<OuvertureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OuvertureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ouverture: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OuvertureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OuvertureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ouverture on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ouverture).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
