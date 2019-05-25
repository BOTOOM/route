import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteLocalComponent } from './route-local.component';

describe('RouteLocalComponent', () => {
  let component: RouteLocalComponent;
  let fixture: ComponentFixture<RouteLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
