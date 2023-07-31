import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {

  @Input({required: true})
  title!: string;

  @Input({required: true})
  isLoading = false;

  @Input()
  template!: TemplateRef<any>;

}
