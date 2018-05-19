import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IconPaths} from '../../config/icon-paths';
import {Chart} from 'chart.js';
import {ChartInterface, colorChartPrefs, COLORS} from '../../interfaces/chart.interface';
import {AppData} from '../../config/app-setup';
import {CommonService} from '../../services/common.service';
import {BTCData} from '../../config/btc-data';
import {BCHData} from '../../config/bch-data';
import {DashData} from '../../config/dash-data';
import {ETHData} from '../../config/eth-data';
import {LTCData} from '../../config/ltc-data';
import {MONData} from '../../config/mon-data';
import {BtcUsd2Years} from '../../config/btc-usd-2-years';
import {Transactions} from '../../config/transactions';

import * as moment from 'moment/moment';
import {DecimalPipe} from '@angular/common';
import {FormControl} from '@angular/forms';
import {OMCData} from '../../config/omc-data';
import {BaseChartDirective} from 'ng2-charts';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [DecimalPipe]
})

export class StatsComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  public vaults: [
    'All',
    'ORV1',
    'ORV2',
    'ORV3',
    'ORV4',
    'ORV5'
    ];
  public icons = IconPaths;
  public coinList = AppData.coinList;
  public coinDataRows = AppData.coinDataRows;
  public overviewMarketCaps = [this.coinDataRows.map(coin => coin.marketCap)];
  public overviewLabels = AppData.coinDataRows.map((coin) =>
    [
      new Date(),
      'Market Cap: ' + this.decimalPipe.transform(0) + ' USD',
      'Price (USD): ' + this.decimalPipe.transform(0),
      '24h Vol: ' + this.decimalPipe.transform(0)
    ]);
  public overviewColors = [{
    backgroundColor: AppData.coinDataRows.map(coin => COLORS[coin.code]),
    borderColor: AppData.coinDataRows.map(() => 'transparent')
  }];
  public selectedCurreny: any = {
    name: 'United Stated Dollar',
    code: 'USD',
    symbol: '$'
  };
  public lineChartData: Object = {};
  public lineChartLabels: Object = {};
  public pieChartOptions = {
    tooltips: {
      titleMarginBottom: 15,
      bodySpacing: 15,
      xPadding: 15,
      yPadding: 15,
      displayColors: true,
      callbacks: {
        labelColor: (tooltipItem, chart) => {
          console.log(chart);
          const coinColor = chart.data.datasets[0].backgroundColor[tooltipItem.index];
          const dateColor = '#444';
          if (tooltipItem.datasetIndex === 0) {
  return {
              borderColor: coinColor,
              backgroundColor: coinColor
            };
          }
          if (tooltipItem.datasetIndex === 1) {
            return {
              borderColor: coinColor,
              backgroundColor: coinColor
            };
          }
          if (tooltipItem.datasetIndex === 2) {
            return {
              borderColor: COLORS.usd,
              backgroundColor: COLORS.usd
            };
          }
          if (tooltipItem.datasetIndex === 3) {
            return {
              borderColor: COLORS.usd,
              backgroundColor: COLORS.usd
            };
          }
        }
      },
      labelColor: (tooltipItem, chart) => {
        console.log(chart);
        const coinColor = chart.data.datasets[0].backgroundColor[chart.active[0]['_datasetIndex']];
        const dateColor = '#444';
        if (tooltipItem.datasetIndex === 0) {
          return {
            borderColor: dateColor,
            backgroundColor: dateColor
          };
        }
        if (tooltipItem.datasetIndex === 1) {
          return {
            borderColor: coinColor,
            backgroundColor: coinColor
          };
        }
        if (tooltipItem.datasetIndex === 2) {
          return {
            borderColor: COLORS.usd,
            backgroundColor: COLORS.usd
          };
        }
        if (tooltipItem.datasetIndex === 3) {
          return {
            borderColor: COLORS.usd,
            backgroundColor: COLORS.usd
          };
        }
      }
    }
  };
  public lineChartOptions: any = ChartInterface.chartOptions;
  public lineChartColors: Array<any> = ChartInterface.chartColors;
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public activeTab: string = 'overview';
  public activeTime: string = 'day';
  public tabList: any;
  public chartDataReady: boolean = false;
  public labelsToShow: Array<string> = [];
  public timeRange: Array<string> = ['hour', 'day', 'week', 'month', 'year', 'all'];
  public ORVWallets: any = AppData.wallets;
  public testData: any = {};
  public testLabels = {};
  public dataToShow: any = [];
  public totalHoldings = {
    overview: '',
    btc: '',
    bch: '',
    eth: '',
    ltc: '',
    dash: ''
  };
  public tickerData = {
    btc: {
      usd: {
        marketCap: '',
        price: '',
        volume24h: '',
        circulatingSupply: '',
      }
    },
    ltc: {
      usd: {
        marketCap: '',
        price: '',
        volume24h: '',
        circulatingSupply: '',
      }
    },
    eth: {
      usd: {
        marketCap: '',
        price: '',
        volume24h: '',
        circulatingSupply: '',
      }
    },
    bch: {
      usd: {
        marketCap: '',
        price: '',
        volume24h: '',
        circulatingSupply: '',
      }
    },
    dash: {
      usd: {
        marketCap: '',
        price: '',
        volume24h: '',
        circulatingSupply: '',
      }
    }
  };
  public transactions = Transactions;
  public newChartData = {};
  public newChartLabels = {};
  public activeVault: string = 'all';
  public pieChartsMode = new FormControl(false);
  private dataImports = {};
  private BTCUSD2YearsData = BtcUsd2Years;
  private selectedFiat = 'usd';
  private coinMarketCapIds: Object = {
    btc: '1',
    ltc: '2',
    eth: '1027',
    bch: '1831',
    dash: '131'
  };
  private counter = 0;

  // buildOverviewLabels(labels) {
  //   setTimeout(() => {
  //     this.charts.forEach((child) => {
  //       console.log(child);
  //       if (child.chartType = 'doughnut' && child.chart) {
  //         console.log(child.chart.config.labels);
  //         child.chart.config.data.labels = labels.map(coin => coin.marketCap);
  //       }
  //     });
  //   },200);
  // }

  // buildOverviewOptions(coins) {
  //   return {
  //     animation: {
  //       duration: 0
  //     }
  //   };
  // }

  // ngAfterViewInit() {
  //   this.pieChartsMode.valueChanges.subscribe((enabled) => {
  //     if (enabled) {
  //       this.buildOverviewLabels(this.coinDataRows);
  //     }
  //   });
  // }

  constructor(private commonService: CommonService,
              private decimalPipe: DecimalPipe) {
    if (window.innerWidth < 666) {
      ChartInterface.chartOptions.scales.xAxes[0].display = ChartInterface.chartOptions.scales.yAxes[0].scaleLabel.display = ChartInterface.chartOptions.scales.yAxes[1].scaleLabel.display = false;
    }
  }

  buildOverviewData(data) {
    // this.chart.chart.config.data.labels = ['1', '2'];
    return data.map(coin => coin.marketCap);
  }

  parseCharts() {
    this.charts.forEach((child) => {
      console.log(child);
    });
  }


  ngOnInit() {

    let MONDataSet = MONData.reverse();
    let BTCDataSet = BTCData.reverse();
    let BCHDataSet = BCHData.reverse();
    let DashDataSet = DashData.reverse();
    let LTCDataSet = LTCData.reverse();
    let ETHDataSet = ETHData.reverse();
    let OMCDataSet = OMCData.reverse();

    let yearFraction = .5;
    let monthFraction = .3;
    let weekFraction = .1;
    let dayFraction = .05;
    let hourFraction = .01;

    this.dataImports = {
      'overview': {
        'all': MONDataSet,
        'year': MONDataSet.slice(MONDataSet.length - (365), MONDataSet.length - 1),
        'month': MONDataSet.slice(MONDataSet.length - (121), MONDataSet.length - 1),
        'week': MONDataSet.slice(MONDataSet.length - (7 * 24), MONDataSet.length - 1),
        'day': MONDataSet.slice(MONDataSet.length - (24), MONDataSet.length - 1),
        'hour': MONDataSet.slice(MONDataSet.length - (30), MONDataSet.length - 1),
      },
      'btc': {
        'all': BTCDataSet,
        'year': BTCDataSet.slice(BTCDataSet.length - (365), BTCDataSet.length - 1),
        'month': BTCDataSet.slice(BTCDataSet.length - (121), BTCDataSet.length - 1),
        'week': BTCDataSet.slice(BTCDataSet.length - (7 * 24), BTCDataSet.length - 1),
        'day': BTCDataSet.slice(BTCDataSet.length - (24), BTCDataSet.length - 1),
        'hour': BTCDataSet.slice(BTCDataSet.length - (30), BTCDataSet.length - 1),
      },
      'bch': {
        'all': BCHDataSet,
        'year': BCHDataSet.slice(BCHDataSet.length - (365), BCHDataSet.length - 1),
        'month': BCHDataSet.slice(BCHDataSet.length - (121), BCHDataSet.length - 1),
        'week': BCHDataSet.slice(BCHDataSet.length - (7 * 24), BCHDataSet.length - 1),
        'day': BCHDataSet.slice(BCHDataSet.length - (24), BCHDataSet.length - 1),
        'hour': BCHDataSet.slice(BCHDataSet.length - (30), BCHDataSet.length - 1),
      },
      'dash': {
        'all': DashDataSet,
        'year': DashDataSet.slice(DashDataSet.length - (365), DashDataSet.length - 1),
        'month': DashDataSet.slice(DashDataSet.length - (121), DashDataSet.length - 1),
        'week': DashDataSet.slice(DashDataSet.length - (7 * 24), DashDataSet.length - 1),
        'day': DashDataSet.slice(DashDataSet.length - (24), DashDataSet.length - 1),
        'hour': DashDataSet.slice(DashDataSet.length - (30), DashDataSet.length - 1),
      },
      'ltc': {
        'all': LTCDataSet,
        'year': LTCDataSet.slice(LTCDataSet.length - (365), LTCDataSet.length - 1),
        'month': LTCDataSet.slice(LTCDataSet.length - (121), LTCDataSet.length - 1),
        'week': LTCDataSet.slice(LTCDataSet.length - (7 * 24), LTCDataSet.length - 1),
        'day': LTCDataSet.slice(LTCDataSet.length - (24), LTCDataSet.length - 1),
        'hour': LTCDataSet.slice(LTCDataSet.length - (30), LTCDataSet.length - 1),
      },
      'eth': {
        'all': ETHDataSet,
        'year': ETHDataSet.slice(ETHDataSet.length - (365), ETHDataSet.length - 1),
        'month': ETHDataSet.slice(ETHDataSet.length - (121), ETHDataSet.length - 1),
        'week': ETHDataSet.slice(ETHDataSet.length - (7 * 24), ETHDataSet.length - 1),
        'day': ETHDataSet.slice(ETHDataSet.length - (24), ETHDataSet.length - 1),
        'hour': ETHDataSet.slice(ETHDataSet.length - (30), ETHDataSet.length - 1),
      },
      'omc': {
        'all': OMCDataSet,
        'year': OMCDataSet.slice(OMCDataSet.length - (365), OMCDataSet.length - 1),
        'month': OMCDataSet.slice(OMCDataSet.length - (121), OMCDataSet.length - 1),
        'week': OMCDataSet.slice(OMCDataSet.length - (7 * 24), OMCDataSet.length - 1),
        'day': OMCDataSet.slice(OMCDataSet.length - (24), OMCDataSet.length - 1),
        'hour': OMCDataSet.slice(OMCDataSet.length - (30), OMCDataSet.length - 1),
      },
    };

    this.getChartData();
    this.getTickerData();
    // let getTickerDataInterval = window.setInterval(() => {
    //   this.getTickerData();
    // }, 30000);

    // this.getTransactions()
    // this.getDashTransactions();
    // this.getBtcTransactions();
    // this.getLtcTransactions();
    // this.getBchTransactions();
    // this.getEthTransactions();
  }

  getDashTransactions() {
    this.ORVWallets['dash'].forEach((wallet, index) => {
      setTimeout(() => {
        let route = this.getTransactionAPIRouteFromCoin('dash', wallet.address);
        this.commonService.request(route)
          .then((response: any) => {
            if (response.txrefs) {
              wallet['balance'] = response.balance;
              wallet.transactions = response.txrefs;
              wallet.transactions.forEach((transaction) => {
                let tempTx = {
                  wallet: wallet.name,
                  date: moment(transaction.confirmed).format('DD MMM, YYYY'),
                  value: transaction.value,
                  confirmations: transaction.confirmations,
                  TXId: transaction.tx_hash
                };
                this.transactions['dash'].push(tempTx);
              });
            }
          })
          .catch((error) => {
            console.log('ERROR getting Dash transactions');
          });
      }, 1500 * index);
    });
    window['transactions'] = this.transactions;
  }

  sortArray(a, b) {
    if (moment(a.date).valueOf() > moment(b.date).valueOf()) {
      return -1;
    }
    if (moment(a.date).valueOf() < moment(b.date).valueOf()) {
      return 1;
    }
    return 0;
  }

  getBtcTransactions() {
    this.ORVWallets['btc'].forEach((wallet, index) => {
      setTimeout(() => {
        console.log('getting btc');
        let route = this.getTransactionAPIRouteFromCoin('btc', wallet.address);
        this.commonService.request(route)
          .then((response: any) => {
            if (response.code == 200 && response.data) {
              wallet['balance'] = response.data.balance;
              wallet.transactions = response.data.txs;
              wallet.transactions.forEach((transaction) => {
                console.log(moment(transaction.time * 1000).format('DD MMM, YYYY'));
                let tempTx = {
                  wallet: wallet.name,
                  date: moment(transaction.time * 1000).format('DD MMM, YYYY'),
                  value: transaction.incoming.value ? transaction.incoming.value : 0 - transaction.outgoing.value,
                  confirmations: transaction.confirmations,
                  TXId: transaction.txid
                };
                this.transactions['btc'].push(tempTx);
              });
            }
          })
          .catch((error) => {
            console.log('ERROR getting BTC transactions');
          });
      }, 2000 * index);
    });
    window['newtxs'] = this.transactions;
  }

  getLtcTransactions() {
    this.ORVWallets['ltc'].forEach((wallet, index) => {
      setTimeout(() => {
        console.log('getting ltc');
        let route = this.getTransactionAPIRouteFromCoin('ltc', wallet.address);
        this.commonService.request(route)
          .then((response: any) => {
            if (response.code == 200 && response.data) {
              wallet['balance'] = response.data.balance;
              wallet.transactions = response.data.txs;
              wallet.transactions.forEach((transaction) => {
                let tempTx = {
                  wallet: wallet.name,
                  date: moment(transaction.time).format('DD MMM, YYYY'),
                  value: transaction.incoming.value ? transaction.incoming.value : 0 - transaction.outgoing.value,
                  confirmations: transaction.confirmations,
                  TXId: transaction.txid
                };
                this.transactions['ltc'].push(tempTx);
              });
            }
          })
          .catch((error) => {
            console.log('ERROR getting LTC transactions');
          });
      }, 1500 * index);
    });
    window['transactions'] = this.transactions;
  }

  getBchTransactions() {
    this.ORVWallets['bch'].forEach((wallet, index) => {
      let route = this.getTransactionAPIRouteFromCoin('bch', wallet.address);
      this.commonService.request(route)
        .then((response: any) => {
          if (response.code == 200 && response.balance) {
            wallet['balance'] = response.data.balance;
            wallet.transactions = response.data.txs;
            wallet.transactions.forEach((transaction) => {
              let tempTx = {
                wallet: wallet.name,
                date: moment(transaction.time).format('DD MMM, YYYY'),
                value: transaction.incoming.value,
                confirmations: transaction.confirmations,
                TXId: transaction.txid
              };
              this.transactions['bch'].push(tempTx);
            });
          }
        })
        .catch((error) => {
          console.log('ERROR getting BCH transactions');
        });
    });
    window['transactions'] = this.transactions;
  }

  setVault(vault) {
    this.activeVault == vault;

  }

  getEthTransactions() {
    this.ORVWallets['eth'].forEach((wallet, index) => {
      let route = this.getTransactionAPIRouteFromCoin('eth', wallet.address);
      this.commonService.request(route)
        .then((response: any) => {
          if (response.status == 1) {
            wallet['balance'] = this.getEtherWalletBalance(wallet.address)
              .then((balance: number) => {
                wallet['balance'] = balance / 1e18;
              })
              .catch((error) => {
                console.log('error getting eth balance');
                console.log(error);
              });
            wallet.transactions = response.result;
            wallet.transactions.forEach((transaction) => {
              let tempTx = {
                wallet: wallet.name,
                date: moment(transaction.timeStamp * 1000).format('DD MMM, YYYY'),
                value: transaction.value / 1e18,
                confirmations: transaction.confirmations,
                TXId: transaction.hash
              };
              this.transactions['eth'].push(tempTx);
            });
          }
        })
        .catch((error) => {
          console.log('ERROR getting ETH transactions');
        });
    });
    window['transactions'] = this.transactions;
  }

  getEtherWalletBalance(address) {
    let promise = new Promise((resolve, reject) => {
      let route = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=3FKDT3J3PJ94HWQBA41TKPV3Y9GYQRMS7E`;
      return this.commonService.request(route)
        .then((response: any) => {
          let balance = Number(response.result);
          resolve(balance);
        })
        .catch((error) => {
          console.log('error');
          console.log(error);
          reject(error);
        });
    });
    return promise;
  }

  randomString() {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 60; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  getTransactions() {
    // Object.keys(this.ORVWallets).forEach((coin) => {
    //   this.ORVWallets[coin].forEach((wallet) => {
    //     let route = this.getTransactionAPIRouteFromCoin(coin, wallet.address);
    //     this.commonService.request(route)
    //       .then((response) => {
    //         console.log('response from ', route)
    //         console.log(response)
    //       })
    //   })
    // })
  }

  getFakeTransactions() {
    let walletArray = [
      'OVR1',
      'OVR2',
      'OVR3',
      'OVR4',
      'OVR5'
    ];
    Object.keys(this.transactions).forEach((coin) => {
      let quantity = Math.floor(Math.random() * 20) + 3;
      for (var i = 0; i < quantity; i++) {
        let tempTX = {
          'wallet': walletArray[Math.floor(Math.random() * walletArray.length)],
          'TXId': this.randomString(),
          'date': moment().subtract(Math.floor(Math.random() * 365), 'days').format('DD MMM, YYYY'),
          'value': Math.random() * 50,
          'confirmations': Math.floor(Math.random() * 150000)
        };
        this.transactions[coin].push(tempTX);
      }
    });
  }

  getTestData(coin) {
    this.testLabels[coin] = {};
    this.testLabels[coin]['all'] = [];
    this.testLabels[coin]['year'] = [];
    this.testLabels[coin]['month'] = [];
    this.testLabels[coin]['week'] = [];
    this.testLabels[coin]['day'] = [];
    this.testLabels[coin]['hour'] = [];
    this.testData[coin] = {};
    this.testData[coin]['all'] =
      this.testData[coin]['year'] =
        this.testData[coin]['month'] =
          this.testData[coin]['week'] =
            this.testData[coin]['day'] =
              this.testData[coin]['hour'] = [
                {data: [], label: 'Market Cap', yAxisID: 'y-axis-1'},
                {data: [], label: 'Price USD', yAxisID: 'y-axis-2'}
              ];
    for (var i = this.dataImports[coin].length - 1; i > 0; i--) {
      this.testData[coin]['all'][0].data.push(this.dataImports[coin][i].marketCap);
      this.testData[coin]['all'][1].data.push(this.dataImports[coin][i].close);
      this.testLabels[coin]['all'].push(moment(this.dataImports[coin][i].time).format('HH:MM DD MMM, YYYY'));
    }
    for (var i = 0; i < (Math.floor(this.dataImports[coin].length * .8)); i++) {
      this.testData[coin]['year'][0].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].marketCap);
      this.testData[coin]['year'][1].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].close);
      this.testLabels[coin]['year'].push(moment(this.dataImports[coin][this.dataImports[coin].length - i - 1].time).format('HH:MM DD MMM, YYYY'));
    }
    for (var i = 0; i < (Math.floor(this.dataImports[coin].length * .6)); i++) {
      this.testData[coin]['month'][0].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].marketCap);
      this.testData[coin]['month'][1].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].close);
      this.testLabels[coin]['month'].push(moment(this.dataImports[coin][this.dataImports[coin].length - i - 1].time).format('HH:MM DD MMM, YYYY'));
    }
    for (var i = 0; i < (Math.floor(this.dataImports[coin].length * .4)); i++) {
      this.testData[coin]['week'][0].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].marketCap);
      this.testData[coin]['week'][1].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].close);
      this.testLabels[coin]['week'].push(moment(this.dataImports[coin][this.dataImports[coin].length - i - 1].time).format('HH:MM DD MMM, YYYY'));
    }
    for (var i = 0; i < (Math.floor(this.dataImports[coin].length * .2)); i++) {
      this.testData[coin]['day'][0].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].marketCap);
      this.testData[coin]['day'][1].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].close);
      this.testLabels[coin]['day'].push(moment(this.dataImports[coin][this.dataImports[coin].length - i - 1].time).format('HH:MM DD MMM, YYYY'));
    }
    for (var i = 0; i < (Math.floor(this.dataImports[coin].length * .1)); i++) {
      this.testData[coin]['hour'][0].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].marketCap);
      this.testData[coin]['hour'][1].data.push(this.dataImports[coin][this.dataImports[coin].length - i - 1].close);
      this.testLabels[coin]['hour'].push(moment(this.dataImports[coin][this.dataImports[coin].length - i - 1].time).format('HH:MM DD MMM, YYYY'));
    }
  }

  getTickerData() {
    this.coinDataRows.forEach((coin) => {
      if (coin.hardcoded) {
        this.counter++;
        this.getRealChartData();
        return;
      }
      let route = `https://api.coinmarketcap.com/v2/ticker/${coin.coinMarketCapId}/`;
      this.commonService.request(route)
        .then((response: any) => {
          if (response.data && response.data.quotes) {
            coin.marketCap = response.data.quotes.USD.market_cap;
            coin.price = response.data.quotes.USD.price;
            coin.volume24h = response.data.quotes.USD.volume_24h;
            coin.circulatingSupply = response.data.circulating_supply;
            this.counter++;
            if (this.counter == this.coinDataRows.length) {
              this.getRealChartData();
            }
          }
        })
        .catch((error) => {
          if (error) {
            return;
          }
        });
    });
  }

  getTransactionAPIRouteFromCoin(coin: string, address: string) {
    let key = '650f177ed2e89ac937ad3dc8960d8d3cb9bba901'; //btc.com api key
    let secret = '7391c6e431ec728c28c637f4be3237caabc1a5c5'; // btc api secret
    switch (coin) {
      case 'btc':
        return `https://chain.so/api/v2/address/btc/${address}`;
      case 'ltc':
        return `https://chain.so/api/v2/address/ltc/${address}`;
      case 'dash':
        return `https://api.blockcypher.com/v1/dash/main/addrs/${address}`;
      case 'eth':
        return `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apiKey=3FKDT3J3PJ94HWQBA41TKPV3Y9GYQRMS7E`;
      case 'bch':
        return `https://blockdozer.com/insight-api/txs/?address=${address}`;
    }
  }

  getUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  setCoin(event) {
    this.pieChartsMode.setValue(false);
    this.activeTab = event.target.id || event.target.parentNode.id;
    this.getChartData();
  }

  setTimeRange(event) {
    this.activeTime = event.target.id || event.target.parentNode.id;
    this.getChartData();
  }

  buildOverviewLabels(coins) {
    this.overviewLabels = coins.map((coin) =>
      [
        new Date(),
        'Market Cap: ' + this.decimalPipe.transform(coin.marketCap !== '-' ? coin.marketCap : 0) + ' USD',
        'Price (USD): ' + this.decimalPipe.transform(coin.price !== '-' ? coin.price : 0),
        '24h Vol: ' + this.decimalPipe.transform(coin.volume24h !== '-' ? coin.volume24h : 0)
      ]);
  }

  getRealChartData() {
    let overviewTransactions: any = [];
    let coinPricesInUSD = {};
    this.coinDataRows.forEach((coin) => {
      coinPricesInUSD[coin.code] = coin.price;
    });
    this.buildOverviewLabels(this.coinDataRows);
    Object.keys(this.transactions).forEach((coinName) => {
      if (coinName != 'overview') {
        this.transactions[coinName].forEach((transaction, index) => {
          transaction['usdValue'] = Number(transaction.value) * Number(coinPricesInUSD[coinName]);
          transaction['btcValue'] = Number(transaction.usdValue) / Number(coinPricesInUSD['btc']);

        });
      }
    });
    this.transactions.overview = this.transactions.overview.concat(this.transactions.btc).concat(this.transactions.eth).concat(this.transactions.ltc).concat(this.transactions.dash).concat(this.transactions.bch);
    this.coinList.forEach((coin) => {
      let baseUSD = 0;
      let baseValue = 0;
      let label = 'Total ' + (coin.code.toLowerCase() == 'overview' ? 'BTC Overview' : coin.code.toUpperCase());
      coin['chartData'] = [
        {data: [], label: label, yAxisID: 'y-axis-1'},
        {data: [], label: 'Total USD', yAxisID: 'y-axis-2'}
      ];
      coin['chartLabels'] = [];
      let orderedArray = this.transactions[coin.code].sort(this.sortArray);
      orderedArray.forEach((transaction) => {
        if (coin.code == 'bch') {
        }
        baseUSD += transaction.usdValue;
        if (coin.code == 'overview') {
          if (transaction.TXId == '86d0adaeb5554d99dfecf1fd985070a63e65d618f278dca988cda6bc02e004fe' || transaction.TXId == '800db2bbd3a399ab6e9690cbbafafd2dbedc764545b98232f79dc461abf016eb') {
          }
        }
        baseValue = coin.code == 'overview' ? baseValue + transaction.btcValue : baseValue + transaction.value;
        coin['chartData'][0].data.push(baseValue);
        coin['chartData'][1].data.push(baseUSD);
        coin['chartLabels'].push(transaction.date);
        if (coin.code == 'overview') {
          overviewTransactions.push(transaction);
        }
      });
      this.totalHoldings[coin.code] = baseUSD;
      this.newChartData[coin.code] = coin['chartData'];
      this.newChartLabels[coin.code] = coin['chartLabels'];
    });
    this.getChartData();
  }

  formatValue(rawValue: number | string): string {
    return this.decimalPipe.transform(rawValue);
  }


  getUSDValueFromCoin(coin, amount) {
    let num;
    this.coinDataRows.forEach((row) => {
      if (row.code == coin) {
        num = (Number(row.price) * Number(amount));
      }
    });
    return num;
  }

  getBTCAmountFromUSD(USDAmount) {
    let num;
    this.coinDataRows.forEach((row) => {
      if (row.code == 'btc') {
        num = USDAmount / Number(row.price);
      }
    });
    return num;
  }

  getChartData() {
    this.chartDataReady = false;
    this.dataToShow = [];
    this.labelsToShow = [];
    // let tempDataToShow = [
    //   {data: [], label: 'Market Cap', yAxisID: 'y-axis-1'},
    //   {data: [], label: 'Price USD', yAxisID: 'y-axis-2'}
    // ];
    // let tempLabelsToShow = [];
    // this.dataImports[this.activeTab][this.activeTime].forEach((datum, index) => {
    //   tempDataToShow[0].data.push(datum.marketCap);
    //   tempDataToShow[1].data.push(datum.close);
    //   tempLabelsToShow.push(this.getTimeLabels(datum, index));
    // });
    setTimeout(() => {
      let coin = this.activeTab;
      this.lineChartOptions.scales.yAxes['0'].ticks.fontColor = COLORS[coin];
      this.lineChartColors = colorChartPrefs[coin];
      this.dataToShow = this.newChartData[coin];
      this.labelsToShow = this.newChartLabels[coin];
      this.overviewMarketCaps = [this.coinDataRows.map((coin) => coin.marketCap)];
      ChartInterface.chartOptions.scales.yAxes[0].scaleLabel.labelString = 'Total ' + (this.activeTab === 'overview' ? 'BTC' : this.activeTab.toUpperCase()) + ' Equivalent Value';
      this.chartDataReady = true;
    }, 10);
  }

  getTimeLabels(datum, index) {
    if (this.activeTime == 'day') {
      return moment().subtract(((this.dataImports[this.activeTab][this.activeTime].length) - index), 'hours').format('HH:MM, DD MMM');
    }
    if (this.activeTime == 'month') {
      return moment().subtract(((this.dataImports[this.activeTab][this.activeTime].length / 4) - index), 'days').format('DD MMM, YYYY');
    }
    if (this.activeTime == 'hour') {
      let number = this.dataImports[this.activeTab][this.activeTime].length * 2;
      return moment().subtract(((number) - index), 'minutes').format('HH:mm');
    }
    if (this.activeTime == 'week') {
      return moment().subtract((((this.dataImports[this.activeTab][this.activeTime].length) - index)), 'hours').format('DD MMM YYYY');
    }
    if (this.activeTime == 'year') {
      return moment().subtract((((this.dataImports[this.activeTab][this.activeTime].length) - index)), 'days').format('DD MMM YYYY');
    }

    else return moment(datum.time).format('DD MMM, YYYY');

  }

  // getDummyChartJSData() {
  //   Object.keys(this.coinList).forEach((coin) => {
  //     this.lineChartData[this.coinList[coin].code] = {}
  //     this.timeRange.forEach((time) => {
  //       let quantity = this.getNumberFromTime(time)
  //       this.lineChartData[this.coinList[coin].code][time] = [
  //         {data: this.getRandomNumberArray(quantity, 3000000, 600000), label: 'Market Cap', yAxisID: 'y-axis-1'},
  //         {data: this.getRandomNumberArray(quantity, 900000000, 500000000), label: 'Price USD', yAxisID: 'y-axis-2'}
  //       ]
  //     })
  //   })
  //
  //   let data = [
  //     {data:[]},
  //     {data:[]}
  //   ];
  //
  //   this.timeRange.forEach((time) => {
  //     let quantity = this.getNumberFromTime(time);
  //     this.lineChartLabels[time] = this.getDummyTimeLabels(time)
  //   });
  // }

  getNumberFromTime(time: string) {
    switch (time) {
      case 'hour':
        return 60;
      case 'day':
        return 24;
      case 'week':
        return (7 * 24);
      case 'month':
        return (24 * 30);
      case 'year':
        return 365;
      case 'all':
        return 730;
    }
  }

  getTimeUnitFromTime(time: string) {
    switch (time) {
      case 'hour':
        return 'minutes';
      case 'day':
        return 'hours';
      case 'week':
        return 'hours';
      case 'month':
        return 'hours';
      case 'year':
        return 'days';
      case 'all':
        return 'days';
    }

  }

  getDummyTimeLabels(timeScale: string) {
    let quantity: number = this.getNumberFromTime(timeScale);
    let array = [];
    for (var i = quantity; i > 0; i--) {
      let value = moment();
      value = value.subtract(quantity, this.getTimeUnitFromTime(timeScale));
      let str = value.format('HH:MM DD MMM, YYYY');
      array.push(str);
    }
    return array;
  }

  // getRandomNumberArray(arrayLength: number, variation: number, maxValue: number) {
  //   let array = [];
  //   for (var i = 0; i < arrayLength; i++) {
  //     array.push(Math.round(Number(Math.random() * variation + (i * maxValue))));
  //   }
  //   return array;
  // }

  // generateNumberArray() {
  //   // this.chartDataReady = false;
  //   // // generate 4 numbers per hour for 18 months
  //   // // start at min 0, max 10
  //   // // progress to 18000000 towards the end of the year, with a min / max bracket of between 50 and 400 for each number
  //   // // occasionally throw in a bigger difference
  //   // let quantity = 52560;
  //   // let initialMin = 0;
  //   // let initialSmallMax = 342
  //   // let initialBigMin = 3800000
  //   // let initialBigMax = 3805175;
  //   //
  //   //
  //   // this.testData = [
  //   //   {data:[], label: 'Market Cap', yAxisID: 'y-axis-1'},
  //   //   {data:[], label: 'Price USD', yAxisID: 'y-axis-12'}
  //   // ]
  //   // for (var i = 0; i < quantity; i++) {
  //   //   this.testData[0].data.push(this.generateRandomNumber(this.generateRandomNumber((initialMin * 0.8),(initialMin * 1.2)), this.generateRandomNumber((initialSmallMax * 0.8),(initialSmallMax * 1.2))));
  //   //   this.testData[1].data.push(this.generateRandomNumber(this.generateRandomNumber((initialBigMin * 0.8),(initialBigMin * 1.2)), this.generateRandomNumber((initialBigMax * 0.8),(initialBigMax * 1.2))));
  //   //   initialMin = initialMin + 342;
  //   //   initialSmallMax = initialSmallMax + 342;
  //   //   initialBigMin = initialBigMin + 3805175;
  //   //   initialBigMax = initialBigMax + 3805175
  //   //   this.testLabels.push('Data ' + i.toString())
  //   // }
  //   //
  //   // this.chartDataReady = true;
  //   // console.log(this.testData)
  //   //
  //   //
  // }

  // getTestDataArray() {
  //   let array = [];
  //   let arrayLength = 52560;
  //   let highestValue = 18000000
  //   let startMinValue = 0;
  //   let startMaxValue = 100;
  //
  // }
  //
  // generateRandomNumber(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

}
