import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfpComponent } from './nfp.component';

describe('NfpComponent', () => {
  let component: NfpComponent;
  let fixture: ComponentFixture<NfpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NfpComponent]
    });
    fixture = TestBed.createComponent(NfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
