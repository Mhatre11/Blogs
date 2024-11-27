import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../types/blog';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
})
export class BlogComponent implements OnInit, OnDestroy {
  blog: Blog | null = null;
  relatedPosts: Blog[] = [];
  categories: Category[] = [];
  loading = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    // Load categories
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

    // Load blog post when route params change
    this.subscriptions.add(
      this.route.params.subscribe({
        next: (params) => {
          const id = Number(params['id']);
          if (id) {
            this.loadBlog(id);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadBlog(id: number) {
    this.loading = true;
    this.subscriptions.add(
      this.blogService.getBlogById(id).subscribe({
        next: (blog) => {
          this.blog = blog;
          this.loadRelatedPosts(blog.categoryId);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading blog:', error);
          this.loading = false;
        }
      })
    );
  }

  loadRelatedPosts(categoryId: number) {
    this.subscriptions.add(
      this.blogService.getBlogsByCategory(categoryId).subscribe({
        next: (blogs) => {
          // Filter out current blog and get up to 3 related posts
          this.relatedPosts = blogs
            .filter(blog => blog.blogId !== this.blog?.blogId)
            .slice(0, 3);
        },
        error: (error) => {
          console.error('Error loading related posts:', error);
          this.relatedPosts = []; // Clear related posts on error
        }
      })
    );
  }

  getCategoryName(): string {
    if (!this.blog) return '';
    const category = this.categories.find(c => c.categoryId === this.blog?.categoryId);
    return category?.name || 'Uncategorized';
  }

  getHeadings(): { id: string; text: string }[] {
    if (!this.blog?.content) return [];
    
    const div = document.createElement('div');
    div.innerHTML = this.blog.content;
    
    return Array.from(div.querySelectorAll('h1, h2, h3'))
      .map(heading => ({
        id: this.generateId(heading.textContent || ''),
        text: heading.textContent || ''
      }));
  }

  generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  share(platform: 'twitter' | 'facebook' | 'linkedin') {
    if (!this.blog) return;

    const url = window.location.href;
    const text = encodeURIComponent(this.blog.title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(shareUrls[platform], '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/images/placeholder-blog.jpg';
    }
  }
}
