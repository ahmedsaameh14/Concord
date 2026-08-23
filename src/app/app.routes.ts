import { Routes } from '@angular/router';
import { LayoutComponent } from './User/layout/layout.component';
import { HomeComponent } from './User/home/home.component';
import { AboutusComponent } from './User/About/aboutus/aboutus.component';
import { ManagementComponent } from './User/About/management/management.component';
import { InfrastructureComponent } from './User/Services/infrastructure/infrastructure.component';
import { TransportationComponent } from './User/Services/transportation/transportation.component';
import { ConstructionComponent } from './User/Services/construction/construction.component';
import { HistoryComponent } from './User/history/history.component';
import { VisionComponent } from './User/vision/vision.component';
import { TermsComponent } from './User/terms/terms.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about/who-we-are', component: AboutusComponent },
            { path: 'about/management', component: ManagementComponent },
            { path: 'services/infrastructure', component: InfrastructureComponent },
            { path: 'services/transportation', component: TransportationComponent },
            { path: 'services/construction', component: ConstructionComponent },
            { path: 'history', component: HistoryComponent },
            { path: 'vision', component: VisionComponent },
            { path: 'legal/terms', component: TermsComponent }    
        ]
    }
];
