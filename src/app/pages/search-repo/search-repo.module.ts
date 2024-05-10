import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SearchRepoComponent } from './search-repo.component';
import { AppMaterialModule } from 'src/app/app.material.module';
import { SckeletonLoaderModule } from 'src/app/reusable/sckeleton-loader/sckeleton-loader.module';

const routes: Route[] = [
  {
    path: '',
    component: SearchRepoComponent,
  },
];

@NgModule({
  declarations: [SearchRepoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppMaterialModule,
    SckeletonLoaderModule,
  ],
})
export class SearchRepoModule {}
