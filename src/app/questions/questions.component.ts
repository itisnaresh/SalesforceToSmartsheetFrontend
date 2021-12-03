import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ApiHttpService } from '../services/api-http.service';
import { Constants } from '../config/constants';
import {ErrorStateMatcher} from '@angular/material/core';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  // matcher = new MyErrorStateMatcher();

  user = {email: "naresh@cloudwaveinc.com"};

  types: any;

  isLinear = true;

  answersJson: any;

  questions: any;

  smartsheetUser: any;

  firstFormGroup: FormGroup;

  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private apiService: ApiHttpService) {

  }

  ngOnInit() {

    this.getSmartsheetUser();

    this.firstFormGroup = this._formBuilder.group({
      oppTypeCtrl: ['', Validators.required],
    });

    this.secondFormGroup = new FormGroup({});

    this.apiService.get(Constants.API_ENDPOINT + "/salesforce/opportunities/types").subscribe(data => {
      this.types = JSON.parse(JSON.stringify(data));
      console.log(this.types)
    }, (error) => {
      alert(error)
    })

  }

  private extractData(res: any) {
    return res;
  }

  buildAnswersFormControl() {
    for (let row of this.questions) {
      if(row.cells[2].displayValue == 'email') {
        this.secondFormGroup.addControl(row.cells[0].displayValue, this._formBuilder.control(this.smartsheetUser.email, [Validators.required, Validators.email]))
      }
      if(row.cells[0].displayValue == 'User') {
        this.secondFormGroup.addControl(row.cells[0].displayValue, this._formBuilder.control({value: this.smartsheetUser.account.id, disabled: true}, [Validators.required]))
      }
      if(row.cells[0].displayValue == 'Organization') {
        this.secondFormGroup.addControl(row.cells[0].displayValue, this._formBuilder.control(this.smartsheetUser.company, [Validators.required]))
      }
      if(row.cells[0].displayValue == 'Role') {
        this.secondFormGroup.addControl(row.cells[0].displayValue, this._formBuilder.control(this.smartsheetUser.role, [Validators.required]))
      } else {
        this.secondFormGroup.addControl(row.cells[0].displayValue, this._formBuilder.control('', [Validators.required]))
      }
    }
  }

  createArrayFromString(options: string) : Array<String> {
    return options.split(",")
  }

  getSmartsheetUser() {
    this.apiService.get(Constants.API_ENDPOINT + "/smartsheet/currentuser").subscribe(data => {
      this.smartsheetUser = data;
      console.log(this.smartsheetUser)
    }, (error) => {
      alert(error)
    })
  }

  getQuestionsByOppType() {
    this.apiService.get(Constants.API_ENDPOINT + "/smartsheet/questions/" + this.firstFormGroup.value.oppTypeCtrl).subscribe(data => {
      this.questions = this.extractData(data).rows;
      this.buildAnswersFormControl()
      console.log(this.questions)
    }, (error) => {
      alert(error)
    })
  }

  submit() {
    if(this.secondFormGroup.status == 'VALID') {
      console.log("VALID", this.secondFormGroup.getRawValue())
      this.apiService.put(Constants.API_ENDPOINT + "/smartsheet/answers/"  + this.firstFormGroup.value.oppTypeCtrl, this.secondFormGroup.getRawValue()).subscribe(data => {
        console.log(data)
      }, (error) => {
        alert(error)
      })
    } else {
      console.log("INVALID", this.secondFormGroup.getRawValue())
    }
  }

}
