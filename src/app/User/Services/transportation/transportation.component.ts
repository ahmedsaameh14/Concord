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
      description: 'Specialized expertise in the construction of underground transportation and infrastructure networks, with a focus on precision, safety, and efficient project delivery.'
    },
    {
      image: '/images/TransportationP2.jpg',
      title: 'Railways',
      description: 'Comprehensive railway infrastructure solutions supporting the development of modern, reliable, and efficient rail transportation networks.'
    },
    {
      image: '/images/TransportationP3.jpg',
      title: 'Roads & Bridges',
      description: 'Construction of major road networks, bridges, and associated infrastructure designed to enhance connectivity and support long-term mobility.'
    },
    {
      image: '/images/TransportationP3.jpg',
      title: 'Airports',
      description: 'Delivery of airport infrastructure and associated civil works, contributing to the development of safe, efficient, and modern aviation facilities.'
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
