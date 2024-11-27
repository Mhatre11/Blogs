import { Component, OnInit, inject } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../types/blog';
import { RouterLink } from '@angular/router';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  name: string;
  icon: string;
  articleCount: number;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BlogCardComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  blogService = inject(BlogService);
  authService = inject(AuthService);

  featuredBlogs: Blog[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  categories: Category[] = [
    {
      name: 'Travel',
      icon: 'plane',
      articleCount: 15,
      color: 'primary',
    },
    {
      name: 'Technology',
      icon: 'laptop',
      articleCount: 12,
      color: 'secondary',
    },
    {
      name: 'Food',
      icon: 'utensils',
      articleCount: 8,
      color: 'accent',
    },
    {
      name: 'Sports',
      icon: 'trophy',
      articleCount: 5,
      color: 'info',
    },
  ];

  emailSubscription: string = '';
  isSubscribing: boolean = false;
  subscriptionMessage: { text: string; type: 'success' | 'error' } | null =
    null;

  ngOnInit() {
    this.loadFeaturedBlogs();
  }

  private loadFeaturedBlogs() {
    this.isLoading = true;
    this.blogService.getFeaturedBlogs().subscribe({
      next: (blogs) => {
        this.featuredBlogs = blogs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured blogs:', error);
        this.error = 'Failed to load blogs. Please try again later.';
        this.isLoading = false;
        this.featuredBlogs = [];
      },
    });
  }

  onSubscribe() {
    if (!this.emailSubscription || !this.isValidEmail(this.emailSubscription)) {
      this.subscriptionMessage = {
        text: 'Please enter a valid email address',
        type: 'error',
      };
      return;
    }

    this.isSubscribing = true;
    // Implement your newsletter subscription logic here
    setTimeout(() => {
      this.isSubscribing = false;
      this.subscriptionMessage = {
        text: 'Thank you for subscribing!',
        type: 'success',
      };
      this.emailSubscription = '';

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.subscriptionMessage = null;
      }, 3000);
    }, 1000);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
