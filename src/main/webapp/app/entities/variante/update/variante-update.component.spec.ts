import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VarianteService } from '../service/variante.service';
import { IVariante, Variante } from '../variante.model';
import { IOuverture } from 'app/entities/ouverture/ouverture.model';
import { OuvertureService } from 'app/entities/ouverture/service/ouverture.service';

import { VarianteUpdateComponent } from './variante-update.component';

describe('Variante Management Update Component', () => {
  let comp: VarianteUpdateComponent;
  let fixture: ComponentFixture<VarianteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let varianteService: VarianteService;
  let ouvertureService: OuvertureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VarianteUpdateComponent],
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
      .overrideTemplate(VarianteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VarianteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    varianteService = TestBed.inject(VarianteService);
    ouvertureService = TestBed.inject(OuvertureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ouverture query and add missing value', () => {
      const variante: IVariante = { id: 456 };
      const ouverture: IOuverture = { id: 25674 };
      variante.ouverture = ouverture;

      const ouvertureCollection: IOuverture[] = [{ id: 64308 }];
      jest.spyOn(ouvertureService, 'query').mockReturnValue(of(new HttpResponse({ body: ouvertureCollection })));
      const additionalOuvertures = [ouverture];
      const expectedCollection: IOuverture[] = [...additionalOuvertures, ...ouvertureCollection];
      jest.spyOn(ouvertureService, 'addOuvertureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ variante });
      comp.ngOnInit();

      expect(ouvertureService.query).toHaveBeenCalled();
      expect(ouvertureService.addOuvertureToCollectionIfMissing).toHaveBeenCalledWith(ouvertureCollection, ...additionalOuvertures);
      expect(comp.ouverturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const variante: IVariante = { id: 456 };
      const ouverture: IOuverture = { id: 87860 };
      variante.ouverture = ouverture;

      activatedRoute.data = of({ variante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(variante));
      expect(comp.ouverturesSharedCollection).toContain(ouverture);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Variante>>();
      const variante = { id: 123 };
      jest.spyOn(varianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ variante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: variante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(varianteService.update).toHaveBeenCalledWith(variante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Variante>>();
      const variante = new Variante();
      jest.spyOn(varianteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ variante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: variante }));
      saveSubject.complete();

      // THEN
      expect(varianteService.create).toHaveBeenCalledWith(variante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Variante>>();
      const variante = { id: 123 };
      jest.spyOn(varianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ variante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(varianteService.update).toHaveBeenCalledWith(variante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOuvertureById', () => {
      it('Should return tracked Ouverture primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOuvertureById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
