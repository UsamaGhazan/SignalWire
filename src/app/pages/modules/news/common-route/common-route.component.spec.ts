import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonRoute } from "./common-route.component";

describe("CommonRouteComponent", () => {
  let component: CommonRoute;
  let fixture: ComponentFixture<CommonRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonRoute],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
