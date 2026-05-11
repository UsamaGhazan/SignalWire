import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumSourcesComponent } from './premium-sources.component';

describe('PremiumSourcesComponent', () => {
  let component: PremiumSourcesComponent;
  let fixture: ComponentFixture<PremiumSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumSourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
