function getQuoteAPI() {
    fetch('https://zenquotes.io/api/random')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var quote = data[0].h; 
        document.getElementById('quote').innerHTML = quote;
      })
};

window.onload = getQuoteAPI();