import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../../model/product';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  //Observable is a type to handle asnchronous data streams
  products:Observable<Product[]> | any;
  message:string='';

  constructor(private productService:ProductService,
    private router:Router) { }

    ngOnInit():void{  //Angular Life Cycle Method ngOnInit() - Invoked when the component is initialisation.
      this.reloadData();
    }

    reloadData(){
      this.productService.getProductList().subscribe({
        next: (data) => {
          this.products = data;

        },
        error: (err) => {
          console.error('Error fetching product list:', err.message);
        }
      });
    }

    addProduct():void{
      this.router.navigate(['/add-product/_add']);
    }

    productDetails(pid:number):void{
      this.router.navigate(['/product-details',pid]);
    }
    
    editProduct(pid:number):void{
      this.router.navigate(['/add-product',pid]);
    }

    deleteProduct(pid:number):void{
      this.productService.deleteProduct(pid).subscribe({
        next: () => {
          this.message = 'Product deleted successfully.';
          setTimeout(() => {
            this.message = '';
            this.reloadData();  // Refresh products list after deletion
          }, 2000);  // Clear the message after 2 seconds
        },
        error: (err) => {
          console.error('Error deleting product:', err.message);  // Handle the error
          this.message = 'Error deleting product. Please try again later.';
        }
      });
    }
}
