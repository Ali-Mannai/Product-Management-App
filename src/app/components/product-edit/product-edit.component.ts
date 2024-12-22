import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productId: number;
  productFormGroup?: FormGroup;
  submitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    // Récupérer l'identifiant du produit à partir de l'URL
    this.productId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Charger les détails du produit à éditer
    this.productsService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productFormGroup = this.fb.group({
          id: [product.id, Validators.required],
          name: [product.name, Validators.required],
          price: [product.price, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
          quantity: [product.quantity, [Validators.required, Validators.pattern('^[0-9]+$')]],
          selected: [product.selected, Validators.required],
          available: [product.available, Validators.required]
        });
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        alert('Failed to load product details.');
      }
    });
  }

  onUpdateProduct(): void {
    this.submitted = true;

    // Vérifier si le formulaire est invalide
    if (this.productFormGroup?.invalid) return;

    // Appeler le service pour mettre à jour le produit
    this.productsService.updateProduct(this.productFormGroup?.value).subscribe({
      next: () => {
        alert('Product updated successfully!');
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Failed to update the product.');
      }
    });
  }
}
