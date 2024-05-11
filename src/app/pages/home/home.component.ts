import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Subscription, take, tap } from 'rxjs';
import { ApiResponse, Users } from 'src/app/interface/all-interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  userName: string = this.apiService.userName;
  perPage: number = this.apiService.perPage;
  page: number = this.apiService.page;
  pageOpt: number[] = [10, 25, 50, 100];
  paginatedIndexValue: number = 0;
  paginatedPageIndex: number[] = [];
  users: Users[] = [];
  totalLength: number | null = null;
  isLoading: boolean = false;
  createPaginationCalled: boolean = false;

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.searchUser();
  }

  searchUser() {
    this.isLoading = true;
    this.subscription.add(
      this.apiService
        .searchUser(this.userName, this.perPage, this.page)
        .pipe(
          take(1),
          tap((res: ApiResponse<Users[]>) => {
            if (res) {
              this.users = res?.items;
              this.totalLength = res?.total_count;
              this.paginatedIndexValue = Math.ceil(
                this.totalLength / this.perPage
              );
              if (!this.createPaginationCalled) {
                this.createPagination();
                this.createPaginationCalled = true; // Set the flag to true after first call
              }
              this.isLoading = false;
            }
          })
        )
        .subscribe()
    );
  }

  createPagination() {
    if (this.totalLength) {
      const pageValue = Math.ceil(this.totalLength / this.perPage);
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
      if (this.page < this.paginatedPageIndex[0] && this.totalLength) {
        this.paginatedIndexValue = this.paginatedIndexValue + 5;
        const pageValue = Math.ceil(this.totalLength / this.perPage);
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
        this.paginatedPageIndex = tempIndexArr.sort((a, b) => a - b); // for setting the index in asscending order
        tempIndexArr = [];
      }
      this.searchUser();
    }
  }

  nextPage() {
    if (this.totalLength) {
      this.page++;
      if (this.page > this.paginatedPageIndex[4]) {
        this.paginatedIndexValue =
          this.paginatedIndexValue > 5 ? this.paginatedIndexValue - 5 : 5;
        this.createPagination();
      }
      this.searchUser();
    }
  }

  onSelectPerPage(val: MatSelectChange) {
    this.page = 1;
    this.perPage = val?.value;
    this.searchUser();
    this.createPagination();
  }

  // navigating to the search repo page
  navigateToPage(user: Users) {
    this.router.navigate(['/search/repo'], {
      queryParams: { userName: user?.login },
    });
  }

  navigetToPageThroughPaginate(val: number) {
    this.page = val;
    this.searchUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
