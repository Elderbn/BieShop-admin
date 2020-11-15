import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/lib/base-component';

@Component({
  selector: 'app-thongke',
  templateUrl: './thongke.component.html',
  styleUrls: ['./thongke.component.css']
})
export class ThongkeComponent extends BaseComponent implements OnInit {
  thongke: any[];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this._api.get('/api/hoadon/thong-ke')
    .subscribe((res: any[]) => {
      
      let ps = res.map(async tk => {
        let dt;
        await this._api.get('/api/item/get-by-id/' + tk.item_id).toPromise()
        .then((dtx: any) => {
          dt = dtx;
        });
        tk.item_name = dt.item_name;
        tk.item_price = dt.item_price;
        return tk;
      });

      Promise.all(ps).then(values => {
        this.thongke = values;
      });

    })
  }

}
