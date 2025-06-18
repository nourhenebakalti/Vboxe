import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestV12Component } from './test-v12.component';

describe('TestV12Component', () => {
  let component: TestV12Component;
  let fixture: ComponentFixture<TestV12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestV12Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestV12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
