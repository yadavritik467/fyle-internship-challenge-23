import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable()
@Injectable()
export class RedundantAPICallInterceptor implements HttpInterceptor {
  private cache = new Map<string, Observable<any>>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.method !== 'GET') {
      // Pass through non-GET requests
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.urlWithParams);

    if (cachedResponse) {
      // Return cached response if available
      return cachedResponse;
    }

    // Forward the request to the next handler
    const newRequest = next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Cache the response for the first request
          this.cache.set(request.urlWithParams, of(event));
        }
      })
    );

    return newRequest;
  }
}
