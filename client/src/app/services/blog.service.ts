import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Blog } from '../types/blog';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  http = inject(HttpClient);
  constructor() {}

  getFeaturedBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.apiUrl}/api/Blog/featured`);
  }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.apiUrl}/api/Blog`);
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${environment.apiUrl}/api/Blog/${id}`);
  }

  getBlogsByCategory(categoryId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.apiUrl}/api/Blog/category/${categoryId}`);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Blog/${id}`);
  }

  createBlog(blog: Blog): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Blog`, blog);
  }

  updateBlog(id: number, blog: Blog): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Blog/${id}`, blog);
  }
}
