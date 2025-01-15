
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

// Función principal para realizar el scraping
const scrap = () => {
  return axios.get(url).then((response) => {
      const $ = cheerio.load(response.data);
      
      let noticias = [];

      // Extrae las noticias de la página
      $('.c').each((index, elemento) => {
        const titulo = $(elemento).find('.c_h').text().trim();
        const descripcion = $(elemento).find('.c_d').text().trim();
        const enlace = $(elemento).find('.c_t a').attr('href');
        const imagen = $(elemento).find('img').attr('src');
        
        if (titulo && descripcion && enlace && imagen) {
          noticias.push({ 
            id: noticias.length + 1, 
            titulo, 
            descripcion, 
            enlace, 
            imagen });
        }
      });
      //console.log(noticias)
      
      // Guarda las noticias en un archivo JSON 
      fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2)); 
      
      return noticias; 
    }) 
    .catch((error) => { 
        console.error('Error al realizar el scraping:', error.message); 
    }); 
}; 

// Exporta la función para usarla en otros archivos 
module.exports = scrap;
