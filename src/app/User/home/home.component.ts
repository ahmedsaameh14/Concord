import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { Project, projectDuration } from '../../core/models/project.model';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/news.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly projectsApi = inject(ProjectService);
  private readonly articlesApi = inject(ArticleService);

  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('strengthsSection') strengthsSection!: ElementRef<HTMLElement>;

  ongoingProjects = signal<Project[]>([]);
  projectDuration = projectDuration;
  latestArticles = signal<Article[]>([]);

  readonly heroVideo = '/video/hero-vid.mp4';
  readonly sustainabilityColumns = [
    {
      title: 'Responsible Business, Sustainable Growth',
      text: 'At Concord, responsible business practices are an important part of our approach to sustainable growth. The company has engaged with the United Nations Global Compact (UNGC) and its framework for responsible business, including principles related to human rights, labor, environmental responsibility, and anti-corruption.\n\nConcord also recognizes the importance of the United Nations Sustainable Development Goals (SDGs) in supporting sustainable economic, environmental, and social development. Through responsible construction practices and long-term community development, Concord continues to work toward creating lasting value for its stakeholders and the communities it serves.'
    },
    {
      title: 'Building Better Lives',
      text: 'At Concord, “Building for the best” means more than delivering structures and infrastructure. It means creating projects that contribute to communities, improve everyday life, and support long-term development.\n\nThrough its projects and community-focused initiatives, Concord strives to enhance safety, accessibility, well-being, and quality of life. From developing essential infrastructure to delivering sustainable construction solutions, the company recognizes the impact its work can have on people and future generations.'
    },
    {
      title: 'Innovating for a Sustainable Future',
      text: 'With more than 35 years of experience and a team of over 30,000 professionals, Concord combines technical expertise with innovation to deliver projects that support sustainable development.\n\nThe company continues to explore responsible construction solutions that address evolving challenges, including environmental sustainability, resource efficiency, and inclusive urban development. Through collaboration, innovation, and responsible execution, Concord aims to contribute to a more sustainable, connected, and resilient future.'
    }
  ];

  readonly strengths = [
    { target: 600, current: 0, suffix: '+', description: 'Completed projects, showcasing technical excellence.' },
    { target: 15000, current: 0, suffix: '+', description: 'Skilled professionals, trained to adapt to diverse conditions.' },
    { target: 35, current: 0, suffix: '+', description: 'Years of industry experience, driving innovation and community development.' }
  ];

  readonly companies = [
    { source: '/images/C1.png', alt: 'Concord company one' },
    { source: '/images/C2.png', alt: 'Concord company two' },
    { source: '/images/C3.png', alt: 'Concord company three' },
    { source: '/images/C4.png', alt: 'Concord company four' },
    { source: '/images/C5.png', alt: 'Concord company five' }
  ];

  private observer?: IntersectionObserver;
  private revealChangesSubscription?: Subscription;
  private countersStarted = false;

  ngOnInit(): void {
    this.projectsApi.getProjects({ isOngoing: true, limit: 6 }).subscribe({
      next: (response) => this.ongoingProjects.set(response.data || []),
    });
    this.articlesApi.getArticles({ limit: 3 }).subscribe({
      next: (response) => this.latestArticles.set(response.data || []),
    });
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach(element => element.nativeElement.classList.add('is-visible'));
      this.startCounters();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target === this.strengthsSection.nativeElement) {
          this.startCounters();
          this.observer?.unobserve(entry.target);
        } else {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 }
    );

    this.observeRevealElements();
    this.revealChangesSubscription = this.revealElements.changes.subscribe(() => this.observeRevealElements());
    this.observer.observe(this.strengthsSection.nativeElement);
  }

  private observeRevealElements(): void {
    this.revealElements.forEach(element => {
      if (!element.nativeElement.classList.contains('is-visible')) {
        this.observer?.observe(element.nativeElement);
      }
    });
  }

  startCounters(): void {
    if (this.countersStarted) return;
    this.countersStarted = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.strengths.forEach(stat => stat.current = stat.target);
      return;
    }

    const startTime = performance.now();
    const duration = 1600;
    const animate = (time: number): void => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.strengths.forEach(stat => stat.current = Math.round(stat.target * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.revealChangesSubscription?.unsubscribe();
  }

}
