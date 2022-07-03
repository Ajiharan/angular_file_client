import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PublisherService } from '../publisher.service';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
})
export class PublisherComponent {
  title = 'uploadFile';

  displaySingleImage!: Boolean;
  displayMultipleImages!: Boolean;
  displayMultipleImageArray!: Array<any>;
  displaySingleImageArray!: Array<any>;

  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;

  file!: File;

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

  constructor(private service: PublisherService, private storage: Storage) {
    this.displaySingleImage = false;

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
      this.file = file;
    }
  }

  onSubmit() {
    console.log('submit');
    const formdata = new FormData();

    formdata.append('fileName', this.uploadForm.value.fileName);
    formdata.append('authorName', this.uploadForm.value.authorName);
    formdata.append('description', this.uploadForm.value.description);
    formdata.append('price', this.uploadForm.value.price);

    const storageRef = ref(this.storage, this.file.name);
    const uploadTask = uploadBytesResumable(storageRef, this.file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('error', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          formdata.append('url', downloadURL);
          this.service.postFile(formdata).subscribe({
            next: (res) => {
              console.log(res);
              this.singleInput.nativeElement.value = '';
              this.displaySingleImage = true;
              this.displaySingleImageArray.push(res.path);
            },
            error: (err) => {
              console.log(err);
            },
          });
        });
      }
    );
  }
}
