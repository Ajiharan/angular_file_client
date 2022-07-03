export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}

export type Publisher = {
  id: string;
  fileName: string;
  authorName: string;
  description: string;
  fileUrl: string;
  price: string;
};
