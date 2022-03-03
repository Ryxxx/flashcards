import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VarianteService } from '../service/variante.service';

import { VarianteComponent } from './variante.component';

describe('Component Tests', () => {
  describe('Variante Management Component', () => {
    let comp: VarianteComponent;
    let fixture: ComponentFixture<VarianteComponent>;
    let service: VarianteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VarianteComponent],
      })
        .overrideTemplate(VarianteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VarianteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VarianteService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.variantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
