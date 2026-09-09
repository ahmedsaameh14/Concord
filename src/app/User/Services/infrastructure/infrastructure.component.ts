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
      title: 'Micro-Tunneling',
      paragraphs: [
        'Advanced trenchless technology for the installation and rehabilitation of underground utility networks, enabling efficient execution with minimal disruption to surrounding areas.'
      ]
    },
    {
      image: '/images/InfraP2.jpeg',
      title: 'Water & Wastewater Systems',
      paragraphs: [
        'End-to-end infrastructure solutions for water supply, wastewater collection, and treatment systems, designed to support reliable and sustainable utility networks.'
      ]
    },
    {
      image: '/images/InfraP1.png',
      title: 'Civil & MEP Works',
      paragraphs: [
        'Integrated civil, mechanical, and electrical solutions delivered across complex projects, including light current systems, electrical systems, and mechanical systems, ensuring seamless coordination from construction through commissioning.'
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
