import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SckeletonLoaderComponent } from './sckeleton-loader.component'; // Assuming your component is in 'sckeleton-loader.component'

describe('SckeletonLoaderComponent', () => {
  let component: SckeletonLoaderComponent;
  let fixture: ComponentFixture<SckeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SckeletonLoaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SckeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detect initial changes
  });

  it('should create an array of skeleton loader objects with 10 elements on ngOnInit', () => {
    expect(component.sckeletonLoadArry.length).toBe(10); // Assert array length
  });

  it('should set the className_1 and className_2 properties of each skeleton loader object to the provided input values', () => {
    component.className_1 = '';
    component.className_2 = '';
    fixture.detectChanges(); // Detect changes after setting inputs

    expect(
      component.sckeletonLoadArry.every(
        (item) =>
          item.className_1 === component.className_1 &&
          item.className_2 === component.className_2
      )
    ).toBeTrue(); // Assert object properties
  });
});
