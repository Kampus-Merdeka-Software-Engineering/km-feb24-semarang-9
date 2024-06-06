const dataTable = document.getElementById("data");
let page = 1;
let limit = 20;
let originalData = [];
let filteredData = [];

// Fetch data from JSON file
fetch("./data/data-tim-09.json")
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        originalData = data;
        populateFilterOptions();
        filteredData = originalData;
        renderTable();
    })
    .catch(error => {
        console.log({ error });
        alert("Error: " + JSON.stringify(error));
    });

function populateFilterOptions() {
    const boroughSet = new Set(originalData.map(item => item.BOROUGH));
    const neighborhoodSet = new Set(originalData.map(item => item.NEIGHBORHOOD));
    
    const boroughFilter = document.getElementById("borough-filter");
    boroughSet.forEach(borough => {
        const option = document.createElement("option");
        option.value = borough;
        option.textContent = borough;
        boroughFilter.appendChild(option);
    });

    const neighborhoodFilter = document.getElementById("neighborhood-filter");
    neighborhoodSet.forEach(neighborhood => {
        const option = document.createElement("option");
        option.value = neighborhood;
        option.textContent = neighborhood;
        neighborhoodFilter.appendChild(option);
    });
}

function applyFilters() {
    const boroughFilter = document.getElementById("borough-filter").value;
    const neighborhoodFilter = document.getElementById("neighborhood-filter").value;

    filteredData = originalData.filter(item => {
        return (boroughFilter === "" || item.BOROUGH === boroughFilter) &&
               (neighborhoodFilter === "" || item.NEIGHBORHOOD === neighborhoodFilter);
    });

    page = 1; // Reset to first page
    renderTable();
}

function changeRowsPerPage() {
    limit = parseInt(document.getElementById("rows-per-page").value);
    page = 1; // Reset to first page
    renderTable();
}

function renderTable() {
    let dataBody = "";
    const start = (page - 1) * limit;
    const end = page * limit;

    for (let i = start; i < end && i < filteredData.length; i++) {
        dataBody += `
            <tr>
                <td>${i + 1}</td>
                <td>${filteredData[i].BOROUGH}</td>
                <td>${filteredData[i].NEIGHBORHOOD}</td>
                <td>${filteredData[i]['YEAR BUILT']}</td>
                <td>${filteredData[i]['SALE PRICE']}</td>
                <td>${filteredData[i]['SALE DATE']}</td>
            </tr>
        `;
    }

    dataTable.innerHTML = dataBody;
    document.getElementById("page-number").textContent = page;
}

function prevPage() {
    if (page > 1) {
        page--;
        renderTable();
    }
}

function nextPage() {
    if (page * limit < filteredData.length) {
        page++;
        renderTable();
    }
}

// Function Feed Back Form
function showFeedbackForm() {
    var feedbackPopup = document.getElementById("feedbackPopup");
    feedbackPopup.style.display = "block"; // Tampilkan popup formulir umpan balik
}

function hideFeedbackPopup() {
    var feedbackPopup = document.getElementById("feedbackPopup");
    feedbackPopup.style.display = "none"; // Sembunyikan popup formulir umpan balik
}

function hideThankYouPopup() {
    var thankYouPopup = document.getElementById("thankYouPopup");
    thankYouPopup.style.display = "none"; // Sembunyikan popup pesan terima kasih
}

document.getElementById("feedbackFormContent").addEventListener("submit", function(event) {
    event.preventDefault(); // Menghentikan pengiriman formulir
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var thankYouText = "Thank you, " + name + "! Your message has been submitted.";
    document.getElementById("thankYouText").textContent = thankYouText;
    var thankYouPopup = document.getElementById("thankYouPopup");
    thankYouPopup.style.display = "block"; // Tampilkan popup pesan terima kasih
    hideFeedbackPopup(); // Sembunyikan popup formulir umpan balik setelah pengiriman
});

