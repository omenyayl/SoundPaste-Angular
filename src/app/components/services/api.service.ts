import { Injectable } from '@angular/core';
import { API_URL } from '../../environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Snippet } from '../types/Snippet';
import {catchError} from 'rxjs/operators';
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
  getSnippet(id: number): Observable<Snippet> {
    return this.http.get<Snippet>(ApiService.getSnippetURL(id))
      .pipe(
        catchError(this.error.handleError<Snippet>('getSnippet', {}))
      );
  }
}
