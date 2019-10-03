import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgAvisoComponent } from './dlg-aviso.component';

describe('DlgAvisoComponent', () => {
  let component: DlgAvisoComponent;
  let fixture: ComponentFixture<DlgAvisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgAvisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
