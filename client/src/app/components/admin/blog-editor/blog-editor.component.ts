import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { CategoryService } from '../../../services/category.service';
import { Blog } from '../../../types/blog';
import { Category } from '../../../types/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blog-editor.component.html',
})
export class BlogEditorComponent implements OnInit, OnDestroy {
  blogForm: FormGroup;
  categories: Category[] = [];
  isEditing = false;
  loading = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      image: ['', Validators.required],
      categoryId: ['', Validators.required],
      IsFeatured: [false]
    });
  }

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

    // Check if we're editing an existing blog
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.loadBlog(id);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadBlog(id: number) {
    this.loading = true;
    this.subscriptions.add(
      this.blogService.getBlogById(id).subscribe({
        next: (blog) => {
          this.blogForm.patchValue(blog);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading blog:', error);
          this.loading = false;
        }
      })
    );
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }

    this.loading = true;
    const blogData = this.blogForm.value;
    
    const request = this.isEditing
      ? this.blogService.updateBlog(this.route.snapshot.params['id'], blogData)
      : this.blogService.createBlog(blogData);

    this.subscriptions.add(
      request.subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/blogs']);
        },
        error: (error) => {
          console.error('Error saving blog:', error);
          this.loading = false;
        }
      })
    );
  }
}
