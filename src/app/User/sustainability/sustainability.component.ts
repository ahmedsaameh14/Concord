import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sustainability',
  imports: [CommonModule],
  templateUrl: './sustainability.component.html',
  styleUrl: './sustainability.component.css'
})
export class SustainabilityComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly pillars = [
    {
      title: 'Social',
      description: 'Collaborating as client-focused solution providers to deliver exceptional results to all stakeholders, all the time'
    },
    {
      title: 'Governance',
      description: 'UN Principles for Human Rights & Anti-Corruption Number 1, 2 & 10.'
    },
    {
      title: 'Environmental',
      description: 'UN Principle for Labour Number 3, 4 & 6.'
    }
  ];

  readonly communityStatements = [
    {
      title: 'Corporate Social Responsibility is Good Business',
      description: 'Based on The United Nations Global Compact Platform Out of the 21,741 Entity Worldwide Corporate Participants 807 Construction Participants 5 were Identified as Egyptian Firms.'
    },
    {
      title: 'A Legacy of Community Giving',
      description: 'Compliance with UN Global Compact’s 17 Sustainable Development Goals (SDGs) to balance social and environmental outcomes against economic goals.'
    },
    {
      title: 'Sustainable Development Goals (SDGs)',
      description: 'Concord Engineering & Contracting Company is committed to specific Sustainable Development Goals (SDGs) such as the United Nations Principles for Human Rights & Anti-Corruption (Number 1, 2, and 10). They are dedicated to developing and supporting public accountability and transparency in the areas of human rights, labor, environment, and anti-corruption. This commitment is part of their strategic development towards SDGs compliance, as outlined in their corporate initiatives.'
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
