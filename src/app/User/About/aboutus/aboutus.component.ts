import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  imports: [CommonModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly milestones = [
    { year: '1989', description: 'Concord for Engineering and Contracting is founded.' },
    { year: '1994', description: 'Secured Ambrak projects valued at $3.2 million.' },
    { year: '2003', description: 'Penetrated the micro-tunneling sector through collaborations with government clients.' },
    { year: '2009', description: 'Took on the $57 million Amireya Utilities and Micro-tunnelling Works Project.' },
    { year: '2015', description: 'Took on the Sarabium Siphon project worth $40 million — a pivotal breakthrough for Concord.' },
    { year: '2016', description: 'Executed the Ismailia Tunnel at $988 million. Took on the Mahsama Siphon project worth $41 million.' },
    { year: '2018', description: 'Constructed the Ahmed Hamdi Tunnel, valued at $680 million, solidifying expertise in national infrastructure.' },
    { year: '2019', description: 'Expanded regionally by launching a new branch in Saudi Arabia.' },
    { year: '2019–2020', description: 'Took on Egypt’s Metro Line 4 Project, handling national transport infrastructure under the Ministry of Transportation.' },
    { year: '2023', description: 'Contributed to the "Mostaqbal Misr" (Future of Egypt) initiative, supporting the nation’s development vision.' },
    { year: '2024', description: 'Opened a new branch in Oman. Launched a major project in Saudi Arabia to replace the primary transmission line in Mecca.' }
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
