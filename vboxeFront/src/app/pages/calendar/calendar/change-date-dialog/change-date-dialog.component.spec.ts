import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDateDialogComponent } from './change-date-dialog.component';

describe('ChangeDateDialogComponent', () => {
  let component: ChangeDateDialogComponent;
  let fixture: ComponentFixture<ChangeDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
