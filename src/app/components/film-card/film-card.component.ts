import { Component, Input } from '@angular/core';
import { Film } from 'src/app/types/films-response';

@Component({
  selector: 'app-film-card',
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent {

  @Input({required: true})
  film!: Film;
}
