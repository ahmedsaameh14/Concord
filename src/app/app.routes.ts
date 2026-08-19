import { Routes } from '@angular/router';
import { LayoutComponent } from './User/layout/layout.component';
import { HomeComponent } from './User/home/home.component';
import { AboutusComponent } from './User/About/aboutus/aboutus.component';
import { ServicePageComponent } from './User/ServicePage/service-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about/who-we-are', component: AboutusComponent },
            {
                path: 'services/infrastructure',
                component: ServicePageComponent,
                data: {
                    title: 'Infrastructure',
                    description: 'Sustainable water and wastewater solutions delivered through strategic innovation and engineering excellence.'
                }
            },
            {
                path: 'services/transportation',
                component: ServicePageComponent,
                data: {
                    title: 'Transportation',
                    description: 'Transportation projects shaped by uncompromising standards of quality, safety, connectivity, and mobility.'
                }
            },
            {
                path: 'services/construction',
                component: ServicePageComponent,
                data: {
                    title: 'Construction',
                    description: 'Transformative large-scale construction projects delivered with precision, expertise, and lasting impact.'
                }
            },
        ]
    }
];
