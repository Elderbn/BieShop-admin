import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent extends BaseComponent implements OnInit {
  public users: any;
  public user: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public listLoaiSP: any;

  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'item_group_id': [''],
    });

    this._api.get('/api/itemgroup/get-menu')
    .subscribe((res: any) => {
      this.listLoaiSP = res[0].children;
    })
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/item/search',{page: page, pageSize: this.pageSize, item_group_id: this.listLoaiSP[0].item_group_id}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/item/search',{page: this.page, pageSize: this.pageSize, item_group_id: this.formsearch.get('item_group_id').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          item_image:data_image,
          item_group_id:value.loaiSP,
          item_name:value.tenSP,
          item_price:value.gia,
          item_id:1,
         };
         console.log(tmp);
         
        this._api.post('/api/item/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           item_image:data_image,
           item_group_id:value.loaiSP,
           item_name:value.tenSP,
           item_price:value.gia,
           item_id:this.user.item_id,
          };
        this._api.post('/api/item/update-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/item/delete-item',{item_id:row.item_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.user = null;
    this.formdata = this.fb.group({
      'tenSP': ['', Validators.required],
      'loaiSP': [this.today, Validators.required],
      'gia': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.user = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tenSP': ['', Validators.required],
        'loaiSP': [this.today, Validators.required],
        'gia': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/item/get-by-id/'+ row.user_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.user = res; 
        this.formdata = this.fb.group({
          'tenSP': [this.user.item_name, Validators.required],
          'loaiSP': [this.user.item_group_id, Validators.required],
          'gia': [this.user.item_price, Validators.required],
        }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
