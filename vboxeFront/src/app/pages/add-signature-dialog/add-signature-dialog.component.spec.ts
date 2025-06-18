import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSignatureDialogComponent } from './add-signature-dialog.component';

describe('AddSignatureDialogComponent', () => {
  let component: AddSignatureDialogComponent;
  let fixture: ComponentFixture<AddSignatureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSignatureDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSignatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
