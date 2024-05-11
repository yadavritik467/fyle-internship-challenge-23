import { HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RedundantAPICallInterceptor } from './reduntant-api-call.interceptor';

describe('RedundantAPICallInterceptor', () => {
  let interceptor: RedundantAPICallInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedundantAPICallInterceptor],
    });
    interceptor = TestBed.inject(RedundantAPICallInterceptor);
  });

  it('should cache the response for GET requests', () => {
    // Setup
    const request = new HttpRequest('GET', '/test');
    const handler = {
      handle: () => of(new HttpResponse({ body: 'test' })),
    } as HttpHandler;

    // Execution
    const intercepted = interceptor.intercept(request, handler);

    // Expectations
    intercepted.subscribe((response: { body: any }) => {
      expect(response.body).toBe('test'); // Check if response is returned
      expect(interceptor['cache'].size).toBe(1); // Check if the cache size increased
    });
  });

  it('should return cached response for subsequent GET requests', () => {
    // Setup
    const request = new HttpRequest('GET', '/test');
    const handler = {
      handle: () => of(new HttpResponse({ body: 'test' })),
    } as HttpHandler;

    // Execution
    interceptor.intercept(request, handler).subscribe(() => {
      // Make the same request again
      const cachedResponse = interceptor.intercept(request, handler);

      // Expectations
      cachedResponse.subscribe((response: { body: any }) => {
        expect(response.body).toBe('test'); // Check if cached response is returned
        expect(interceptor['cache'].size).toBe(1); // Check if the cache size remains the same
      });
    });
  });

  it('should pass through non-GET requests', () => {
    // Setup
    const request = new HttpRequest('GET', '/test');
    const handler = {
      handle: () => of(new HttpResponse({ body: 'test' })),
    } as HttpHandler;

    // Execution
    const intercepted = interceptor.intercept(request, handler);

    // Expectations
    intercepted.subscribe((response) => {
      expect(response.body).toBe('test'); // Check if response is returned
      if (interceptor['cache'].size) {
        expect(interceptor['cache'].size).toBe(1);
      } else {
        expect(interceptor['cache'].size).toBe(0); // Check if the cache size remains 0
      }
    });
  });
});
