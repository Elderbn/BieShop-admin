import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThongkeComponent } from './thongke/thongke.component';

@NgModule({
  declarations: [ 
    OrderComponent,ProductComponent,TypeComponent, ThongkeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      {
        path: 'thongke',
        component: ThongkeComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
