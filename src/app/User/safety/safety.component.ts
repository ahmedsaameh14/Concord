import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-safety',
  imports: [CommonModule],
  templateUrl: './safety.component.html',
  styleUrl: './safety.component.css'
})
export class SafetyComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly safetyApproach = [
    {
      title: 'We see with a 360-degree approach',
      description: 'Our proven approach integrates an emergency preparedness plan, public safety measures, trade partner training, and jobsite cleanliness. These elements form the foundation of our strong safety culture.'
    },
    {
      title: 'We lead the way',
      description: 'Thinking about safety through a different lens starts at the top: our senior leaders invest time and resources in the most advanced technologies and equipment, but they also empower each employee to feel responsible for creating our safety culture.'
    },
    {
      title: 'We watch out for each other',
      description: 'We want every employee and trade partner to feel that they are part of a common good and cohesive team. We help our teams form stronger relationships with trade partners by emphasizing people and teamwork over processes and checklists.'
    }
  ];

  readonly awards = [
    { date: '2022', award: 'Presidents Safety Award and Excellence in Safety', organization: 'The Construction Employers’ Association' },
    { date: '2021', award: 'The Million Work Hours Award (2 Million Hours)', organization: 'The National Safety Council' },
    { date: '2021', award: 'Occupational Excellence Achievement Award (2020)', organization: 'The National Safety Council' }
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
