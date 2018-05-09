import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Web3Service } from '../../providers/web3.service';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

// such override allows to keep some initial values
export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 100});
}

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class SplashComponent implements OnInit {
  isSyncing$: Observable<boolean>;
  isListening$: Observable<any>;
  peerCount$: Observable<number>;
  constructor(private web3: Web3Service) {
    console.log(window);
    this.web3.setProvider(new this.web3.providers.HttpProvider('http://localhost:8545'));
  }

  ngOnInit() {
    this.isListening$ = Observable.interval(10000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.net.isListening())).pipe(distinctUntilChanged());
    this.isSyncing$ = Observable.interval(5000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.isSyncing())).pipe(distinctUntilChanged());
    this.peerCount$ = Observable.interval(10000)
    .flatMap((i) => Observable.fromPromise(this.web3.eth.net.getPeerCount())).pipe(distinctUntilChanged());
  }

  currentPercentage(currentBlock: string, highestBlock: string): number {
    return (parseInt(currentBlock, 10) / parseInt(highestBlock, 10)) * 100;
  }

  hexToInt(hexValue: string): number {
    return parseInt(hexValue, 10);
  }
}
