import { Chart } from 'chart.js';

function getColor(isActive, alpha = 1) {
    return (isActive)
      ? `rgba(54, 162, 235, ${alpha})`
      : `rgba(255, 99, 132, ${alpha})`;
  };

export function createChart(obj){
    var ctx = document.getElementById('myChart').getContext('2d');
    var labels = []
    obj.chart.forEach(function(item, i, arr) {
        labels.push(i);
    });
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "My First dataset",
                backgroundColor: getColor(obj.isActive, 0.5),
                borderColor: getColor(obj.isActive),
                data: obj.chart,
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min:0
                    }
                }]
            }
        }
    });
}