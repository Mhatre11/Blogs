import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../types/category';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../types/blog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { catchError, finalize, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorModule, RouterLink, FontAwesomeModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogFormComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  categories: Category[] = [];
  loading = false;
  submitted = false;
  isEdit = false;
  faArrowLeft = faArrowLeft;
  error: string | null = null;

  blogForm = this.formBuilder.group({
    blogId: [0],
    title: ['', [Validators.required, Validators.minLength(3)]],
    image: ['', [Validators.required, Validators.pattern('^https?://.*$')]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
    IsFeatured: [false]
  });

  editorConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;     
        font-size: 16px;
        color: #000000;
      }
      @media (forced-colors: active) {
        body {
          forced-color-adjust: none;
        }
        img {
          forced-color-adjust: none;
        }
      }
    `,
    skin: 'oxide',
    promotion: false,
    branding: false,
    style_formats: [
      { title: 'Headings', items: [
        { title: 'Heading 1', format: 'h1' },
        { title: 'Heading 2', format: 'h2' },
        { title: 'Heading 3', format: 'h3' }
      ]},
      { title: 'Inline', items: [
        { title: 'Bold', format: 'bold' },
        { title: 'Italic', format: 'italic' },
        { title: 'Underline', format: 'underline' }
      ]},
      { title: 'Blocks', items: [
        { title: 'Paragraph', format: 'p' },
        { title: 'Blockquote', format: 'blockquote' }
      ]}
    ],
    formats: {
      alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'text-left' },     
      aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'text-center' }, 
      alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'text-right' },   
      bold: { inline: 'span', classes: 'font-bold' },
      italic: { inline: 'span', classes: 'italic' }
    }
  };

  ngOnInit(): void {
    this.loadCategories();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadBlog(id);
    }
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getAllCategories()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading categories:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            error: error.error
          });
          
          let errorMessage = 'Failed to load categories. ';
          if (error.status === 0) {
            errorMessage += 'Cannot connect to the server. Please check if the API is running.';
          } else {
            errorMessage += 'Please try refreshing the page.';
          }
          this.error = errorMessage;
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(categories => {
        this.categories = categories;
        console.log('Loaded categories:', categories);
      });
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.error = null;

    this.blogService.getBlogById(id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading blog:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            error: error.error
          });
          this.error = 'Failed to load blog. Please try refreshing the page.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(blog => {
        if (blog) {
          this.blogForm.patchValue(blog);
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.blogForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.blogForm.value;
    const model: Blog = {
      blogId: formValue.blogId || 0,
      title: formValue.title || '',
      image: formValue.image || '',
      categoryId: Number(formValue.categoryId) || 0,
      description: formValue.description || '',
      content: formValue.content || '',
      IsFeatured: formValue.IsFeatured || false
    };

    const request = this.isEdit
      ? this.blogService.updateBlog(model.blogId, model)
      : this.blogService.createBlog(model);

    request
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error saving blog:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            error: error.error
          });
          this.error = 'Failed to save blog. Please try again.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response !== null) {
          this.router.navigate(['/admin/blogs']);
        }
      });
  }

  get f() {
    return this.blogForm.controls;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder-blog.jpg';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.blogForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.errors['minlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['pattern']) {
      return `Please enter a valid URL starting with http:// or https://`;
    }
    if (control.errors['min']) {
      return `Please select a category`;
    }

    return 'Invalid input';
  }
}
