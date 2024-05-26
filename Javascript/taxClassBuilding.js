fetch('./data/data-tim-09.json')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('taxClassBuildingChart').getContext('2d');
        let chart;

        function createChart(filteredData) {
            const boroughs = Array.from(new Set(data.map(item => item.BOROUGH)));
            const taxClasses = ['1', '2', '3', '4'];
            const colors = [
                'red',
                'yellow',
                'grey',
                'green'
            ];
            const borderColors = 'black';

            const boroughCounts = boroughs.map(borough => {
                const counts = { '1': 0, '2': 0, '3': 0, '4': 0 };
                filteredData
                    .filter(item => item.BOROUGH === borough)
                    .forEach(item => {
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
        }

        function updateChart() {
            const selectedTaxClasses = Array.from(document.querySelectorAll('.taxClassFilter:checked')).map(checkbox => checkbox.value);
            let filteredData = data.filter(item => selectedTaxClasses.includes(item["TAX CLASS AT PRESENT"]));
            createChart(filteredData);
        }

        document.querySelectorAll('.taxClassFilter').forEach(checkbox => {
            checkbox.addEventListener('change', updateChart);
        });

        // Inisialisasi chart dengan semua data
        createChart(data);
    })
    .catch(error => console.error('Error fetching data:', error));
