import {DecimalPipe} from '@angular/common';

const decimalPipe = new DecimalPipe('en');

const baseColorPrefs = [
  { // grey
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#009e73',
    pointBackgroundColor: '#009e73',
    pointBorderColor: '#fff',
    pointBorderWidth: 1,
    pointRadius: 1,
    pointHoverRadius: 2,
    pointHitRadius: 10
  },
  { // dark grey
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#f0ad4e',
    pointBackgroundColor: '#009e73',
    pointBorderColor: '#fff',
    pointBorderWidth: 1,
    pointRadius: 1,
    pointHitRadius: 10,
    pointHoverRadius: 2
  }
];

export const COLORS = {
  eth: '#627eea',
  btc: '#f0ad4e',
  bch: '#91c64b',
  ltc: '#bfbbbb',
  dash: '#1d75bd',
  usd: '#009e73',
  omc: '#c64100'
};

export const colorChartPrefs = {
  overview: buildColorPrefs(COLORS.btc),
  eth: buildColorPrefs(COLORS.eth),
  btc: buildColorPrefs(COLORS.btc),
  bch: buildColorPrefs(COLORS.bch),
  ltc: buildColorPrefs(COLORS.ltc),
  dash: buildColorPrefs(COLORS.dash),
  omc: buildColorPrefs(COLORS.omc),
};

function buildColorPrefs(colorCode: string) {
  const coinPref = JSON.parse(JSON.stringify(baseColorPrefs));
  coinPref[1].borderColor = colorCode;
  coinPref[1].pointBackgroundColor = colorCode;
  return coinPref;
}

export const ChartInterface = {
  chartColors: baseColorPrefs,
  chartOptions: {
    responsive: true,
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    scales: {
      yAxes: [
        {
          type: 'linear',
          id: 'y-axis-1',
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Total BTC'
          },
          ticks: {
            fontColor: COLORS.btc,
            callback: function (value, index, values) {
              return Math.abs(Number(value)) >= 1.0e+9

                ? Math.abs(Number(value)) / 1.0e+9 + 'B'
                // Six Zeroes for Millions
                : Math.abs(Number(value)) >= 1.0e+6

                  ? Math.abs(Number(value)) / 1.0e+6 + 'M'
                  // Three Zeroes for Thousands
                  : Math.abs(Number(value)) >= 1.0e+3

                    ? Math.abs(Number(value)) / 1.0e+3 + 'K'

                    : Math.abs(Number(value));
            }
          },

        },
        {
          type: 'linear',
          id: 'y-axis-2',
          display: true,
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: 'Total USD Equivalent Value'
          },
          ticks: {
            fontColor: COLORS.usd,
            callback: function (value, index, values) {
              return Math.abs(Number(value)) >= 1.0e+9

                ? Math.abs(Number(value)) / 1.0e+9 + 'B'
                // Six Zeroes for Millions
                : Math.abs(Number(value)) >= 1.0e+6

                  ? Math.abs(Number(value)) / 1.0e+6 + 'M'
                  // Three Zeroes for Thousands
                  : Math.abs(Number(value)) >= 1.0e+3

                    ? Math.abs(Number(value)) / 1.0e+3 + 'K'

                    : Math.abs(Number(value));
            }
          }
        }
      ],
      xAxes: [
        {
          display: true
        }
      ]
    },
    elements: {
      point: {
        radius: 10
      }
    },
    tooltips: {
      mode: 'x-axis',
      backgroundColor: 'rgba(0,0,0,0.1)',
      titleFontColor: 'rgb(114,115,116)',
      bodyFontColor: '#e2ebef',
      titleMarginBottom: 15,
      bodySpacing: 15,
      xPadding: 15,
      yPadding: 15,
      multiKeyBackground: '#32a97b',
      callbacks: {
        label: function(tooltipItem, chart) {
          const label = chart.datasets[tooltipItem.datasetIndex].label;
          return label + ' ' + decimalPipe.transform(tooltipItem.yLabel);
        },
        labelColor: (tooltipItem, chart) => {
          const color = chart.data.datasets[1].borderColor;
          if (tooltipItem.datasetIndex === 0) {
            return {
              borderColor: color,
              backgroundColor: color
            };
          }
          if (tooltipItem.datasetIndex === 1) {
            return {
              borderColor: '#32a97b',
              backgroundColor: '#32a97b'
            };
          }
        },
      },
      displayColors: true,
      labelColor: (item, chart) => {
        let btcColor = {
          borderColor: '#a97c51',
          backgroundColor: '#a97c51'
        };
        let bchColor = {
          borderColor: '#91c64b',
          backgroundColor: '#91c64b'
        };
        return item.datasetIndex == 0 ? btcColor : bchColor;
      }
    }
  },
};

