import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent {
  public dataSource!: MatTableDataSource<User>;
  users: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquiryDate',
    'Action',
  ];

  constructor(private api: ApiService, 
    private route:Router,
    private confirm:NgConfirmService,
    private  toast:NgToastService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.api.getRegisteredUser().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }

  edit(id:number){
    this.route.navigate(['update',id])
  }

  deleted(id:number){
    this.confirm.showConfirm("Are you sure want to delete?", 
    ()=>{
      this.api.deleteRegisteredUser(id).subscribe(res => {
        this.toast.success({detail:'SUCCESS', summary:"Deleted Sucessfully",duration:3000})
    
        this.getUsers();
      }) 
    },() =>{})

  }


}
