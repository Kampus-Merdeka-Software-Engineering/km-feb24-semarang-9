document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/data-tim-09.json')
        .then(response => response.json())
        .then(data => {
            // Objek untuk menyimpan total penjualan dan jumlah penjualan untuk setiap tax class
            const taxClassSales = {};
            
            // Menghitung total penjualan dan jumlah penjualan untuk setiap tax class
            data.forEach(item => {
                const taxClass = item['TAX CLASS AT TIME OF SALE'];
                const salePrice = parseInt(item['SALE PRICE']) || 0;

                if (!taxClassSales[taxClass]) {
                    taxClassSales[taxClass] = { total: 0, count: 0 };
                }

                taxClassSales[taxClass].total += salePrice;
                taxClassSales[taxClass].count++;
            });

            // Memastikan angka kelas nomor 3 ada dalam data
            if (!taxClassSales['3']) {
                taxClassSales['3'] = { total: 0, count: 0 };
            }

            // Menghitung rata-rata penjualan untuk setiap tax class
            const taxClassAverages = {};
            Object.keys(taxClassSales).forEach(taxClass => {
                taxClassAverages[taxClass] = taxClassSales[taxClass].total / taxClassSales[taxClass].count;
            });

            // Membuat array label dan data untuk grafik
            const taxClassLabels = Object.keys(taxClassAverages);
            const taxClassAveragesData = Object.values(taxClassAverages);

            // Mendapatkan konteks dari elemen canvas
            const ctx = document.getElementById('taxClassSalesChart').getContext('2d');

            // Membuat grafik
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: taxClassLabels,
                    datasets: [{
                        label: 'Average Sales Price',
                        data: taxClassAveragesData,
                        backgroundColor: [
                            'red',
                            'yellow',
                            'blue',
                            'green'
                        ],
                        borderColor: 'black',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true // Memulai sumbu y dari 0
                            
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching the data:', error));
});
