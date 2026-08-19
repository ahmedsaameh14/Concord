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

  readonly groupCompanies = [
    {
      image: '/images/Picture1.png',
      name: 'CONCORD FOR ENGINEERING AND CONTRACTING'
    },
    {
      image: '/images/Picture2.png',
      name: 'CONCORD FOR CONTRACTING AND PAVING',
      description: 'A grade one company specialized in the construction of roads, highways, bridges and railways.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Branch of Concord (KSA)',
      description: 'Multidisciplinary construction company based in Jeddah'
    },
    {
      image: '/images/Picture1.png',
      name: 'CONCORD- OMAN',
      description: 'Multidisciplinary construction company based in Muscat.'
    },
    {
      image: '/images/Picture1.png',
      name: 'Branch of Concord (UAE)',
      description: 'Multidisciplinary construction company based in Dubai.'
    },
    {
      image: '/images/Picture4.png',
      name: 'JOZOOR LANDSCAPE',
      description: 'JOZOOR Landscapes has proven high quality and capability in providing complete Design & Build packages for Hard & Soft-scape Projects.'
    },
    {
      image: '/images/Picture5.png',
      name: 'CONCORD FOR REAL ESTATE DEVELOPMENT',
      description: 'A Real Estate Developer with 2 of the iconic commercial and high-end projects in New Cairo.'
    },
    {
      image: '/images/Picture6.png',
      name: 'CONCORD MYTHICAL SANDS LTD (CYPRUS)',
      description: 'A Real Estate and Hospitality company based and operating in Cyprus.'
    },
    {
      image: '/images/Picture7.png',
      name: 'BUILDING MATERIALS INDUSTRIAL CO. (BMIC)',
      description: 'An Industrial company specialized in the production of cement. BMIC currently serves the market with high-quality Ordinary Portland Cement (OPC) but has growth and expansion plans to futuristically produce various types of grey Portland cement, clinker and related products such as cement bricks and ready-mix concrete.'
    },
    {
      image: '/images/Picture8.png',
      name: 'CONCORD FOR PIPES EL MASRYA CONCORD',
      description: 'An industrial company specialized in the production of steel spiral welding pipes'
    },
    {
      image: '/images/Picture9.jpg',
      name: 'CAPITAL DEVELOPMENTS',
      description: 'An investment company that invests in hospitality & real estate. The company is developing Laguna Bay one of Al Ain El Sokhna’s largest touristic destinations on the red sea. Laguna Bay offers around 2,000 units with different types and sizes.'
    },
    {
      image: '/images/Picture10.png',
      name: 'THE FRONT DEVELOPMENTS',
      description: 'A Real Estate development company. The newest project is located on the west end of Cairo, one of the most thriving destinations on the Cairo Alex Desert Road. It caters to commercial, residential and entertainment outlets.'
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
