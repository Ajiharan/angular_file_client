import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PublisherService } from './publisher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'uploadFile';

  displaySingleImage!: Boolean;
  displayMultipleImages!: Boolean;
  displayMultipleImageArray!: Array<any>;
  displaySingleImageArray!: Array<any>;

  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;

  images: any;
  multipleImages = [];

  uploadForm: FormGroup = new FormGroup({
    fileName: new FormControl('', Validators.required),
    authorName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    fileInput: new FormControl('', [
      Validators.required,
      this.validateFile('File only support .doc|.pdf extensions'),
    ]),
  });

  constructor(private service: PublisherService) {
    this.displaySingleImage = false;
    this.displayMultipleImageArray = [];
    this.displayMultipleImages = false;
    this.displaySingleImageArray = [];
  }

  validateFile(message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = control.value.match(/\w\.(doc|pdf)$/g);
      console.log('valid', valid);
      if (valid) return null;
      return { inValid: message };
    };
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.uploadForm.get('fileName')?.setValue(file.name);
      this.images = file;
    }
  }

  onSubmit() {
    console.log('submit');
    const formdata = new FormData();
    formdata.append('file', this.images);
    formdata.append('fileName', this.uploadForm.value.fileName);
    formdata.append('authorName', this.uploadForm.value.authorName);
    formdata.append('description', this.uploadForm.value.description);
    formdata.append('price', this.uploadForm.value.price);
    // post request to express backend
    this.service.postFile(formdata).subscribe(
      (res) => {
        console.log(res);
        this.singleInput.nativeElement.value = '';
        this.displaySingleImage = true;
        this.displaySingleImageArray.push(res.path);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
