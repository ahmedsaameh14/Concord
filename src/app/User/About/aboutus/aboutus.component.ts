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

  readonly branches = [
    {
      image: '/images/Picture1.png',
      name: 'CONCORD FOR ENGINEERING AND CONTRACTING (Headquarters)',
      description: 'Cairo, Egypt'
    },
    {
      image: '/images/Picture1.png',
      name: 'Branch of Concord (KSA)',
      description: 'Multidisciplinary construction company based in Jeddah.'
    },
    {
      image: '/images/Picture1.png',
      name: 'CONCORD- (OMAN)',
      description: 'Multidisciplinary construction company based in Muscat.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Branch of Concord (UAE)',
      description: 'Multidisciplinary construction company based in Dubai.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Branch of Concord (Iraq)',
      description: 'Multidisciplinary construction company based in Iraq.'
    }
  ];

  readonly subsidiary = {
    image: '/images/Picture7.png',
    name: 'Building Materials Industrial Co. (BMIC)',
    description: 'An industrial company specialized in the production of cement. BMIC currently serves the market with high-quality Ordinary Portland Cement (OPC) but has growth and expansion plans to futuristically produce various types of grey Portland cement, clinker and related products such as cement bricks and ready-mix concrete.'
  };

  readonly sisterCompanies = [
    {
      image: '/images/Picture5.png',
      name: 'Concord for Real Estate Development',
      description: 'A real estate developer with 2 of the iconic commercial and high-end projects in New Cairo.'
    },
    {
      image: '/images/Picture2.png',
      name: 'Concord for Construction and Paving',
      description: 'A grade one company specialized in the construction of roads, highways, bridges, and railways.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Concord Industrial Development (El Falankat)',
      description: 'Manufacture of railway ties, management, and operation of subway and railway lines.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Concord Building Materials Company',
      description: 'A factory for producing various types of cement, cement bricks, and ready-mixed concrete.'
    },
    {
      image: '/images/Picture8.png',
      name: 'Concord for Pipes El Masrya Concord',
      description: 'An industrial company specialized in the production of steel spiral wielding pipes.'
    },
    {
      image: '/images/Picture11.jpg',
      name: 'Avant Modern Construction Company',
      description: 'Engineering design works and general and specialized contracts.'
    },
    {
      image: '/images/Picture12.jpg',
      name: 'Innovate Electromechanical Contracting Company',
      description: 'Electromechanical and electronic contracting works.'
    },
    {
      image: '/images/Picture13.jpg',
      name: 'Pioneer Steel Construction Company',
      description: 'Manufacturer of metal structures.'
    }
  ];

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach(element => element.nativeElement.classList.add('is-visible'));
    } else {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        });
      }, { threshold: 0.14 });

      this.revealElements.forEach(element => this.observer?.observe(element.nativeElement));
    }

  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

}
