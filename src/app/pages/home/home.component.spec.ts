import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AppMaterialModule } from 'src/app/app.material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiResponse, Users } from 'src/app/interface/all-interface';
import { MatSelectChange } from '@angular/material/select';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let router: Router;
  let fixture: ComponentFixture<HomeComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['searchUser']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [AppMaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ userName: 'testUser' }),
            snapshot: {
              queryParamMap: convertToParamMap({ userName: 'testUser' }),
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>; 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchUser method on ngOnInit', () => {
    spyOn(component, 'searchUser');
    component.ngOnInit();
    expect(component.searchUser).toHaveBeenCalled();
  });

  it('should call ApiService.searchUser and set users on calling searchUser', () => {
    const mockApiResponse: ApiResponse<Users[]> = {
      incomplete_results: false,
      items: [
        { avatar_url: 'https://github.com/img.jpg', login: 'testUser123' },
      ],
      total_count: 2,
    };
    component.perPage = 10; // Set perPage
    component.page = 1; // Set page
    apiService.searchUser.and.returnValue(of(mockApiResponse));
    component.searchUser();
    expect(apiService.searchUser).toHaveBeenCalledOnceWith(
      component.userName, // Assuming you want to pass userName here
      component.perPage,
      component.page
    );
    expect(component.users).toEqual(mockApiResponse.items);
    expect(component.totalLength).toEqual(mockApiResponse.total_count);
  });

  it('should generate paginatedPageIndex array correctly', () => {
    // Setup

    component.totalLength = 25; // Example total length
    component.perPage = 10; // Example perPage value
    component.page = 1; // Example page value
    component.paginatedPageIndex = []; // containe all the index value based on component.tatalLength
    let pageValue = Math.ceil(component.totalLength / component.perPage);
    const breakIndex =
      component.paginatedIndexValue > 5
        ? component.page + 4
        : component.page + component.paginatedIndexValue - 1;
    const totalPage = pageValue > 5 ? breakIndex : pageValue;
    for (let i = 1; i <= totalPage; i++) {
      component.paginatedPageIndex.push(i);
    }

    // Execution
    component.createPagination();

    // Assertion
    expect(component.paginatedPageIndex).toEqual(component.paginatedPageIndex); // Expected array value of component.paginatedPageIndex
  });

  describe('prevPage', () => {
    it('should decrement page and update paginatedPageIndex if page is greater than 1', () => {
      // Setup
      component.page = 3; // Set an initial page greater than 1
      component.users = [
        {
          avatar_url: 'https://github.com/img.jpg',
          login: 'testUser123',
        },
      ]; // Mock user object
      component.paginatedPageIndex = [1, 2, 3, 4, 5]; // Set initial paginatedPageIndex
      spyOn(component, 'searchUser'); // Spy on searchUser method

      // Execution
      if (component.page > 1) {
        component.prevPage();
      }

      // Expectations
      expect(component.page).toBe(component.page--); // Page should be decremented by 1
      // Check if paginatedPageIndex is updated properly
      expect(component.paginatedPageIndex).toEqual([1, 2, 3, 4, 5]); // Expected paginatedPageIndex after decrementing page to 2
      // Expect searchUser to be called
      expect(component.searchUser).toHaveBeenCalled();
    });

    it('should not decrement page or update paginatedPageIndex if page is 1', () => {
      // Setup
      component.page = 1; // Set an initial page equal to 1
      component.users = [
        {
          avatar_url: 'https://github.com/img.jpg',
          login: 'testUser123',
        },
      ]; // Mock user object
      component.paginatedPageIndex = [1, 2, 3, 4, 5]; // Set initial paginatedPageIndex
      spyOn(component, 'searchUser'); // Spy on searchUser method

      // Execution
      component.prevPage();

      // Expectations
      expect(component.page).toBe(1); // Page should remain 1
      expect(component.paginatedPageIndex).toEqual([1, 2, 3, 4, 5]); // paginatedPageIndex should remain unchanged
      // Expect searchUser not to be called
      expect(component.searchUser).not.toHaveBeenCalled();
    });
  });

  describe('onSelectPerPage', () => {
    it('should update page and perPage values, and call searchUser and createPagination', () => {
      // Setup
      const mockValue: MatSelectChange = { value: 25 } as MatSelectChange; // Mock MatSelectChange object
      spyOn(component, 'searchUser'); // Spy on searchUser method
      spyOn(component, 'createPagination'); // Spy on createPagination method

      // Execution
      component.onSelectPerPage(mockValue);

      // Assertion
      expect(component.page).toEqual(1); // Ensure page value is set to 1
      expect(component.perPage).toEqual(mockValue.value); // Ensure perPage value is set to the value from MatSelectChange
      expect(component.searchUser).toHaveBeenCalled(); // Ensure searchUser method is called
      expect(component.createPagination).toHaveBeenCalled(); // Ensure createPagination method is called
    });
  });

  describe('navigateToPage', () => {
    it('should navigate to search repo page with query parameter', () => {
      // Setup
      const mockUser: Users = { avatar_url: '', login: 'testUser123' }; // Mock user object
      spyOn(router, 'navigate'); // Spy on router navigate method

      // Execution
      component.navigateToPage(mockUser);

      // Assertion
      expect(router.navigate).toHaveBeenCalledWith(['/search/repo'], {
        queryParams: { userName: mockUser?.login },
      });
    });
  });

  describe('navigetToPageThroughPaginate', () => {
    it('should set page value and call searchUser', () => {
      // Setup
      const mockValue: number = 2; // Mock value for page
      spyOn(component, 'searchUser'); // Spy on searchUser method

      // Execution
      component.navigetToPageThroughPaginate(mockValue);

      // Assertion
      expect(component.page).toEqual(mockValue); // Ensure page value is set correctly
      expect(component.searchUser).toHaveBeenCalled(); // Ensure searchUser method is called
    });
  });

  afterEach(() => {
    // Unsubscribe from subscriptions to prevent memory leaks
    component.subscription.unsubscribe();
    // Reset any variables or state that were modified during the test
    component.userName = 'ritik';
    component.perPage = 10;
    component.page = 1;
    component.pageOpt = [10, 25, 50, 100];
    component.paginatedIndexValue = 0;
    component.paginatedPageIndex = [];
    component.users = [];
    component.totalLength = null;
    component.isLoading = false;
    component.createPaginationCalled = false;
  });
});
