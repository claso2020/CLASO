import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosModComponent } from './libros-mod.component';

describe('LibrosModComponent', () => {
  let component: LibrosModComponent;
  let fixture: ComponentFixture<LibrosModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrosModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
