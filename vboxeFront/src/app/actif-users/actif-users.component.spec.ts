import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActifUsersComponent } from './actif-users.component';

describe('ActifUsersComponent', () => {
  let component: ActifUsersComponent;
  let fixture: ComponentFixture<ActifUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActifUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActifUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
