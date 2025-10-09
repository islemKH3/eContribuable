import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRecComponent } from './submit-rec.component';

describe('SubmitRecComponent', () => {
  let component: SubmitRecComponent;
  let fixture: ComponentFixture<SubmitRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
