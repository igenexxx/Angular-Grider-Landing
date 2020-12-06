import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  @Input() numberOfPages = 5;
  pageOptions: number[];

  currentPage = 1;

  constructor() {
    this.pageOptions = Array.from({ length: this.numberOfPages }, (_, index) => {
      return (-Math.floor(this.numberOfPages / 2) + index) + this.currentPage;
    }).filter(pageNumber => pageNumber > 0 && pageNumber <= this.numberOfPages);
  }

  ngOnInit(): void {
  }

}
