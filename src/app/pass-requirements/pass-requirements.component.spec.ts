import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRequirementsComponent } from './pass-requirements.component';

describe('PassRequirementsComponent', () => {
  let component: PassRequirementsComponent;
  let fixture: ComponentFixture<PassRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
