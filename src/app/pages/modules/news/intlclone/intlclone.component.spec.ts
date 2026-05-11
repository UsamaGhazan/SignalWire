import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IntlClone } from "./intlclone.component";

describe("IntlcloneComponent", () => {
  let component: IntlClone;
  let fixture: ComponentFixture<IntlClone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntlClone],
    }).compileComponents();

    fixture = TestBed.createComponent(IntlClone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
