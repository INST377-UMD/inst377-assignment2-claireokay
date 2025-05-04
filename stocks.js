async function redditLookup() {
    const response = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
        const data = await response.json();
        return data;
}

async function loadTable () {
    const stocks = await redditLookup();
    const firstFive = stocks.slice(0, 5);
    const topstocks = document.getElementById('topstocks');

    
    firstFive.forEach((company) => {
        const tableRow = document.createElement('tr');
        const ticker = document.createElement('td');
        const commentnum = document.createElement('td');
        const bearvbull = document.createElement('td');
        const img = document.createElement('img');
        const link = document.createElement('a');

        stockAcronym= company['ticker']
        link.textContent = stockAcronym
    
        link.href = `https://finance.yahoo.com/quote/${stockAcronym}`; 

        commentnum.innerHTML = company['no_of_comments'];
        bearvbull.innerHTML = company['bearvbull'];
    
        tableRow.appendChild(link);
        tableRow.appendChild(commentnum);
       
        if (company['sentiment'] === "Bullish") {
            img.src = "bullish.png";
            img.alt = "Bullish";
          } else {
            img.src = "bearish.webp";
            img.alt = "Bearish";
          }
        
        tableRow.appendChild(img);

        topstocks.append(tableRow);
        });

}

const API_KEY = 'SmOL9DSaTi5reXnaIlm_uaqdLGu81zV9';
    let chart;

    async function searchStock() {
      const name = document.getElementById('stockname').value;
      const searchUrl = `https://api.polygon.io/v3/reference/tickers?search=${name}&active=true&apiKey=${API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (searchData && searchData.results && searchData.results.length > 0) {
        const ticker = searchData.results[0].ticker;
        getChartData(ticker);
      }
    }

    async function getChartData(ticker) {
      const end = new Date().toISOString().split("T")[0];
      const length = document.getElementById('time').value;
      if (length === "90") {
        start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      } else if(length === "60") {
        start = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      } else {
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      }

      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=30&apiKey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.results) {
        const labels = data.results.map(r => new Date(r.t).toLocaleDateString());
        const prices = data.results.map(r => r.c); 

        renderChart(ticker, labels, prices);
      }
    }

    function renderChart(ticker, labels, prices) {
      if (chart) chart.destroy();

      const ctx = document.getElementById('stockChart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${ticker}`,
            data: prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: { display: true, text: 'Date' }
            },
            y: {
              display: true,
              title: { display: true, text: 'Price (USD)' }
            }
          }
        }
      });
    }

window.onload = loadTable;