import { TestBed } from '@angular/core/testing';

import { ReduntantApiCallInterceptor } from './reduntant-api-call.interceptor';

describe('ReduntantApiCallInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReduntantApiCallInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ReduntantApiCallInterceptor = TestBed.inject(ReduntantApiCallInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
