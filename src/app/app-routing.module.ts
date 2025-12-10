import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services/services.component';
import { BlogComponent } from './blog/blog.component';

const routes: Routes = [
   {
    path: '',
    component: homeComponent,
  },
  {
    path: '',
    component: HeaderComponent
  },
  {
    path: '',
    component: FooterComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'blog',
    component: BlogComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

