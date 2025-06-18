import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCustomPreloaderService } from './app-custom-preloader.service';
import { LinkComponent } from './pages/link/link.component';

const routes: Routes = [ 
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./pages/home/modules/home.module').then((m) => m.HomeModule)},
  {path: 'page', loadChildren: () => import('./pages/container/container.module').then((m) => m.ContainerModule)},
  { path: 'link/:token', component: LinkComponent }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppCustomPreloaderService,
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppRoutingModule { }
