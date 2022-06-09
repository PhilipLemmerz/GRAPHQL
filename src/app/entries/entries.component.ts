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
    this.storeService.loadAll().subscribe( (entries) => {
      this.entries = entries.data.posts;
      console.log(entries);
    });
  }

  formGroup = this.fb.group({
    'title': new FormControl('', Validators.required),
    'content': new FormControl('', Validators.required),
  });

  submit() {
    this.storeService.createEntry(this.formGroup.value).subscribe(entry => {
      this.entries.push(entry.data.createPost);
      console.log('new', entry)
    });
  }

  deleteItem(_id: any) {
    this.storeService.deleteOne(_id).subscribe(response => {
      console.log(response.data.deletePost._id);
      const deletedID = response.data.deletePost._id;
      const index = this.entries.findIndex((entry: any) => entry._id == deletedID);
      this.entries.splice(index, 1);
    });
  }


}
