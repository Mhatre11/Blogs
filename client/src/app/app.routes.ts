import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogComponent } from './components/blog/blog.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { BlogListComponent } from './components/admin/blog-list/blog-list.component';
import { BlogFormComponent } from './components/admin/blog-form/blog-form.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'blogs',
    component: BlogsComponent,
  },
  {
    path: 'blog/:id',
    component: BlogComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { requiresAdmin: true },
    children: [
      {
        path: 'blogs',
        component: BlogListComponent
      },
      {
        path: 'blogs/create',
        component: BlogFormComponent
      },
      {
        path: 'blogs/edit/:id',
        component: BlogFormComponent
      }
    ]
  }
];
