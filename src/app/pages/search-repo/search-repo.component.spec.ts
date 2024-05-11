import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { SearchRepoComponent } from './search-repo.component';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import {
  GitHubUserInterface,
  Repos,
  ApiResponse,
} from 'src/app/interface/all-interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from 'src/app/app.material.module';
import { MatSelectChange } from '@angular/material/select';

describe('SearchRepoComponent', () => {
  let component: SearchRepoComponent;
  let fixture: ComponentFixture<SearchRepoComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'getUser',
      'searchRepos',
      'getUserRepos',
    ]);

    await TestBed.configureTestingModule({
      declarations: [SearchRepoComponent],
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
    fixture = TestBed.createComponent(SearchRepoComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRepoComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser service method and set user when getUser is called', () => {
    const mockUser: GitHubUserInterface = {
      public_repos: 0,
      followers: 0,
      location: '',
      html_url: '',
      login: '',
      avatar_url: '',
      name: '',
      bio: '',
    };
    apiService.getUser.and.returnValue(of(mockUser));

    component.getUser();

    expect(apiService.getUser).toHaveBeenCalledWith('');
    expect(component.user).toEqual(mockUser);
  });

  it('should call searchRepos service method when repoName is present', () => {
    const mockRepos: ApiResponse<Repos[]> = {
      incomplete_results: false,
      items: [],
      total_count: 0,
    };
    component.repoName = 'repoName';
    apiService.searchRepos.and.returnValue(of(mockRepos));

    component.getRepos();

    expect(apiService.searchRepos).toHaveBeenCalledWith(
      component.userName,
      component.repoName,
      component.perPage,
      component.page
    );
    expect(component.repos).toEqual(mockRepos.items);
  });

  it('should call getUserRepos service method when repoName is not present', () => {
    const mockRepos: Repos[] = [];
    component.userName = 'testUser';
    apiService.getUserRepos.and.returnValue(of(mockRepos));
    component.getRepos();
    expect(apiService.getUserRepos).toHaveBeenCalledWith(
      'testUser',
      component.perPage,
      component.page
    );
    expect(component.repos).toEqual(mockRepos);
  });

  describe('getUser', () => {
    it('should call createPagination after fetching user', () => {
      // Setup
      const mockUser: GitHubUserInterface = {
        public_repos: 10,
        followers: 0,
        location: '',
        html_url: '',
        login: '',
        avatar_url: '',
        name: '',
        bio: '',
      };
      component.userName = 'testUser';
      const getUserSpy = apiService.getUser.and.returnValue(of(mockUser));
      spyOn(component, 'createPagination').and.callThrough();

      // Execution
      component.getUser();

      expect(apiService.getUser).toHaveBeenCalledWith('testUser');
      expect(component.user).toEqual(mockUser);
      expect(component.paginatedPageIndex.length).toBeGreaterThan(0);
      expect(component.paginatedPageIndex.length).toBe(
        Math.ceil(mockUser.public_repos / component.perPage)
      );
      expect(component.paginatedPageIndex[0]).toBe(1);
    });
  });

  describe('prevPage', () => {
    it('should decrement page and update paginatedPageIndex if page is greater than 1', () => {
      // Setup
      component.page = 3; // Set an initial page greater than 1
      component.user = {
        public_repos: 20,
        followers: 0,
        location: '',
        html_url: '',
        login: '',
        avatar_url: '',
        name: '',
        bio: '',
      }; // Mock user object
      component.paginatedPageIndex = [1, 2, 3, 4, 5]; // Set initial paginatedPageIndex
      spyOn(component, 'getRepos'); // Spy on getRepos method

      // Execution
      if (component.page > 1) {
        component.prevPage();
      }

      // Expectations
      expect(component.page).toBe(component.page--); // Page should be decremented by 1
      // Check if paginatedPageIndex is updated properly
      expect(component.paginatedPageIndex).toEqual([1, 2, 3, 4, 5]); // Expected paginatedPageIndex after decrementing page to 2
      // Expect getRepos to be called
      expect(component.getRepos).toHaveBeenCalled();
    });

    it('should not decrement page or update paginatedPageIndex if page is 1', () => {
      // Setup
      component.page = 1; // Set an initial page equal to 1
      component.user = {
        public_repos: 10,
        followers: 0,
        location: '',
        html_url: '',
        login: '',
        avatar_url: '',
        name: '',
        bio: '',
      }; // Mock user object
      component.paginatedPageIndex = [1, 2, 3, 4, 5]; // Set initial paginatedPageIndex
      spyOn(component, 'getRepos'); // Spy on getRepos method

      // Execution
      component.prevPage();

      // Expectations
      expect(component.page).toBe(1); // Page should remain 1
      expect(component.paginatedPageIndex).toEqual([1, 2, 3, 4, 5]); // paginatedPageIndex should remain unchanged
      // Expect getRepos not to be called
      expect(component.getRepos).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should increment page and call getRepos if repos length is not empty', () => {
      // Setup
      component.page = 1; // Set an initial page
      component.paginatedIndexValue = 5; // Set an initial paginatedIndexValue
      component.paginatedPageIndex = [1, 2, 3, 4, 5];
      component.repos = [
        {
          name: 'reap',
          html_url: '',
          description: '',
        },
      ]; // Mock repos array
      spyOn(component, 'createPagination'); // Spy on createPagination method
      spyOn(component, 'getRepos'); // Spy on getRepos method

      // Execution
      if (component.repos.length) {
        component.nextPage();
      }

      // Expectations
      expect(component.page).toBe(component.page++); // Page should be incremented by 1
      if (component.page > component.paginatedPageIndex[4]) {
        expect(component.createPagination).toHaveBeenCalled(); // createPagination should not be called
      } else {
        expect(component.createPagination).not.toHaveBeenCalled(); // createPagination should not be called
      }
      expect(component.getRepos).toHaveBeenCalled(); // getRepos should be called
    });

    it('should increment page, update paginatedIndexValue, call createPagination and getRepos if page exceeds paginatedPageIndex', () => {
      // Setup
      component.page = 6; // Set a page greater than the last index in paginatedPageIndex
      component.paginatedIndexValue = 10; // Set an initial paginatedIndexValue
      component.repos = [
        {
          name: 'reap',
          html_url: '',
          description: '',
        },
      ]; // Mock repos array
      spyOn(component, 'createPagination'); // Spy on createPagination method
      spyOn(component, 'getRepos'); // Spy on getRepos method

      // Execution
      if (component.repos.length) {
        component.nextPage();
      }

      // Expectations
      expect(component.page).toBe(component.page++); // Page should be incremented by 1
      expect(component.paginatedIndexValue).toBe(component.paginatedIndexValue); // paginatedIndexValue should be updated
      if (component.page > component.paginatedPageIndex[4]) {
        expect(component.createPagination).toHaveBeenCalled(); // createPagination should not be called
      } else {
        expect(component.createPagination).not.toHaveBeenCalled(); // createPagination should not be called
      } // createPagination should be called
      expect(component.getRepos).toHaveBeenCalled(); // getRepos should be called
    });
  });

  describe('onSelectPerPage', () => {
    it('should set page to 1, update perPage, call getRepos, and createPagination', () => {
      // Setup
      const mockValue = 25; // Sample value for perPage
      const mockEvent: MatSelectChange = {
        value: mockValue,
      } as MatSelectChange;
      spyOn(component, 'getRepos'); // Spy on getRepos method
      spyOn(component, 'createPagination'); // Spy on createPagination method

      // Execution
      component.onSelectPerPage(mockEvent);

      // Expectations
      expect(component.page).toBe(1); // Page should be set to 1
      expect(component.perPage).toBe(mockValue); // perPage should be updated with the selected value
      expect(component.getRepos).toHaveBeenCalled(); // getRepos should be called
      expect(component.createPagination).toHaveBeenCalled(); // createPagination should be called
    });
  });

  describe('navigetToPage', () => {
    it('should set page to the provided value and call getRepos', () => {
      // Setup
      const mockValue = 2; // Sample value for page
      spyOn(component, 'getRepos'); // Spy on getRepos method

      // Execution
      component.navigetToPage(mockValue);

      // Expectations
      expect(component.page).toBe(mockValue); // Page should be set to the provided value
      expect(component.getRepos).toHaveBeenCalled(); // getRepos should be called
    });
  });

  afterEach(() => {
    // Unsubscribe from subscriptions to prevent memory leaks
    component.subscription.unsubscribe();
    // Reset any variables or state that were modified during the test
    component.user = undefined;
    component.repos = [];
    component.sckeletonLoadArry = [];
    component.userName = '';
    component.repoName = '';
    component.perPage = 10;
    component.page = 1;
    component.pageOpt = [10, 25, 50, 100];
    component.paginatedIndexValue = 0;
    component.paginatedPageIndex = [];
    component.userLoading = false;
    component.repoLoading = false;
  });
});
