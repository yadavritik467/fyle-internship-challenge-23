import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sckeleton-loader',
  templateUrl: './sckeleton-loader.component.html',
  styleUrls: ['./sckeleton-loader.component.scss'],
})
export class SckeletonLoaderComponent implements OnInit {
  sckeletonLoadArry: Array<{
    className_1: string;
    className_2: string;
  }> = [];

  @Input() mainClass: string = '';
  @Input() className_1: string = '';
  @Input() className_2: string = '';

  ngOnInit(): void {
    this.createSckeletonLoader();
  }

  //  created array for using the same class in html
  createSckeletonLoader() {
    for (let i = 1; i <= 10; i++) {
      const className_1 = this.className_1;
      const className_2 = this.className_2;
      this.sckeletonLoadArry.push({ className_1, className_2 });
    }
  }
}
