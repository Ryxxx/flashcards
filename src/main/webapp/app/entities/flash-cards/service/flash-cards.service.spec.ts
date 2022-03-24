import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFlashCards, FlashCards } from '../flash-cards.model';

import { FlashCardsService } from './flash-cards.service';

describe('FlashCards Service', () => {
  let service: FlashCardsService;
  let httpMock: HttpTestingController;
  let elemDefault: IFlashCards;
  let expectedResult: IFlashCards | IFlashCards[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FlashCardsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      repetitions: 0,
      qualite: 0,
      facilite: 0,
      intervalle: 0,
      prochainEntrainement: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          prochainEntrainement: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a FlashCards', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          prochainEntrainement: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          prochainEntrainement: currentDate,
        },
        returnedFromService
      );

      service.create(new FlashCards()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FlashCards', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          repetitions: 1,
          qualite: 1,
          facilite: 1,
          intervalle: 1,
          prochainEntrainement: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          prochainEntrainement: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FlashCards', () => {
      const patchObject = Object.assign(
        {
          qualite: 1,
          facilite: 1,
          prochainEntrainement: currentDate.format(DATE_FORMAT),
        },
        new FlashCards()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          prochainEntrainement: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FlashCards', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          repetitions: 1,
          qualite: 1,
          facilite: 1,
          intervalle: 1,
          prochainEntrainement: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          prochainEntrainement: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a FlashCards', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFlashCardsToCollectionIfMissing', () => {
      it('should add a FlashCards to an empty array', () => {
        const flashCards: IFlashCards = { id: 123 };
        expectedResult = service.addFlashCardsToCollectionIfMissing([], flashCards);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flashCards);
      });

      it('should not add a FlashCards to an array that contains it', () => {
        const flashCards: IFlashCards = { id: 123 };
        const flashCardsCollection: IFlashCards[] = [
          {
            ...flashCards,
          },
          { id: 456 },
        ];
        expectedResult = service.addFlashCardsToCollectionIfMissing(flashCardsCollection, flashCards);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FlashCards to an array that doesn't contain it", () => {
        const flashCards: IFlashCards = { id: 123 };
        const flashCardsCollection: IFlashCards[] = [{ id: 456 }];
        expectedResult = service.addFlashCardsToCollectionIfMissing(flashCardsCollection, flashCards);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flashCards);
      });

      it('should add only unique FlashCards to an array', () => {
        const flashCardsArray: IFlashCards[] = [{ id: 123 }, { id: 456 }, { id: 61185 }];
        const flashCardsCollection: IFlashCards[] = [{ id: 123 }];
        expectedResult = service.addFlashCardsToCollectionIfMissing(flashCardsCollection, ...flashCardsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const flashCards: IFlashCards = { id: 123 };
        const flashCards2: IFlashCards = { id: 456 };
        expectedResult = service.addFlashCardsToCollectionIfMissing([], flashCards, flashCards2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flashCards);
        expect(expectedResult).toContain(flashCards2);
      });

      it('should accept null and undefined values', () => {
        const flashCards: IFlashCards = { id: 123 };
        expectedResult = service.addFlashCardsToCollectionIfMissing([], null, flashCards, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flashCards);
      });

      it('should return initial array if no FlashCards is added', () => {
        const flashCardsCollection: IFlashCards[] = [{ id: 123 }];
        expectedResult = service.addFlashCardsToCollectionIfMissing(flashCardsCollection, undefined, null);
        expect(expectedResult).toEqual(flashCardsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
