import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesEnvoyeeComponent } from './messages-envoyee.component';

describe('MessagesEnvoyeeComponent', () => {
  let component: MessagesEnvoyeeComponent;
  let fixture: ComponentFixture<MessagesEnvoyeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesEnvoyeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesEnvoyeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
