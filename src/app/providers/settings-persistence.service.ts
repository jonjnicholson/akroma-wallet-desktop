import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

import { UserSettings } from '../models/user-settings';

@Injectable()
export class SettingsPersistenceService {
  private _db: PouchDB.Database<UserSettings>;

  get db(): PouchDB.Database<UserSettings> {
    return this._db;
  }

  constructor() {
    this._db = new PouchDB('settings', { adapter: 'websql' });
  }
}
