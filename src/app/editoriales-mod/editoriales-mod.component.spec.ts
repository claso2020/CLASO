import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialesModComponent } from './editoriales-mod.component';

describe('EditorialesModComponent', () => {
  let component: EditorialesModComponent;
  let fixture: ComponentFixture<EditorialesModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorialesModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialesModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
