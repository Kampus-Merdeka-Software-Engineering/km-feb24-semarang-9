const data = {
    "sales": [
        {"neighborhood": "BLOOMFIELD", "average_sales": 25696111},
        {"neighborhood": "MIDTOWN CBD", "average_sales":  20746059},
        {"neighborhood": "FASHION", "average_sales": 14285481},
        {"neighborhood": "JAVITS CENTER", "average_sales": 13714060},
        {"neighborhood": "EAST RIVER", "average_sales": 11200000},
        {"neighborhood": "FINANCIAL", "average_sales":7159234},
        {"neighborhood": "CIVIC CENTER", "average_sales": 6269266},
        {"neighborhood": "DOWNTOWN-METROTECH", "average_sales": 5043412},
        {"neighborhood": "SOHO", "average_sales": 3796109},
        {"neighborhood": "LITTLE ITALY", "average_sales":  3720473}
    ],
    "propertyAge": {
        OLD: { percentage: 82.3, value: 124454266 },
        NEW: { percentage: 17.7, value: 26829413 }
    }
};

const ctx = document.getElementById('Avarange-salesChart').getContext('2d');
let chart;

function createChart(filteredData) {
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredData.map(item => item.neighborhood),
            datasets: [{
                label: 'Average Sales',
                data: filteredData.map(item => item.average_sales),
                backgroundColor: [
                    'red',
                    'yellow',
                    'green',
                    'blue',
                    'purple',
                    'white',
                    'grey',
                    'black',
                    'cyan',
                    'brown'
                    
                ],
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function filterData() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selectedNeighborhoods = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const filteredData = data.sales.filter(item => selectedNeighborhoods.includes(item.neighborhood));
    createChart(filteredData);
}

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterData);
});

filterData();  // Initial call to display the chart

const labels = ['OLD', 'NEW'];
const percentages = [data.propertyAge.OLD.percentage, data.propertyAge.NEW.percentage];

const propertyAgeCtx = document.getElementById('propertyAgeChart').getContext('2d');
let propertyAgeChart;

function createPieChart() {
    if (propertyAgeChart) {
        propertyAgeChart.destroy();
    }
    propertyAgeChart = new Chart(propertyAgeCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribution by Age',
                data: percentages,
                backgroundColor: [
                    'red', 
                    'cyan'  
                ],
                borderColor: [
                    'black'
                ],
                borderWidth: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label;
                            const percentage = tooltipItem.raw;
                            const value = label === 'OLD' ? data.propertyAge.OLD.value : data.propertyAge.NEW.value;
                            return `${label}: ${percentage}% - ${value.toLocaleString()} juta`;
                        }
                    }
                }
            }
        }
    });
}

createPieChart();