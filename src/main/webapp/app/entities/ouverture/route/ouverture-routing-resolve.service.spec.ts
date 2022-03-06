jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOuverture, Ouverture } from '../ouverture.model';
import { OuvertureService } from '../service/ouverture.service';

import { OuvertureRoutingResolveService } from './ouverture-routing-resolve.service';

describe('Service Tests', () => {
  describe('Ouverture routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: OuvertureRoutingResolveService;
    let service: OuvertureService;
    let resultOuverture: IOuverture | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(OuvertureRoutingResolveService);
      service = TestBed.inject(OuvertureService);
      resultOuverture = undefined;
    });

    describe('resolve', () => {
      it('should return IOuverture returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOuverture = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOuverture).toEqual({ id: 123 });
      });

      it('should return new IOuverture if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOuverture = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultOuverture).toEqual(new Ouverture());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Ouverture })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOuverture = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOuverture).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
