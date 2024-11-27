import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../../types/blog';
import { BlogService } from '../../../services/blog.service';
import { Category } from '../../../types/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-manage-blogs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-blogs.component.html',
  styleUrl: './manage-blogs.component.css',
})
export class ManageBlogsComponent {
  blogs: Blog[] = [];
  displayBlogs: Blog[] = [];
  categories: Category[] = [];

  blogService = inject(BlogService);
  categoryService = inject(CategoryService);

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  searchTerm: string = '';

  ngOnInit() {
    this.blogService.getAllBlogs().subscribe((result) => {
      this.blogs = result;
      this.totalPages = Math.ceil(this.blogs.length / this.pageSize);
      this.displayBlogs = this.blogs.slice(0, this.pageSize);
    });
    this.categoryService.getAllCategories().subscribe((result) => {
      this.categories = result;
    });
  }

  goToPage(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }

    this.displayBlogs = this.blogs.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  nextPage() {
    this.goToPage('next');
  }
  previousPage() {
    this.goToPage('prev');
  }

  getCategoryName(blog: Blog): string {
    return (
      this.categories.find((category) => category.categoryId == blog.categoryId)
        ?.name || ''
    );
  }

  delete(data: Blog) {
    this.blogService.deleteBlog(data.blogId!).subscribe(() => {
      this.displayBlogs = this.blogs.filter(
        (blog) => blog.blogId !== data.blogId
      );
    });
  }
}
