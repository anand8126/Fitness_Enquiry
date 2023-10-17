import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent {
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public gender: string[] = ['Male', 'Female'];
  public userIdToUpdate!:number;
  public isUpdateActive:boolean=false;
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Buliding Learn Muscle',
    'Healthier Digestive System',
    'Sugar Carving Body',
    'Fitness',
  ];

  public registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: NgToastService,
    private activedRoute:ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe((response) => {
      this.calculateBmi(response);
    });

    this.activedRoute.params.subscribe(val => {
      this.userIdToUpdate=val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate)
      .subscribe(res =>{
        this.isUpdateActive=true;
        this.fillFormToUpdate(res);
      })
    })
  }

  submit() {
    this.api.postRegistration(this.registerForm.value).subscribe((response) => {
      this.toastService.success({
        detail: 'Success',
        summary: 'Enquiry Added!',
        duration: 3000,
      });
      this.registerForm.reset();
    });
  }

  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('Underweight');
        break;

      case bmi >= 18.5 && bmi < 25:
        this.registerForm.controls['bmiResult'].patchValue('NormalWeight');
        break;
      case bmi >= 25 && bmi < 30:
        this.registerForm.controls['bmiResult'].patchValue('OverWeight');
        break;
      default:
        this.registerForm.controls['bmiResult'].patchValue('ObeseWeight');
        break;
    }
  }

  fillFormToUpdate(user:User){
    this.registerForm.setValue({
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      mobile:user.mobile,
        weight:user.weight,
      height:user.height,
      bmi:user.bmi,
      bmiResult:user.bmiResult,
      gender:user.gender,
      requireTrainer:user.requireTrainer,
      package:user.package,
      important:user.important,
      haveGymBefore:user.haveGymBefore,
      enquiryDate:user.enquiryDate
    })
  }

  update(){
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe((response) => {
      this.toastService.success({
        detail: 'Success',
        summary: 'Enquiry Updated!',
        duration: 3000,
      });
      this.registerForm.reset();
      this.router.navigate(['/list'])
    });
  }
}
