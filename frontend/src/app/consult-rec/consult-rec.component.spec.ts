import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultRecComponent } from './consult-rec.component';

describe('ConsultRecComponent', () => {
  let component: ConsultRecComponent;
  let fixture: ComponentFixture<ConsultRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
