jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVariante, Variante } from '../variante.model';
import { VarianteService } from '../service/variante.service';

import { VarianteRoutingResolveService } from './variante-routing-resolve.service';

describe('Service Tests', () => {
  describe('Variante routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VarianteRoutingResolveService;
    let service: VarianteService;
    let resultVariante: IVariante | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VarianteRoutingResolveService);
      service = TestBed.inject(VarianteService);
      resultVariante = undefined;
    });

    describe('resolve', () => {
      it('should return IVariante returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVariante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVariante).toEqual({ id: 123 });
      });

      it('should return new IVariante if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVariante = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVariante).toEqual(new Variante());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Variante })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVariante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVariante).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
