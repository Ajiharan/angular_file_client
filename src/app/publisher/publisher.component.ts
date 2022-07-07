import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  NgForm,
} from '@angular/forms';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { FileService } from '../service/file.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublisherComponent implements OnInit {
  public title = 'uploadFile';
  public process: number = 0;
  private subscription: Subscription;
  private unsubscribe: any = null;

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

  constructor(
    private service: FileService,
    private storage: Storage,
    private cd: ChangeDetectorRef
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {}

  validateFile(message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = control.value?.match(/\w\.(doc|pdf)$/g);
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

  onProcess(process: number): void {
    this.process = process;
    this.cd.detectChanges();
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
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe = uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.onProcess(Math.round(progress));
      },
      (error) => {
        console.log('error', error);
        this.unsubscribe = null;
        this.isLoading = false;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formdata.append('url', downloadURL);
          this.isLoading = false;
          this.unsubscribe = null;
          this.process = 0;
          this.uploadForm.reset();
          this.cd.detectChanges();
          this.addFile(formdata);
        });
      }
    );
  }

  addFile(formdata: FormData): void {
    this.service.postFile(formdata).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  showError(controlName: string): boolean {
    return !(
      this.uploadForm.get(controlName)?.errors?.['required'] &&
      !this.uploadForm.get(controlName)?.pristine
    );
  }
}
