import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OuvertureService } from '../service/ouverture.service';

import { OuvertureComponent } from './ouverture.component';

describe('Ouverture Management Component', () => {
  let comp: OuvertureComponent;
  let fixture: ComponentFixture<OuvertureComponent>;
  let service: OuvertureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OuvertureComponent],
    })
      .overrideTemplate(OuvertureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OuvertureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OuvertureService);

    const headers = new HttpHeaders();
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
    expect(comp.ouvertures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
