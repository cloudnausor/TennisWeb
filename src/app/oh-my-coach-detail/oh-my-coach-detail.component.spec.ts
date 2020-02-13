import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OhMyCoachDetailComponent } from "./oh-my-coach-detail.component";

describe("OhMyCoachDetailComponent", () => {
  let component: OhMyCoachDetailComponent;
  let fixture: ComponentFixture<OhMyCoachDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OhMyCoachDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OhMyCoachDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
