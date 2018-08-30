import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSpritesComponent } from './unit-sprites.component';

describe('UnitSpritesComponent', () => {
  let component: UnitSpritesComponent;
  let fixture: ComponentFixture<UnitSpritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSpritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSpritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
