document.addEventListener("DOMContentLoaded", function() {

// Paginación
let pagina = 1
const btnSiguiente = document.getElementById("btnSiguiente");
const btnAtras = document.getElementById("btnAtras");

// Configuración de botón siguiente página
btnSiguiente.addEventListener("click", () => {
    if (pagina < 1000){
        pagina += 1;
        URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${KEY}&language=en-US&page=${pagina}`;
        mostrarSeries();
    }
});

// Configuración de botón página anterior
btnAtras.addEventListener("click", () => {
    if (pagina > 1){
        pagina -= 1;
        URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${KEY}&language=en-US&page=${pagina}`;
        mostrarSeries();
    }
});



// Agregar y Borrar series de la Lista

const seriesAgregadas = []; //Declaro un arreglo para luego poder verificar si ya se ha añadido la serie seleccionada

// Funcion para agregar series
const agregarSerieATabla = async (serie) => {
const tablaSeries = document.getElementById("tablaSeries").getElementsByTagName('tbody')[0];
    
    // Verifica si la serie ya está en la lista
    const serieExistente = seriesAgregadas.find(s => s.id === serie.id);
    if (serieExistente) {
        alert('Esta serie ya ha sido agregada.');
        return; // Sale de la función si la serie ya existe en la lista
    }
    
    // Se generan las filas al añadir una serie
    const nuevaFila = tablaSeries.insertRow();

    const celdaTitulo = nuevaFila.insertCell(0);
    celdaTitulo.innerHTML = serie.name;

    const celdaCalificacion = nuevaFila.insertCell(1);
    celdaCalificacion.innerHTML = Math.round(serie.vote_average * 10) / 10;

    const celdaEliminar = nuevaFila.insertCell(2);
    const botonEliminar = document.createElement('button');
    botonEliminar.innerText = 'Eliminar';
    botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
    botonEliminar.addEventListener('click', () => {
        eliminarSerieDeTabla(serie, nuevaFila);
    });
    celdaEliminar.appendChild(botonEliminar);

    // Agrega la serie a la lista de series agregadas
    seriesAgregadas.push(serie);
    
    // Lógica para agregar serie a la base de datos

    try {
        // Envía la serie a la base de datos
        const response = await fetch(`/series`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: serie.name,
                calification: serie.vote_average
              }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar la serie a la base de datos');
        }

        const data = await response.json();
        console.log('Serie agregada a la base de datos:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para eliminar una serie de la tabla
const eliminarSerieDeTabla = async (serie, fila) => {
    const tablaSeries = document.getElementById("tablaSeries").getElementsByTagName('tbody')[0];
    tablaSeries.removeChild(fila);

    // Elimina la serie de la lista de series agregadas
    const index = seriesAgregadas.findIndex(s => s.id === serie.id);
    if (index !== -1) {
        seriesAgregadas.splice(index, 1);
    }

    // Lógica para borrar una serie en la base de datos
    try {
        const response = await fetch(`/series/${serie.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo eliminar la serie');
        }

        console.log('La serie se eliminó correctamente en el servidor');
        // Aquí podrías mostrar un mensaje de éxito o realizar otras acciones necesarias
    } catch (error) {
        console.error('Error al eliminar la serie en el servidor:', error.message);
        // Manejo de errores, como mostrar un mensaje al usuario
    }

};



const KEY = 'b0689ad7c2594580b504c73f430c5992';
let URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${KEY}&language=en-US&page=${pagina}`;

const OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${KEY}`
    }
};

// Función para obtener y visualizar los posters de las series
const mostrarSeries = async function () {
    try {
        const response = await fetch(URL, OPTIONS);

        if (response.status === 200) {
            const DATA = await response.json();

            let series = "";
            DATA.results.forEach(serie => {
               const URLSERIE = `https://api.themoviedb.org/3/tv/${serie.id}`;
               const voteAverageRounded = Math.round(serie.vote_average * 10) / 10;
               // Se genera el HTML para visualizar los posters
               series += `
               <div class="serie">
                    <div class="imagen-container">
                        <div class="position-relative">
                                <img class="imagen" src="https://image.tmdb.org/t/p/w500/${serie.poster_path}">
                            <button class="btn btn-success btn-sm btn-overlay">Agregar a la Lista</button>
                        </div>
                    </div>
                    <div class="info">
                        <h3 class="titulo">${serie.name}</h3>
                        <div class="calificacion-container">
                            <p class="calificacion">${voteAverageRounded}</p>
                        </div>
                    </div>
                </div>` 
            });

            document.getElementById("contenedor").innerHTML = series;

            // Se agrega botón al pasar el cursor por encima de las imágenes
            const seriesElements = document.querySelectorAll('.serie');
            seriesElements.forEach(element => {
                const imgContainer = element.querySelector('.imagen-container');
                const btnOverlay = imgContainer.querySelector('.btn-overlay');

                imgContainer.addEventListener('mouseenter', () => {
                    btnOverlay.style.display = 'block'; // Se muestra al pasar el cursor
                });

                imgContainer.addEventListener('mouseleave', () => {
                    btnOverlay.style.display = 'none';// Se esconde al quitar el cursor
                });
                 // Evento click de botón para agregar la serie a la tabla
                 btnOverlay.addEventListener('click', (event) => {
                    const serieIndex = Array.from(seriesElements).indexOf(element);
                    const selectedSerie = DATA.results[serieIndex]; // Obtiene la serie seleccionada
                    agregarSerieATabla(selectedSerie); // Agrega la serie a la tabla
                });
            });
        }
        
    } catch(error) {
        console.log(error);
    }
}

mostrarSeries();
});
