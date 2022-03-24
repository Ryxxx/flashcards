import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FlashCardsDetailComponent } from './flash-cards-detail.component';

describe('FlashCards Management Detail Component', () => {
  let comp: FlashCardsDetailComponent;
  let fixture: ComponentFixture<FlashCardsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlashCardsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ flashCards: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FlashCardsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FlashCardsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load flashCards on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.flashCards).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
