import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-infrastructure',
  imports: [CommonModule, RouterModule],
  templateUrl: './infrastructure.component.html',
  styleUrl: './infrastructure.component.css'
})
export class InfrastructureComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly capabilities = [
    {
      image: '/images/InfraP1.jpg',
      title: 'Micro-Tunneling Projects',
      paragraphs: [
        'We specialize in trenchless technology solutions that minimize surface disruption and environmental impact while ensuring efficient underground utility installations.',
        'Our micro-tunneling services support the development of reliable underground infrastructure in urban and high-density areas.'
      ]
    },
    {
      image: '/images/InfraP2.jpeg',
      title: 'Water Systems Projects',
      paragraphs: [
        'From water treatment facilities to large-scale transmission pipelines, Concord designs and executes water systems that meet the highest standards of efficiency, safety, and sustainability. These systems are tailored to support communities, industries, and government entities across the region.'
      ]
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
