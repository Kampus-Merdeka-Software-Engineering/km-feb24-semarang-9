document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/data-tim-09.json')
        .then(response => response.json())
        .then(data => {
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
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: boroughs,
                    datasets: [{
                        label: 'Total Sales Price',
                        data: sales,
                        backgroundColor: [
                            'red', // Warna untuk batang pertama
                            'yellow',  // Warna untuk batang kedua
                            'green',  // Warna untuk batang ketiga
                            'blue',  // Warna untuk batang keempat
                            'black'  // Warna untuk batang kelima
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
        })
        .catch(error => console.error('Error fetching the data:', error));
});
