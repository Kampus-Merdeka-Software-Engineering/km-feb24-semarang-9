document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/data-tim-09.json')
        .then(response => response.json())
        .then(data => {
            // Objek untuk menyimpan total penjualan dan jumlah penjualan untuk setiap tax class
            const taxClassSales = {};
            let totalSales = 0;
            let totalCount = 0;

            // Menghitung total penjualan dan jumlah penjualan untuk setiap tax class
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
                        backgroundColor:  [
                            'red', // Warna untuk batang pertama
                            'yellow',  // Warna untuk batang kedua
                            'blue',  // Warna untuk batang ketiga
                            'green',  // Warna untuk batang keempat
                        ],
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

            // Menampilkan total penjualan dan rata-rata harga penjualan di elemen HTML
            const totalSalesElement = document.getElementById('total-sales');
            const averagePriceElement = document.getElementById('average-price');
            const totalValueElement = document.getElementById('total-value');

            totalSalesElement.innerText = totalCount;
            averagePriceElement.innerText = (totalSales / totalCount).toFixed(2);
            totalValueElement.innerText = totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        })
        .catch(error => console.error('Error fetching the data:', error));
});
