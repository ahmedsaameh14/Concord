import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vision',
  imports: [CommonModule, RouterModule],
  templateUrl: './vision.component.html',
  styleUrl: './vision.component.css'
})
export class VisionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly futureStatements = [
    {
      title: 'We envision the future of construction.',
      description: 'We are always looking ahead while we apply vast experience and broad expertise to overcome your unique challenges, exceed your expectations and drive measurable value to your bottom line.'
    },
    {
      title: 'Innovative',
      description: 'We anticipate challenges and proactively develop new capabilities to address the evolving needs of our clients. Our relentless focus on innovation leads to smarter building practices and technology that reduces complexity throughout our projects.'
    },
    {
      title: 'Flexible',
      description: 'Our breadth of expertise across services and markets helps us develop unique solutions for each project’s complex challenges. We bring together the right team to find the best way forward, connecting knowledge and experience to help you reimagine what’s possible.'
    }
  ];

  readonly commitments = [
    {
      title: 'Safety',
      description: 'We will never compromise the safety of our people. Our goal is zero incidents and our lost time frequency rate is industry-leading.',
      linkLabel: 'Read more',
      route: '/safety'
    },
    {
      title: 'Sustainability',
      description: 'We look beyond sustainable construction with a holistic approach to corporate social responsibility that addresses partners, people, projects, practices and places; our 5P Model.',
      linkLabel: 'Read more',
      route: '/sustainability'
    },
    {
      title: 'Quality',
      description: 'We see projects through and proactively develop solutions to exceed expectations. Operational excellence instills quality principles that tangibly demonstrate success.',
      linkLabel: 'View projects',
      route: '/projects'
    }
  ];

  readonly coreValues = [
    { title: 'Responsibility', description: 'Being accountable for actions and decisions.' },
    { title: 'Excellence', description: 'Pursuing high standards and quality.' },
    { title: 'Safety', description: 'Prioritizing well-being and risk prevention.' },
    { title: 'Equality', description: 'Promoting fairness and respect for all.' },
    { title: 'Improvement', description: 'Continuously enhancing performance.' },
    { title: 'Teamwork', description: 'Collaborating for collective success.' }
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
