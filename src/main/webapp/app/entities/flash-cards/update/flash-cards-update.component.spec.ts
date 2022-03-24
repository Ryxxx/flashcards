import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FlashCardsService } from '../service/flash-cards.service';
import { IFlashCards, FlashCards } from '../flash-cards.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FlashCardsUpdateComponent } from './flash-cards-update.component';

describe('FlashCards Management Update Component', () => {
  let comp: FlashCardsUpdateComponent;
  let fixture: ComponentFixture<FlashCardsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let flashCardsService: FlashCardsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FlashCardsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FlashCardsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FlashCardsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    flashCardsService = TestBed.inject(FlashCardsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const flashCards: IFlashCards = { id: 456 };
      const userId: IUser = { id: 52769 };
      flashCards.userId = userId;

      const userCollection: IUser[] = [{ id: 7436 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userId];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ flashCards });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const flashCards: IFlashCards = { id: 456 };
      const userId: IUser = { id: 78621 };
      flashCards.userId = userId;

      activatedRoute.data = of({ flashCards });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(flashCards));
      expect(comp.usersSharedCollection).toContain(userId);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FlashCards>>();
      const flashCards = { id: 123 };
      jest.spyOn(flashCardsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashCards });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flashCards }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(flashCardsService.update).toHaveBeenCalledWith(flashCards);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FlashCards>>();
      const flashCards = new FlashCards();
      jest.spyOn(flashCardsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashCards });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flashCards }));
      saveSubject.complete();

      // THEN
      expect(flashCardsService.create).toHaveBeenCalledWith(flashCards);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FlashCards>>();
      const flashCards = { id: 123 };
      jest.spyOn(flashCardsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashCards });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(flashCardsService.update).toHaveBeenCalledWith(flashCards);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
