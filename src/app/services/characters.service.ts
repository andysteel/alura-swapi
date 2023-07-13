import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Character } from '../types/character-response';

@Injectable({
  providedIn: 'root'
})
export class CharactersService extends HttpService {

  constructor(private httpClient: HttpClient) {
    super();
   }

   getCharacterByUrl(url: string) {
    return this.httpClient.get<Character>(url);
   }
}
