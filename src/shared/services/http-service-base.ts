import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';

@Injectable()
export class HttpServiceBase {
  private readonly DEFAULT_TIMEOUT = 5000; // 5 seconds
  private readonly RETRY_ATTEMPTS = 3;

  constructor(private httpService: HttpService) {}

  private handleError(
    error: any,
    url?: string,
    config?: AxiosRequestConfig,
    data?: any,
  ) {
    console.error('Request Error:', {
      url,
      headers: config?.headers,
      error: error?.response || error,
      data: data,
    });

    let message: string;

    if (error instanceof TimeoutError) {
      message = 'Request timed out';
    } else {
      message =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
    }

    const status = error.response?.status || 500;

    return throwError(() => new HttpException(message, status));
  }

  get<T>(url: string, config: AxiosRequestConfig = {}): Observable<T> {
    return this.httpService.get<T>(url, config).pipe(
      timeout(config.timeout || this.DEFAULT_TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      map((response) => response.data),
      catchError((error) => this.handleError(error, url, config)),
    );
  }

  post<T>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
  ): Observable<T> {
    return this.httpService.post<T>(url, data, config).pipe(
      timeout(config.timeout || this.DEFAULT_TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      map((response) => response.data),
      catchError((error) => this.handleError(error, url, config, data)),
    );
  }

  put<T>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
  ): Observable<T> {
    return this.httpService.put<T>(url, data, config).pipe(
      timeout(config.timeout || this.DEFAULT_TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      map((response) => response.data),
      catchError((error) => this.handleError(error, url, config)),
    );
  }

  patch<T>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
  ): Observable<T> {
    return this.httpService.patch<T>(url, data, config).pipe(
      timeout(config.timeout || this.DEFAULT_TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      map((response) => response.data),
      catchError((error) => this.handleError(error, url, config)),
    );
  }

  delete<T>(url: string, config: AxiosRequestConfig = {}): Observable<T> {
    return this.httpService.delete<T>(url, config).pipe(
      timeout(config.timeout || this.DEFAULT_TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      map((response) => response.data),
      catchError((error) => this.handleError(error, url, config)),
    );
  }
}
