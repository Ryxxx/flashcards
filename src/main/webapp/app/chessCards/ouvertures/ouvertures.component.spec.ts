import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuverturesComponent } from './ouvertures.component';

describe('OuverturesComponent', () => {
  let component: OuverturesComponent;
  let fixture: ComponentFixture<OuverturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OuverturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuverturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
