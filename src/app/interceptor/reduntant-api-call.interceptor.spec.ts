import { TestBed } from '@angular/core/testing';

import { RedundantAPICallInterceptor } from './reduntant-api-call.interceptor';

describe('RedundantAPICallInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [RedundantAPICallInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: RedundantAPICallInterceptor = TestBed.inject(
      RedundantAPICallInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
