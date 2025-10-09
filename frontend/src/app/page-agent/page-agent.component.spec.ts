import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAgentComponent } from './page-agent.component';

describe('PageAgentComponent', () => {
  let component: PageAgentComponent;
  let fixture: ComponentFixture<PageAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
