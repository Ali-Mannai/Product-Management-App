import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/product.model';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppDataState, DataStateEnum } from '../../state/product.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<AppDataState<Product[]>> | null = null;
  readonly DataStateEnum = DataStateEnum;

  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.onGetAllProducts();
  }

  onGetAllProducts(): void {
    this.products$ = this.productsService.getAllProducts().pipe(
      map(data => ({
        dataState: DataStateEnum.LOADED,
        data: data
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err =>
        of({
          dataState: DataStateEnum.ERROR,
          errorMessage: err.message
        })
      )
    );
  }

  onGetSelectedProducts(): void {
    this.products$ = this.productsService.getSelectedProducts().pipe(
      map(data => ({
        dataState: DataStateEnum.LOADED,
        data: data
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err =>
        of({
          dataState: DataStateEnum.ERROR,
          errorMessage: err.message
        })
      )
    );
  }

  onGetAvailableProducts(): void {
    this.products$ = this.productsService.getAvailableProducts().pipe(
      map(data => ({
        dataState: DataStateEnum.LOADED,
        data: data
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err =>
        of({
          dataState: DataStateEnum.ERROR,
          errorMessage: err.message
        })
      )
    );
  }

  onSearch(dataForm: any): void {
    this.products$ = this.productsService.searchProducts(dataForm.keyword).pipe(
      map(data => ({
        dataState: DataStateEnum.LOADED,
        data: data
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err =>
        of({
          dataState: DataStateEnum.ERROR,
          errorMessage: err.message
        })
      )
    );
  }

  onSelect(p: Product): void {
    this.productsService.select(p).subscribe(data => {
      p.selected = data.selected;
    });
  }

  onDelete(p: Product): void {
    let confirmDelete = confirm('Etes-vous sûr de vouloir supprimer ce produit ?');
    if (confirmDelete) {
      this.productsService.deleteProduct(p).subscribe(() => {
        this.onGetAllProducts();
      });
    }
  }

  onNewProduct(): void {
    this.router.navigateByUrl('/newProduct');
  }

  onEdit(p: Product): void {
    this.router.navigateByUrl('/editProduct/' + p.id);
  }
}
