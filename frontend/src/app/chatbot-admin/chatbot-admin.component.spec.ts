import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotAdminComponent } from './chatbot-admin.component';

describe('ChatbotAdminComponent', () => {
  let component: ChatbotAdminComponent;
  let fixture: ComponentFixture<ChatbotAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
