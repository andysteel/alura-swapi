import { Component, Input } from '@angular/core';
import { Starship } from 'src/app/types/starships-response';

@Component({
  selector: 'app-starship-card',
  templateUrl: './starship-card.component.html',
  styleUrls: ['./starship-card.component.scss']
})
export class StarshipCardComponent {

  @Input({required: true})
  starship!: Starship;


}
