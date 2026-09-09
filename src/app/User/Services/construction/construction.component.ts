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
      title: 'Residential Communities',
      description: 'Development and construction of residential communities designed around functionality, quality, and the evolving needs of modern communities.'
    },
    {
      image: '/images/ConstructionP2.jpg',
      title: 'Sports Complexes',
      description: 'Construction of purpose-built sports facilities that combine functionality, durability, and high-performance infrastructure.'
    },
    {
      image: '/images/ConstructionP3.jpg',
      title: 'Governmental Buildings',
      description: 'Delivery of complex governmental and public-sector facilities, meeting stringent standards for quality, functionality, security, and performance.'
    },
    {
      image: '/images/ConstructionP4.jpg',
      title: 'Commercial & Administrative Buildings',
      description: 'Construction of modern commercial and administrative developments, integrating efficient design, quality execution, and the requirements of contemporary business environments.'
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
