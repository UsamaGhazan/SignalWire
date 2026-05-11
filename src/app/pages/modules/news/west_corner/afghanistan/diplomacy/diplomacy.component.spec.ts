import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomacyComponent } from './diplomacy.component';

describe('DiplomacyComponent', () => {
  let component: DiplomacyComponent;
  let fixture: ComponentFixture<DiplomacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiplomacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
