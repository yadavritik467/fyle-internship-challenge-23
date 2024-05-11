import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take, tap } from 'rxjs';
import {
  ApiResponse,
  GitHubUserInterface,
  Repos,
} from 'src/app/interface/all-interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search-repo',
  templateUrl: './search-repo.component.html',
  styleUrls: ['./search-repo.component.scss'],
})
export class SearchRepoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  user: GitHubUserInterface | undefined = undefined;
  repos: Repos[] = [];
  sckeletonLoadArry: Array<{
    className_1: string;
    className_2: string;
  }> = [];
  userName: string = '';
  repoName: string = '';
  perPage: number = 10;
  page: number = 1;
  pageOpt: number[] = [10, 25, 50, 100];
  paginatedIndexValue: number = 0;
  paginatedPageIndex: number[] = [];
  userLoading: boolean = false;
  repoLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.queryParams['userName'];
    this.getUser();
    this.getRepos();
  }

  getUser() {
    this.userLoading = true;
    this.subscription.add(
      this.apiService
        .getUser(this.userName)
        .pipe(
          tap((user: GitHubUserInterface) => {
            if (user) {
              this.user = user;
              this.paginatedIndexValue = Math.ceil(
                this.user?.public_repos! / this.perPage
              );
              this.createPagination();
              this.userLoading = false;
            }
          })
        )
        .subscribe()
    );
  }

  getRepos() {
    this.repoLoading = true;
    if (this.repoName) {
      this.subscription.add(
        this.apiService
          .searchRepos(this.userName, this.repoName, this.perPage, this.page)
          .pipe(
            take(1),
            tap((res: ApiResponse<Repos[]>) => {
              if (res) {
                this.repos = res?.items;
                this.repoLoading = false;
              }
            })
          )
          .subscribe()
      );
    } else {
      this.subscription.add(
        this.apiService
          .getUserRepos(this.userName, this.perPage, this.page)
          .pipe(
            take(1),
            tap((repos: Repos[]) => {
              this.repos = repos;
              this.repoLoading = false;
            })
          )
          .subscribe()
      );
    }
  }

  searchRepo() {
    this.getRepos();
  }

  createPagination() {
    if (this.user) {
      const pageValue = Math.ceil(this.user?.public_repos / this.perPage);
      const breakIndex =
        this.paginatedIndexValue > 5
          ? this.page + 4
          : this.page + this.paginatedIndexValue - 1;
      const totalPage = pageValue > 5 ? breakIndex : pageValue;
      this.paginatedPageIndex = [];
      for (let i = this.page; i <= totalPage; i++) {
        this.paginatedPageIndex.push(i);
      }
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      if (this.page < this.paginatedPageIndex[0] && this.user) {
        this.paginatedIndexValue = this.paginatedIndexValue + 5;
        const pageValue = Math.ceil(this.user?.public_repos / this.perPage);
        const breakIndex =
          this.paginatedIndexValue > 5
            ? this.page - 4
            : this.page + this.paginatedIndexValue + 1;
        const totalPage = pageValue > 5 ? breakIndex : pageValue;
        let tempIndexArr = [];
        this.paginatedPageIndex = [];
        for (let i = this.page; i >= totalPage; i--) {
          tempIndexArr.push(i);
        }
        this.paginatedPageIndex = tempIndexArr.sort((a, b) => a - b);
        tempIndexArr = [];
      }
      this.getRepos();
    }
  }

  nextPage() {
    if (this.repos.length) {
      this.page++;
      if (this.page > this.paginatedPageIndex[4]) {
        this.paginatedIndexValue =
          this.paginatedIndexValue > 5 ? this.paginatedIndexValue - 5 : 5;
        this.createPagination();
      }
      this.getRepos();
    }
  }

  onSelectPerPage(val: MatSelectChange) {
    this.page = 1;
    this.perPage = val?.value;
    this.getRepos();
    this.createPagination();
  }

  navigetToPage(val: number) {
    this.page = val;
    this.getRepos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
