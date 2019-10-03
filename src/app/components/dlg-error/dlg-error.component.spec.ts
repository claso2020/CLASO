import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgErrorComponent } from './dlg-error.component';

describe('DlgErrorComponent', () => {
  let component: DlgErrorComponent;
  let fixture: ComponentFixture<DlgErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
