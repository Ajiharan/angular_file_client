import { Component, OnInit } from '@angular/core';
import { FileService } from '../service/file.service';
import { Publisher } from '../types/file';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentComponent implements OnInit {
  public fileData: Publisher[] = [];
  constructor(private service: FileService) {}

  ngOnInit(): void {
    this.service.getFiles().subscribe({
      next: (res) => {
        this.fileData = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSave(url: string, fileName: string): void {
    window.open(url);
  }
}
