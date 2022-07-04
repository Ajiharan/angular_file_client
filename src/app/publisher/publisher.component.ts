import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
})
export class PublisherComponent implements OnInit {
  title = 'uploadFile';

  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;

  file!: File;
  public isLoading: boolean = false;

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

  constructor(private service: FileService, private storage: Storage) {}

  ngOnInit(): void {}

  validateFile(message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = control.value.match(/\w\.(jpg|pdf)$/g);
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
    const formdata = new FormData();
    this.isLoading = true;
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
        console.log('progress', progress);
      },
      (error) => {
        console.log('error', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formdata.append('url', downloadURL);
          this.service.postFile(formdata).subscribe({
            next: (res) => {
              this.isLoading = false;
            },
            error: (err) => {
              console.log(err);
              this.isLoading = false;
            },
          });
        });
      }
    );
  }
}
