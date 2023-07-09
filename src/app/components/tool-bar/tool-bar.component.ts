import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {
  isMenuHidden = true;

  constructor(private router: Router) {}


  showMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

  navigate(rota: string) {
    this.router.navigate([rota]);
    this.isMenuHidden = true;
  }
}
