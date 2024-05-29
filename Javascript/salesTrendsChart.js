document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('salesTrendsChart').getContext('2d');
    let fill = true;

    const config = {
        type: 'line',
        data: {
            labels: ['Sep 2016', 'Okt 2016', 'Nov 2016', 'Des 2016', 'Jan 2017', 'Feb 2017', 'Mar 2017', 'Apr 2017', 'Mei 2017', 'Jun 2017', 'Jul 2017', 'Agu 2017'],
            datasets: [{
                label: 'UNIT KOMERSIAL',
                data: [24116, 10232, 25042, 17840, 14642, 13109, 16029, 9210, 14328, 12890, 8770, 7018],
                borderColor: 'rgba(220, 20, 60, 1)',
                backgroundColor: 'rgba(220, 20, 60, 0.2)',
                fill: fill,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(220, 20, 60, 1)',
                pointBorderColor: 'rgba(220, 20, 60, 1)'
            },
            {
                label: 'UNIT RESIDENSIAL',
                data: [4176, 1055, 779, 1005, 1148, 909, 1052, 1544, 452, 3222, 318, 605],
                borderColor: 'rgba(139, 0, 139, 1)',
                backgroundColor: 'rgba(139, 0, 139, 0.2)',
                fill: fill,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(139, 0, 139, 1)',
                pointBorderColor: 'rgba(139, 0, 139, 1)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 26000
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    };

    const salesTrendsChart = new Chart(ctx, config);

    document.getElementById('toggleFill').addEventListener('change', function() {
        fill = this.checked;
        config.data.datasets.forEach(dataset => {
            dataset.fill = fill;
        });
        salesTrendsChart.update();
    });
});