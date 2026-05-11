import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsctComponent } from './isct.component';

describe('IsctComponent', () => {
  let component: IsctComponent;
  let fixture: ComponentFixture<IsctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsctComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
