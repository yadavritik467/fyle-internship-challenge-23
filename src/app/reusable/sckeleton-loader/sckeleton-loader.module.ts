import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SckeletonLoaderComponent } from './sckeleton-loader.component';

@NgModule({
  declarations: [SckeletonLoaderComponent],
  imports: [CommonModule],
  exports: [SckeletonLoaderComponent],
})
export class SckeletonLoaderModule {}
