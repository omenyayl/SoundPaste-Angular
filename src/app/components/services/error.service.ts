import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }
  handleError<T>(operation, result) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
