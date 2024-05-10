import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfpComponent } from './nfp.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    component: NfpComponent,
  },
];
@NgModule({
  declarations: [NfpComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class NfpModule {}
