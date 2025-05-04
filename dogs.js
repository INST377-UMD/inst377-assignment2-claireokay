async function get10Dogs() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await response.json();
    return data.message;
  }
  
  async function getdogBreed(breed) {
    const targetName = transformBreedNameForApi(breed);  
    let pageNumber = 1;
    let keepSearching = true;
  
    while (keepSearching) {
      const apiUrl = `https://dogapi.dog/api/v2/breeds?page[number]=${pageNumber}`;
      console.log(`Workspaceing page ${pageNumber}: ${apiUrl}`); 
      
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          console.error(`API Error: ${response.status} - ${response.statusText} for page ${pageNumber}`);
          keepSearching = false;
          break;
        }
  
        const pageData = await response.json();
  
        if (pageData && pageData.data && pageData.data.length > 0) {
          for (const breedItem of pageData.data) {
            if (breedItem.attributes.name.toLowerCase() === targetName.toLowerCase()) {
              console.log(`Match found for "${targetName}"!`);
              return { data: [breedItem] };
            }
          }
          if (!pageData.links || !pageData.links.next) {
            console.log(`Reached last page (${pageNumber}) without finding "${targetName}".`);
            keepSearching = false; 
          } else {
            pageNumber++;
          }
        } else {
          console.log(`Page ${pageNumber} contained no data. Stopping search.`); 
          keepSearching = false;
        }
  
      }
      console.log(`Search finished. No match found for "${targetName}".`); 
        return { data: [] }; 
    }
  
function transformBreedNameForApi(dogCeoBreed) {
    const parts = dogCeoBreed.split('-');
    const transformedParts = parts.map(part => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      });
    if (transformedParts.length > 1) {
       return transformedParts.reverse().join(' ');
    }
    return transformedParts.join(' '); 
  }

  async function displayDog() {
    const dogImages = await get10Dogs();
    const slider = document.getElementById("myslider");
    const breedPanel = document.getElementById("breeds");

    slider.innerHTML = "";
    breedPanel.innerHTML = "";
  
    dogImages.forEach((url) => {
      const img = document.createElement('img');
      img.style.width  = "300px";
      img.style.margin = "10px";
      img.src = url;
      slider.appendChild(img);
  
      const match = url.match(/breeds\/([^/]+)\//);
      const breedOnly  = match ? match[1] : "unknown";
  
      const label = breedOnly
        .split(/[-_]/)                         
        .reverse()                             
        .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      const btn = document.createElement('button');
      btn.className = "button-65";
      btn.textContent = label;
      btn.title = `Show info for ${label}`;
      btn.onclick = async () => {
        const data = await getdogBreed(breedOnly); 
        generateDogInfo(label, data);
      };
      breedPanel.appendChild(btn);
    });
  
   
    simpleslider.getSlider({ container: slider });
  }
  function generateDogInfo(label, data) {
    const infoContainer = document.getElementById("dogInfo");
    infoContainer.innerHTML = "";
  
    const info = data.data[0].attributes;
    const div = document.createElement('div');
        if (!!info) {
            const name = info.name;
            const description = info.description;
            const minLife= info.life.min;
            const maxLife = info.life.max;
            div.innerHTML = `
            <h3>${name}</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Min Life:</strong> ${minLife}</p>
            <p><strong>Max Life:</strong> ${maxLife}</p>
          `;
            
        } else {
            div.innerHTML = `
            <p>No information about this breed.</p>
          `;
        }
        infoContainer.appendChild(div);
  }
  
  window.onload = displayDog;