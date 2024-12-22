import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productFormGroup?: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private productsService: ProductsService) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec les validations
    this.productFormGroup = this.fb.group({
      name: ["", Validators.required],
      price: [0, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      quantity: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      selected: [true, Validators.required],
      available: [true, Validators.required]
    });
  }

  onSaveProduct() {
    this.submitted = true;

    // Vérifier si le formulaire est invalide
    if (this.productFormGroup?.invalid) return;

    // Appeler le service pour sauvegarder le produit
    this.productsService.save(this.productFormGroup!.value).subscribe({
      next: (data) => {
        alert("Product saved successfully!");
      },
      error: (err) => {
        console.error("Error saving product", err);
        alert("Failed to save product. Please try again.");
      }
    });
  }
}
