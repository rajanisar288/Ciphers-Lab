import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


interface FormType {
  type: string;
  label: string;
  placeholder?: string;
  name: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  options?: Array<{ label: string; value: string }>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ciphers_lab';
  form: FormGroup = new FormGroup({});
  formConfiguration: any;
  loader:boolean = true;
  constructor(private _formBuilder: FormBuilder, private _http: HttpClient) {}

  ngOnInit() {
    this.getForm();
  }
  getForm() {
    this._http.get('/assets/form-config.json').subscribe((result: any) => {
      this.formConfiguration = result;
      this.createForm();
    });
  }
  createForm() {
    const controlsConfig: { [key: string]: any } = {};
    this.formConfiguration.fields.forEach( (field: FormType)=> {
      const validators = [];
      if (field.validation) {
        if (field.validation.required) validators.push(Validators.required);
        if (field.validation.minLength) validators.push(Validators.minLength(field.validation.minLength));
        if (field.validation.maxLength) validators.push(Validators.maxLength(field.validation.maxLength));
        if (field.validation.pattern) validators.push(Validators.pattern(field.validation.pattern));
      }
      controlsConfig[field.name] = this._formBuilder.control('', validators);
    });
    this.form = this._formBuilder.group(controlsConfig);
    this.loader = false
  }

  onSubmit() {
    if (this.form && this.form.valid) {
        alert('Form successfully submitted')
        this.form.reset();
    } else {
      alert('Form has errors.')
      console.log("Form has errors.");
    }
  }
}
