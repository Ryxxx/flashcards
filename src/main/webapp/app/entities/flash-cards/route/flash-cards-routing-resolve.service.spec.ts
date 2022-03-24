import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFlashCards, FlashCards } from '../flash-cards.model';
import { FlashCardsService } from '../service/flash-cards.service';

import { FlashCardsRoutingResolveService } from './flash-cards-routing-resolve.service';

describe('FlashCards routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FlashCardsRoutingResolveService;
  let service: FlashCardsService;
  let resultFlashCards: IFlashCards | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(FlashCardsRoutingResolveService);
    service = TestBed.inject(FlashCardsService);
    resultFlashCards = undefined;
  });

  describe('resolve', () => {
    it('should return IFlashCards returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFlashCards = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFlashCards).toEqual({ id: 123 });
    });

    it('should return new IFlashCards if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFlashCards = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFlashCards).toEqual(new FlashCards());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FlashCards })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFlashCards = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFlashCards).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
