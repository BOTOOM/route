import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { RouteGlobalComponent } from './route-global.componentnt';
import {RouteGlobalComponent} from './route-global.component';

describe('RouteGlobalComponent', () => {
  let component: RouteGlobalComponent;
  let fixture: ComponentFixture<RouteGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
