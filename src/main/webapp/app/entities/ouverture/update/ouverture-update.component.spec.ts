jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OuvertureService } from '../service/ouverture.service';
import { IOuverture, Ouverture } from '../ouverture.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { OuvertureUpdateComponent } from './ouverture-update.component';

describe('Component Tests', () => {
  describe('Ouverture Management Update Component', () => {
    let comp: OuvertureUpdateComponent;
    let fixture: ComponentFixture<OuvertureUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ouvertureService: OuvertureService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OuvertureUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OuvertureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OuvertureUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ouvertureService = TestBed.inject(OuvertureService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const ouverture: IOuverture = { id: 456 };
        const userId: IUser = { id: 49893 };
        ouverture.userId = userId;

        const userCollection: IUser[] = [{ id: 19127 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [userId];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ ouverture });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ouverture: IOuverture = { id: 456 };
        const userId: IUser = { id: 7369 };
        ouverture.userId = userId;

        activatedRoute.data = of({ ouverture });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ouverture));
        expect(comp.usersSharedCollection).toContain(userId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ouverture>>();
        const ouverture = { id: 123 };
        jest.spyOn(ouvertureService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ouverture });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ouverture }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ouvertureService.update).toHaveBeenCalledWith(ouverture);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ouverture>>();
        const ouverture = new Ouverture();
        jest.spyOn(ouvertureService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ouverture });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ouverture }));
        saveSubject.complete();

        // THEN
        expect(ouvertureService.create).toHaveBeenCalledWith(ouverture);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ouverture>>();
        const ouverture = { id: 123 };
        jest.spyOn(ouvertureService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ouverture });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ouvertureService.update).toHaveBeenCalledWith(ouverture);
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
});
