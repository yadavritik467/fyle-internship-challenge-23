import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  ApiResponse,
  GitHubUserInterface,
  Repos,
  Users,
} from 'src/app/interface/all-interface';
import { UtilsService } from '../utils/utils.service';
import { ToastrService } from 'ngx-toastr';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        UtilsService,
        // Provide a mock ToastrService
        { provide: ToastrService, useValue: {} },
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that there are no outstanding HTTP requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user details', () => {
    const mockUser: GitHubUserInterface = {
      public_repos: 0,
      followers: 0,
      location: 'location',
      html_url: 'https://github.com/',
      login: 'testuser',
      avatar_url: 'https://example.com/avtar.jpg',
      name: 'testuser',
      bio: 'bio',
    };
    const username = 'testuser';

    service.getUser(username).subscribe((user) => {
      return expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch user repositories', () => {
    const mockRepos: Repos[] = [];
    const username = 'testuser';
    const perPage = 10;
    const page = 1;

    service.getUserRepos(username, perPage, page).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should search user repositories', () => {
    const mockRepos: ApiResponse<Repos[]> = {
      incomplete_results: false,
      items: [],
      total_count: 0,
    };
    const q = 'repoName';
    const githubUsername = 'testuser';
    const perPage = 10;
    const page = 1;

    service.searchRepos(q, githubUsername, perPage, page).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/search/repositories?q=${githubUsername}+user:${q}&per_page=${perPage}&page=${page}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
  it('should search user', () => {
    const mockRepos: ApiResponse<Users[]> = {
      incomplete_results: false,
      items: [],
      total_count: 0,
    };

    const githubUsername = 'testuser';
    const perPage = 10;
    const page = 1;

    service.searchUser(githubUsername, perPage, page).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/search/users?q=${githubUsername}&per_page=${perPage}&page=${page}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
});
