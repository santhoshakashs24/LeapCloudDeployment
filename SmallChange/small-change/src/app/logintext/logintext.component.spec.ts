import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogintextComponent } from './logintext.component';

describe('LogintextComponent', () => {
  let component: LogintextComponent;
  let fixture: ComponentFixture<LogintextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogintextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogintextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
