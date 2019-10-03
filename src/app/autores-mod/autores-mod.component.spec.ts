import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresModComponent } from './autores-mod.component';

describe('AutoresModComponent', () => {
  let component: AutoresModComponent;
  let fixture: ComponentFixture<AutoresModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoresModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoresModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
