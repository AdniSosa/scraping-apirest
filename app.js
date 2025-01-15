const express = require('express'),
scrap = require('./scraping'),
fs = require('fs');
app = express(),
PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];

// Leer datos desde el archivo JSON
function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
      noticias = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

  // Guardar datos en el archivo JSON
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }

//READ
app.get('/scraping', (req, res) => { 
    scrap().then(() => { 
        leerDatos(); 
        res.status(200).send(noticias); 
    }) 
    .catch((error) => { 
        res.status(500).send(`Error al realizar el scraping: ${error.message}`); 
    }); 
});

app.get('/noticias', (req, res) => {
    leerDatos(); 
    res.json(noticias);
})

app.get('/noticias/:id', (req, res) => {
    leerDatos();
    const id = parseInt(req.params.id, 10);
    const noticiaEncontrada = noticias.find(noticia => noticia.id === id)
    
    if (!noticiaEncontrada) {
        return res.status(404).json(`Noticia no encontrada`);
    } 
        
    res.status(200).json(noticiaEncontrada)
    
    
})

//create
app.post('/noticias', (req, res) => {
    const noticiaNueva = {
        id: noticias[noticias.length - 1].id + 1,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        enlace: req.body.enlace,
        imagen: req.body.imagen
    };
    leerDatos(); 
    noticias.push(noticiaNueva); 
    guardarDatos(); 
    res.status(201).send(noticias);
    //res.redirect('/scraping');
})

//UPDATE
app.put('/noticias/:id', (req, res) => {
    const id = req.params.id;
    const { titulo, descripcion, enlace, imagen } = req.body;
    
    leerDatos(); 

    const noticiaUpdate = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        enlace: req.body.enlace,
        imagen : req.body.imagen
    };
    if(id === -1) {
        return res.status(404).json({error: 'Noticia no encontrada'})
    }

    if(titulo) {
        noticias[id].titulo = titulo;
    }

    if(descripcion) {
        noticias[id].descripcion = descripcion;
    }

    if(enlace) {
        noticias[id].enlace = enlace;
    }

    if(imagen) {
        noticias[id].imagen = imagen;
    }
    
    noticias[id] = noticiaUpdate; 
    guardarDatos(); 
    res.status(201).send(noticiaUpdate);
}) 

//DELETE
app.delete('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    leerDatos(); 

    if(!id) {
        return res. status(404).json({error: `La noticia no ha sido encontrada`})
    }
    
    noticias = noticias.filter(noticia => noticia.id !== id);
    guardarDatos(); 
    res.json({Mensaje: `Noticia borrada`})

})

/* app.delete('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    leerDatos();
  
    if (noticias[id]) {
      noticias.splice(id, 1);
      guardarDatos();
      res.status(200).send('Noticia eliminada.');
    } else {
      res.status(404).send('Noticia no encontrada.');
    }
  }); */


app.listen(PORT, () => {
    console.log(`Express está escuchando por el puerto http://localhost:${PORT}`)
})