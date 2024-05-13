import {Component, OnInit} from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerService} from "../services/customer.service";
import {AccountService} from "../services/account.service";
import {AccountDetails, AccountOperation} from "../model/account.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{
  accountFormGroup! : FormGroup;
  currentPage : number =0;
  pageSize : number =5;
  accountObservable! : Observable<AccountDetails>
  operationFormGroup! : FormGroup;
  errorMessage! :string ;
  constructor(private accountService:AccountService,private fb:FormBuilder) { }
  ngOnInit() {
    this.accountFormGroup=this.fb.group({
      accountId:this.fb.control("")
    });
    this.operationFormGroup=this.fb.group({
      operationType : this.fb.control(null),
      amount : this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)
    })}
  handleSearchAccount() {
    let accountId = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccounts(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err;
        return throwError(err);
      })
    );
  }
  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();

  }

  handleAccountOperation() {
    let accountId:string = this.accountFormGroup.value.accountId;
    let operationType:AccountOperation = this.operationFormGroup.value.operationType;
    let amount :number =this.operationFormGroup.value.amount;
    let description :string =this.operationFormGroup.value.description;
    let accountDestination :string =this.operationFormGroup.value.accountDestination;
    if(operationType.type=='DEBIT'){
      this.accountService.debit(accountId, amount,description).subscribe({
        next : (data)=>{
          alert("Success Credit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    } else if(operationType.type=='CREDIT'){
      this.accountService.credit(accountId, amount,description).subscribe({
        next : (data)=>{
          alert("Success Debit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    }
    else if(operationType.type=='TRANSFER'){
      this.accountService.transfer(accountId,accountDestination, amount,description).subscribe({
        next : (data)=>{
          alert("Success Transfer");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });

    }
  }
}


