import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Web3Service } from '../../providers/web3.service';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

// such override allows to keep some initial values
export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 100});
}

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.component.html',
  styleUrls: ['./splash-page.component.scss'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class SplashPageComponent implements OnInit {
  lastPercentageSynced: number;
  isSyncing: boolean | any;
  isListening: boolean;
  peerCount: number;

  constructor(private web3: Web3Service,
              private router: Router) {
    this.web3.setProvider(new this.web3.providers.HttpProvider('http://localhost:8545'));
    this.lastPercentageSynced = 0;
  }

  ngOnInit() {
    const isListeningSub$ = Observable.interval(10000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.net.isListening()))
    .pipe(distinctUntilChanged())
    .subscribe(result => {
      this.isListening = result;
    });

    const isSyncingSub$ = Observable.interval(1000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.isSyncing()))
    .pipe(distinctUntilChanged())
    .subscribe((result: boolean | any) => {
      if (this.isListening) {
        this.isSyncing = result;
        if (!!result) {
          this.lastPercentageSynced = this.currentPercentage(result.currentBlock, result.highestBlock);
          console.log(this.lastPercentageSynced.toFixed(0));
        }
        if (result === false && (this.lastPercentageSynced || 0).toFixed(0) === '100') {
          // Nav away here
          console.log('nav away...');
          // also unsubscribe like so, although we need to validate the order, which we do first
          // isListeningSub$.unsubscribe();
          // isSyncingSub$.unsubscribe();
          // peerCountSub$.unsubscribe();
          // this.router.navigate(['/path/to/go/to/here']);
        }
      }
    });

    const peerCountSub$ = Observable.interval(1000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.net.getPeerCount()))
    .pipe(distinctUntilChanged())
    .subscribe(result => {
      if (this.isListening) {
        this.peerCount = result;
      }
    });
  }

  currentPercentage(currentBlock: string, highestBlock: string): number {
    return (parseInt(currentBlock, 10) / parseInt(highestBlock, 10)) * 100;
  }

  hexToInt(hexValue: string): number {
    return parseInt(hexValue, 10);
  }
}
