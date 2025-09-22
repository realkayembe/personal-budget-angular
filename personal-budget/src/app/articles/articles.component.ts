import { Component, Input } from '@angular/core';

@Component({
  selector: 'pb-articles',
  imports: [],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {
  @Input() title: string = 'Title';
  @Input() content: string = 'Content';

}
