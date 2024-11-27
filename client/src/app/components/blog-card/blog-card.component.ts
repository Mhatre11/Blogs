import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Blog } from '../../types/blog';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent implements OnInit {
  @Input() blog!: Blog;
  private categoryService = inject(CategoryService);
  
  categories: Category[] = [];
  categoryName: string = 'Loading...';

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoryName = this.getCategoryName();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoryName = 'Unknown';
      }
    });
  }

  getCategoryName(): string {
    const category = this.categories.find(c => c.categoryId === this.blog.categoryId);
    return category?.name || 'Unknown';
  }

  getReadTime(): number {
    const wordsPerMinute = 200;
    const wordCount = this.blog.content?.split(/\s+/)?.length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/placeholder-blog.jpg';
  }
}
