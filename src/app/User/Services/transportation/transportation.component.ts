import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transportation',
  imports: [CommonModule, RouterModule],
  templateUrl: './transportation.component.html',
  styleUrl: './transportation.component.css'
})
export class TransportationComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly capabilities = [
    {
      image: '/images/TransportationP1.jpg',
      title: 'Tunneling',
      description: 'Advanced tunnel construction for transit, utilities, and infrastructure projects, with precision engineering and safety-first execution.'
    },
    {
      image: '/images/TransportationP2.jpg',
      title: 'Railways',
      description: 'Development of high-speed and urban rail systems that enhance mass transit capacity and regional integration, from track design to signaling and stations.'
    },
    {
      image: '/images/TransportationP3.jpg',
      title: 'Roads, Bridges, and Airports',
      description: 'Comprehensive transport infrastructure solutions that include highway systems, overpasses, interchanges, and airport facilities—designed to accommodate growing transportation demands while improving safety and traffic efficiency.'
    }
  ];

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach(element => element.nativeElement.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        this.observer?.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    this.revealElements.forEach(element => this.observer?.observe(element.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

}
