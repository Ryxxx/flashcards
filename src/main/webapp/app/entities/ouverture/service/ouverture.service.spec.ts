import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Couleur } from 'app/entities/enumerations/couleur.model';
import { IOuverture, Ouverture } from '../ouverture.model';

import { OuvertureService } from './ouverture.service';

describe('Service Tests', () => {
  describe('Ouverture Service', () => {
    let service: OuvertureService;
    let httpMock: HttpTestingController;
    let elemDefault: IOuverture;
    let expectedResult: IOuverture | IOuverture[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OuvertureService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        couleur: Couleur.BLANC,
        premierCoups: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ouverture', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Ouverture()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ouverture', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            couleur: 'BBBBBB',
            premierCoups: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ouverture', () => {
        const patchObject = Object.assign({}, new Ouverture());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ouverture', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            couleur: 'BBBBBB',
            premierCoups: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Ouverture', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOuvertureToCollectionIfMissing', () => {
        it('should add a Ouverture to an empty array', () => {
          const ouverture: IOuverture = { id: 123 };
          expectedResult = service.addOuvertureToCollectionIfMissing([], ouverture);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ouverture);
        });

        it('should not add a Ouverture to an array that contains it', () => {
          const ouverture: IOuverture = { id: 123 };
          const ouvertureCollection: IOuverture[] = [
            {
              ...ouverture,
            },
            { id: 456 },
          ];
          expectedResult = service.addOuvertureToCollectionIfMissing(ouvertureCollection, ouverture);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ouverture to an array that doesn't contain it", () => {
          const ouverture: IOuverture = { id: 123 };
          const ouvertureCollection: IOuverture[] = [{ id: 456 }];
          expectedResult = service.addOuvertureToCollectionIfMissing(ouvertureCollection, ouverture);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ouverture);
        });

        it('should add only unique Ouverture to an array', () => {
          const ouvertureArray: IOuverture[] = [{ id: 123 }, { id: 456 }, { id: 77198 }];
          const ouvertureCollection: IOuverture[] = [{ id: 123 }];
          expectedResult = service.addOuvertureToCollectionIfMissing(ouvertureCollection, ...ouvertureArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ouverture: IOuverture = { id: 123 };
          const ouverture2: IOuverture = { id: 456 };
          expectedResult = service.addOuvertureToCollectionIfMissing([], ouverture, ouverture2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ouverture);
          expect(expectedResult).toContain(ouverture2);
        });

        it('should accept null and undefined values', () => {
          const ouverture: IOuverture = { id: 123 };
          expectedResult = service.addOuvertureToCollectionIfMissing([], null, ouverture, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ouverture);
        });

        it('should return initial array if no Ouverture is added', () => {
          const ouvertureCollection: IOuverture[] = [{ id: 123 }];
          expectedResult = service.addOuvertureToCollectionIfMissing(ouvertureCollection, undefined, null);
          expect(expectedResult).toEqual(ouvertureCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
