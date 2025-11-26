import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorModeComponent } from './color-mode.component';

describe('ColorModeComponent', () => {
  let component: ColorModeComponent;
  let fixture: ComponentFixture<ColorModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
