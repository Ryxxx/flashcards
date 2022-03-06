import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVariante, Variante } from '../variante.model';

import { VarianteService } from './variante.service';

describe('Variante Service', () => {
  let service: VarianteService;
  let httpMock: HttpTestingController;
  let elemDefault: IVariante;
  let expectedResult: IVariante | IVariante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VarianteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      coups: 'AAAAAAA',
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

    it('should create a Variante', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Variante()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Variante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          coups: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Variante', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          coups: 'BBBBBB',
        },
        new Variante()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Variante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          coups: 'BBBBBB',
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

    it('should delete a Variante', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVarianteToCollectionIfMissing', () => {
      it('should add a Variante to an empty array', () => {
        const variante: IVariante = { id: 123 };
        expectedResult = service.addVarianteToCollectionIfMissing([], variante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(variante);
      });

      it('should not add a Variante to an array that contains it', () => {
        const variante: IVariante = { id: 123 };
        const varianteCollection: IVariante[] = [
          {
            ...variante,
          },
          { id: 456 },
        ];
        expectedResult = service.addVarianteToCollectionIfMissing(varianteCollection, variante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Variante to an array that doesn't contain it", () => {
        const variante: IVariante = { id: 123 };
        const varianteCollection: IVariante[] = [{ id: 456 }];
        expectedResult = service.addVarianteToCollectionIfMissing(varianteCollection, variante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(variante);
      });

      it('should add only unique Variante to an array', () => {
        const varianteArray: IVariante[] = [{ id: 123 }, { id: 456 }, { id: 64032 }];
        const varianteCollection: IVariante[] = [{ id: 123 }];
        expectedResult = service.addVarianteToCollectionIfMissing(varianteCollection, ...varianteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const variante: IVariante = { id: 123 };
        const variante2: IVariante = { id: 456 };
        expectedResult = service.addVarianteToCollectionIfMissing([], variante, variante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(variante);
        expect(expectedResult).toContain(variante2);
      });

      it('should accept null and undefined values', () => {
        const variante: IVariante = { id: 123 };
        expectedResult = service.addVarianteToCollectionIfMissing([], null, variante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(variante);
      });

      it('should return initial array if no Variante is added', () => {
        const varianteCollection: IVariante[] = [{ id: 123 }];
        expectedResult = service.addVarianteToCollectionIfMissing(varianteCollection, undefined, null);
        expect(expectedResult).toEqual(varianteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
