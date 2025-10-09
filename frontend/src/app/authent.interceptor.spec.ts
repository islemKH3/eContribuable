import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { authentInterceptor } from './authent.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: HTTP_INTERCEPTORS, useClass: authentInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add the Authorization header', () => {
    const dummyUrl = '/test';
    const dummyResponse = { message: 'Success' };

    // Make the HTTP request
    httpClient.get(dummyUrl).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    // Assert that the request has the expected Authorization header
    const req = httpMock.expectOne(dummyUrl);
    expect(req.request.headers.has('Authorization')).toBeTrue(); // Check for the header
    expect(req.request.headers.get('Authorization')).toBe('Bearer your-token'); // Replace 'your-token' with the expected token
    req.flush(dummyResponse); // Simulate a response
  });

  afterEach(() => {
    httpMock.verify(); // Ensure there are no outstanding HTTP requests after each test
  });
});
