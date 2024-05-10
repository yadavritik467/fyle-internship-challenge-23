import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AppMaterialModule } from './app.material.module';
import { ToastrModule } from 'ngx-toastr';
import { RedundantAPICallInterceptor } from './interceptor/reduntant-api-call.interceptor';
import { SckeletonLoaderModule } from './reusable/sckeleton-loader/sckeleton-loader.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SckeletonLoaderModule, // for using sckeleton loader
    AppRoutingModule,
    AppMaterialModule,
    ToastrModule.forRoot(), // for using toaster
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RedundantAPICallInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
