import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { HttpService } from '../http.service';


@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})


export class EntriesComponent implements OnInit {
  constructor(private fb: FormBuilder, private storeService: HttpService ) { }
  title = 'TestBackendApp';
  entries: any = [];



  ngOnInit() {
    this.storeService.loadAll().subscribe((entries) => {
      this.entries = entries;
      console.log(this.entries);
    });
  }

  formGroup = this.fb.group({
    'title': new FormControl('', Validators.required),
    'content': new FormControl('', Validators.required),
  });

  submit() {
    this.storeService.createEntry(this.formGroup.value).subscribe(entry => {
      console.log(entry);
    });
  }

  deleteItem(_id: any) {
    this.storeService.deleteOne(_id).subscribe(response => {
      const deletedID = response.data._id;
      const index = this.entries.findIndex((entry: any) => entry._id == deletedID);
      this.entries.splice(index, 1);
    });
  }


}
