import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SckeletonLoaderComponent } from './sckeleton-loader.component';

describe('SckeletonLoaderComponent', () => {
  let component: SckeletonLoaderComponent;
  let fixture: ComponentFixture<SckeletonLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SckeletonLoaderComponent]
    });
    fixture = TestBed.createComponent(SckeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
