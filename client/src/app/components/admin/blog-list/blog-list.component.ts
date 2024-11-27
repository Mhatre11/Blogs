import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { CategoryService } from '../../../services/category.service';
import { Blog } from '../../../types/blog';
import { Category } from '../../../types/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html',
})
export class BlogListComponent implements OnInit, OnDestroy {
  blogs: Blog[] = [];
  categories: Category[] = [];
  loading = false;
  private subscriptions = new Subscription();

  constructor(
    private blogService: BlogService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadBlogs();
    this.loadCategories();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadBlogs() {
    this.loading = true;
    this.subscriptions.add(
      this.blogService.getAllBlogs().subscribe({
        next: (blogs) => {
          this.blogs = blogs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading blogs:', error);
          this.loading = false;
        }
      })
    );
  }

  loadCategories() {
    this.subscriptions.add(
      this.categoryService.getAllCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      })
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.categoryId === categoryId);
    return category?.name || 'Uncategorized';
  }

  deleteBlog(id: number) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this blog?')) {
      this.loading = true;
      this.subscriptions.add(
        this.blogService.deleteBlog(id).subscribe({
          next: () => {
            this.blogs = this.blogs.filter(blog => blog.blogId !== id);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting blog:', error);
            this.loading = false;
          }
        })
      );
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/images/placeholder-blog.jpg';
    }
  }
}
