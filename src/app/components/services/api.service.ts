import { Injectable } from '@angular/core';
import { API_URL } from '../../environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Snippet } from '../types/Snippet';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
              private error: ErrorService) { }

  /**
   * @parameter id The ID of the snippet
   * @return HTTP snippets reference string
   */
  private static getSnippetURL(id: number) {
    return new URL(`/snippets/${id}`, API_URL).href;
  }
  private static postSnippetURL() {
    return new URL('/snippets/', API_URL).href;
  }
  getSnippet(id: number): Observable<Snippet> {
    return this.http.get<Snippet>(ApiService.getSnippetURL(id))
      .pipe(
        catchError(this.error.handleError<Snippet>('getSnippet', ''))
      );
  }
  postSnippet(snippet: Snippet): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<string>(ApiService.postSnippetURL(), snippet.content, {headers})
      .pipe(
        tap(data => console.log(data)),
        catchError(this.error.handleError<string>('postSnippet', ''))
      );
  }
}
