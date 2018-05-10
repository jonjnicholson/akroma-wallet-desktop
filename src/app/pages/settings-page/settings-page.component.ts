import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SettingsPersistenceService } from '../../providers/settings-persistence.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  @ViewChild('fileInput')
  private fileInput: ElementRef;
  systemSettingsForm: FormGroup;

  constructor(private settingsService: SettingsPersistenceService, private fb: FormBuilder) {
    this.systemSettingsForm = this.fb.group({
      dataDirPath: '',
      syncMode: '',
      _id: 'system',
    });
  }

  async ngOnInit() {
    const settings = await this.settingsService.db.get('system');
    if (!!settings) {
      this.systemSettingsForm = this.fb.group(settings);
    }
  }

  onDirectoryPathChange(event: any) {
    this.systemSettingsForm.get('dataDirPath').setValue(event.srcElement.files["0"].path);
  }

  async onSubmit() {
    const result = await this.settingsService.db.put(this.systemSettingsForm.value);
    this.systemSettingsForm = this.fb.group(await this.settingsService.db.get('system'));
  }
}
