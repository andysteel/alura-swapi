import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { PageableResponse } from '../types/pageable-response';
import { Starship } from '../types/starships-response';
import { stringOrNull } from '../types/util-types';

@Injectable({
  providedIn: 'root'
})
export class StarshipsService extends HttpService {

  constructor(private httpClient: HttpClient) {
    super();
   }

   getAllStarships(page: number, search: stringOrNull) {
    if(search) {
      return this.httpClient.get<PageableResponse<Starship>>(`${this.baseUrl}/starships/?search=${search}&page=${page}`);
    }
    return this.httpClient.get<PageableResponse<Starship>>(`${this.baseUrl}/starships/?page=${page}`);
   }
}
