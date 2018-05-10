import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  userSettingsForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.userSettingsForm = fb.group({
      dataDirPath: '',
      syncMode: '',
    });
  }

  ngOnInit() {
  }

  onDirectoryPathChange(event: Event): void {
    this.userSettingsForm.get('dataDirPath').setValue(event.srcElement['files'][0].path);
  }
}
