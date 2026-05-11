import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreHeadderComponent } from './explore-headder.component';

describe('ExploreHeadderComponent', () => {
  let component: ExploreHeadderComponent;
  let fixture: ComponentFixture<ExploreHeadderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreHeadderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreHeadderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
