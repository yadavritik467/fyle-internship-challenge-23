import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';

const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'search/repo',
    loadChildren: () =>
      import('./pages/search-repo/search-repo.module').then(
        (m) => m.SearchRepoModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/nfp/nfp.module').then((m) => m.NfpModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
