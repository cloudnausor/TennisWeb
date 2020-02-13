import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OhMyEventNewComponent } from "./oh-my-event-new.component";

describe("OhMyEventNewComponent", () => {
  let component: OhMyEventNewComponent;
  let fixture: ComponentFixture<OhMyEventNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OhMyEventNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OhMyEventNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
