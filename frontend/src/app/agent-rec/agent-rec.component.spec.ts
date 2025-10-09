import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRecComponent } from './agent-rec.component';

describe('AgentRecComponent', () => {
  let component: AgentRecComponent;
  let fixture: ComponentFixture<AgentRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
