import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-page',
  imports: [RouterModule],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.css'
})
export class ServicePageComponent {
  readonly title: string;
  readonly description: string;

  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'];
    this.description = route.snapshot.data['description'];
  }
}
