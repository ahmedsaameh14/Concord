import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-construction',
  imports: [CommonModule, RouterModule],
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.css'
})
export class ConstructionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly capabilities = [
    {
      image: '/images/ConstructionP1.jpeg',
      title: 'Residential Community',
      description: 'Master-planned developments that provide sustainable living solutions, modern amenities, and smart infrastructure for growing populations.'
    },
    {
      image: '/images/ConstructionP2.jpg',
      title: 'Sports Complex',
      description: 'High-performance facilities designed to host local and international events, built with advanced materials and compliance with global sporting standards.'
    },
    {
      image: '/images/ConstructionP3.jpg',
      title: 'Government Buildings',
      description: 'Secure, functional, and future-ready facilities that serve public sector needs and promote operational excellence in governance and civic service delivery.'
    },
    {
      image: '/images/ConstructionP4.jpg',
      title: 'Commercial & Administrative Buildings',
      description: 'Innovative and efficient business spaces that reflect the evolving needs of today’s corporate and commercial environments, built for flexibility, comfort, and productivity.'
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
