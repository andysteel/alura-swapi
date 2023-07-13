import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { PageableResponse } from '../types/pageable-response';
import { Film } from '../types/films-response';

export type stringOrNull = string | null;

@Injectable({
  providedIn: 'root'
})
export class FilmsService extends HttpService {

  constructor(private httpClient: HttpClient) {
    super();
   }

   getAllFilms(page: number, search: stringOrNull) {
    if(search) {
      return this.httpClient.get<PageableResponse<Film>>(`${this.baseUrl}/films/?search=${search}`);
    }
    return this.httpClient.get<PageableResponse<Film>>(`${this.baseUrl}/films/?page=${page}`);
   }
}
