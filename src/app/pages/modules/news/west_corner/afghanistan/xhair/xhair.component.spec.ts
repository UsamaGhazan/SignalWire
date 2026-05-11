import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XhairComponent } from './xhair.component';

describe('XhairComponent', () => {
  let component: XhairComponent;
  let fixture: ComponentFixture<XhairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XhairComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XhairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
