import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecComponent } from './admin-rec.component';

describe('AdminRecComponent', () => {
  let component: AdminRecComponent;
  let fixture: ComponentFixture<AdminRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
