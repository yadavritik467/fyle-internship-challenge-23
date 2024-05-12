import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.sample';
import { UtilsService } from '../utils/utils.service';
import {
  ApiResponse,
  GitHubUserInterface,
  Repos,
  Users,
} from 'src/app/interface/all-interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  userName: string = 'yadavritik';
  perPage: number = 10;
  page: number = 1;
  headers = new HttpHeaders({
    Authorization: `token ${environment.github_token ?? ''}`,
  });

  constructor(
    private readonly http: HttpClient,
    private readonly utilsService: UtilsService
  ) {}

  // for fetching user details
  getUser(githubUsername: string): Observable<GitHubUserInterface> {
    return this.http
      .get<GitHubUserInterface>(
        `https://api.github.com/users/${githubUsername}`,
        { headers: this.headers }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.utilsService.showError(err.error.message);
          return throwError(err);
        }),
        finalize(() => {})
      );
  }

  // for fetching user's repo
  getUserRepos(
    githubUsername: string,
    per_page: number,
    page: number
  ): Observable<Repos[]> {
    const params = this.utilsService.createParams({ per_page, page });

    return this.http
      .get<Repos[]>(`https://api.github.com/users/${githubUsername}/repos`, {
        params,
        headers: this.headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.utilsService.showError(err.error.message);
          return throwError(err);
        }),
        finalize(() => {})
      );
  }
  // for searching user's repo
  searchRepos(
    githubUsername: string,
    q: string,
    per_page: number,
    page: number
  ): Observable<ApiResponse<Repos[]>> {
    const params = this.utilsService.createParams({ per_page, page });

    return this.http
      .get<ApiResponse<Repos[]>>(
        `https://api.github.com/search/repositories?q=${q}+user:${githubUsername}`,
        {
          params,
          headers: this.headers,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.utilsService.showError(err.error.message);
          return throwError(err);
        }),
        finalize(() => {})
      );
  }

  // for searching users

  searchUser(
    q: string,
    per_page: number,
    page: number
  ): Observable<ApiResponse<Users[]>> {
    this.userName = q;
    this.perPage = per_page;
    this.page = page;

    const params = this.utilsService.createParams({ q, per_page, page });
    return this.http
      .get<ApiResponse<Users[]>>(`https://api.github.com/search/users`, {
        params,
        headers: this.headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.utilsService.showError(err.error.message);
          return throwError(err);
        }),
        finalize(() => {})
      );
  }
}
