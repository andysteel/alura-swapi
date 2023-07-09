import { Component } from '@angular/core';
import * as films from '../../../mock/films.json';
import { PageableResponse } from 'src/app/types/pageable-response';
import { Film } from 'src/app/types/films-response';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss']
})
export class FilmesComponent {

  filmsResponse: PageableResponse<Film> = films;

  handlePageEvent($event: PageEvent) {
    //TODO
    console.log($event)
  }
}
