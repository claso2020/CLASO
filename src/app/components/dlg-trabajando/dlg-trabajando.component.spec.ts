import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgTrabajandoComponent } from './dlg-trabajando.component';

describe('DlgTrabajandoComponent', () => {
  let component: DlgTrabajandoComponent;
  let fixture: ComponentFixture<DlgTrabajandoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgTrabajandoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgTrabajandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
