import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodereauComponent } from './bodereau.component';

describe('BodereauComponent', () => {
  let component: BodereauComponent;
  let fixture: ComponentFixture<BodereauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodereauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
