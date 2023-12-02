const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://catfact.ninja/breeds';
const outputFile = 'catBreeds.txt';

async function getData() {
  try {
    // Step 1: Log the response AS-IS to a text file
    const response = await axios.get(apiUrl);
    fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2));

    // Step 2: Console log the number of pages of data
    const totalPages = response.headers['x-total-pages'];
    console.log(`Number of pages: ${totalPages}`);

    // Step 3: Get data from ALL the pages
    const allData = await getAllPagesData(totalPages);

    // Step 4: Group data by Country
    const groupedByCountry = groupByCountry(allData);

    // Step 4a: Return cat breeds grouped by Country
    console.log(JSON.stringify(groupedByCountry, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getAllPagesData(totalPages) {
  const promises = [];
  for (let page = 1; page <= totalPages; page++) {
    promises.push(axios.get(`${apiUrl}?page=${page}`));
  }
  const responses = await Promise.all(promises);
  return responses.map((response) => response.data);
}

function groupByCountry(data) {
  const groupedData = {};

  data.forEach((page) => {
    page.data.forEach((breed) => {
      const country = breed.origin;
      if (!groupedData[country]) {
        groupedData[country] = [];
      }
      groupedData[country].push({
        breed: breed.breed,
        origin: breed.origin,
        coat: breed.coat,
        pattern: breed.pattern,
      });
    });
  });

  return groupedData;
}

getData();
