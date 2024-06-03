const dataTable = document.getElementById("data");
let page = 1;
let limit = 20;
let originalData = [];
let filteredData = [];

fetch("./data/data-tim-09.json")
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        originalData = data;
        filteredData = originalData;
        renderTable();
    })
    .catch(error => {
        console.log({ error });
        alert("Error: " + JSON.stringify(error));
    });

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