document.addEventListener('DOMContentLoaded', () => {
    let chartInstances = [];

    function createBoroughSalesChart(data) {
        const boroughSales = data.reduce((acc, curr) => {
            if (!acc[curr.BOROUGH]) {
                acc[curr.BOROUGH] = 0;
            }
            acc[curr.BOROUGH] += parseInt(curr["SALE PRICE"]) || 0;
            return acc;
        }, {});

        const boroughs = Object.keys(boroughSales);
        const sales = Object.values(boroughSales);

        const ctx = document.getElementById('salesChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: boroughs,
                datasets: [{
                    label: 'Total Sales Price',
                    data: sales,
                    backgroundColor: ['red', 'yellow', 'green', 'blue', 'black'],
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

        chartInstances.push(chart);
    }

    function createSalesTrendsChart() {
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
        chartInstances.push(salesTrendsChart);

        document.getElementById('toggleFill').addEventListener('change', function () {
            fill = this.checked;
            config.data.datasets.forEach(dataset => {
                dataset.fill = fill;
            });
            salesTrendsChart.update();
        });
    }

    function createTaxClassSalesChart(data) {
        const taxClassSales = {};
        let totalSales = 0;
        let totalCount = 0;

        data.forEach(item => {
            const taxClass = item['TAX CLASS AT TIME OF SALE'];
            const salePrice = parseInt(item['SALE PRICE']) || 0;

            if (!taxClassSales[taxClass]) {
                taxClassSales[taxClass] = { total: 0, count: 0 };
            }

            taxClassSales[taxClass].total += salePrice;
            taxClassSales[taxClass].count++;

            totalSales += salePrice;
            totalCount++;
        });

        if (!taxClassSales['3']) {
            taxClassSales['3'] = { total: 0, count: 0 };
        }

        const taxClassAverages = {};
        Object.keys(taxClassSales).forEach(taxClass => {
            taxClassAverages[taxClass] = taxClassSales[taxClass].total / taxClassSales[taxClass].count;
        });

        const taxClassLabels = Object.keys(taxClassAverages);
        const taxClassAveragesData = Object.values(taxClassAverages);

        const ctx = document.getElementById('taxClassSalesChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: taxClassLabels,
                datasets: [{
                    label: 'Average Sales Price',
                    data: taxClassAveragesData,
                    backgroundColor: ['red', 'yellow', 'blue', 'green'],
                    borderColor: 'black',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

        chartInstances.push(chart);

        document.getElementById('total-sales').innerText = totalCount;
        document.getElementById('average-price').innerText = (totalSales / totalCount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById('total-value').innerText = totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    function createTaxClassBuildingChart(data) {
        const ctx = document.getElementById('taxClassBuildingChart').getContext('2d');
        let chart;

        function createChart(filteredData) {
            const boroughs = Array.from(new Set(data.map(item => item.BOROUGH)));
            const taxClasses = ['1', '2', '3', '4'];
            const colors = ['red', 'yellow', 'grey', 'green'];
            const borderColors = 'black';

            const boroughCounts = boroughs.map(borough => {
                const counts = { '1': 0, '2': 0, '3': 0, '4': 0 };
                filteredData.filter(item => item.BOROUGH === borough).forEach(item => {
                    const taxClass = item["TAX CLASS AT PRESENT"];
                    if (counts[taxClass] !== undefined) {
                        counts[taxClass]++;
                    }
                });
                return counts;
            });

            const datasets = taxClasses.map((taxClass, index) => ({
                label: `Kelas ${taxClass}`,
                data: boroughCounts.map(counts => counts[taxClass]),
                backgroundColor: colors[index],
                borderColor: borderColors[index],
                borderWidth: 1
            }));

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: boroughs,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            chartInstances.push(chart);
        }

        function updateChart() {
            const selectedTaxClasses = Array.from(document.querySelectorAll('.taxClassFilter:checked')).map(checkbox => checkbox.value);
            let filteredData = data.filter(item => selectedTaxClasses.includes(item["TAX CLASS AT PRESENT"]));
            createChart(filteredData);
        }

        document.querySelectorAll('.taxClassFilter').forEach(checkbox => {
            checkbox.addEventListener('change', updateChart);
        });

        createChart(data);
    }

    function filterDataByDate(data, startDate, endDate) {
        return data.filter(item => {
            const saleDate = new Date(item['SALE DATE']);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    function updateCharts(filteredData) {
        chartInstances.forEach(chart => chart.destroy());
        chartInstances = [];
        
        createBoroughSalesChart(filteredData);
        createSalesTrendsChart();
        createTaxClassSalesChart(filteredData);
        createTaxClassBuildingChart(filteredData);
    }

    function populateDateFilter(data) {
        const saleDates = Array.from(new Set(data.map(item => item['SALE DATE']))).sort();
        const saleDateFilter = document.getElementById('saleDateFilter');

        saleDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.text = date;
            saleDateFilter.add(option);
        });

        saleDateFilter.addEventListener('change', function () {
            const selectedDate = this.value;
            if (selectedDate === 'all') {
                updateCharts(data);
            } else {
                const filteredData = data.filter(item => item['SALE DATE'] === selectedDate);
                updateCharts(filteredData);
            }
        });
    }

    fetch('./data/data-tim-09.json')
        .then(response => response.json())
        .then(data => {
            createBoroughSalesChart(data);
            createSalesTrendsChart();
            createTaxClassSalesChart(data);
            createTaxClassBuildingChart(data);

            populateDateFilter(data);
        })
        .catch(error => console.error('Error fetching the data:', error));
});