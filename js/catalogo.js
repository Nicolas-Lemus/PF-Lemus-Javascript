//mensaje de aviso de registro

Swal.fire({
    title: 'Iniciar Seccion' + ' o ' + ' Registrar para Comprar' ,
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    }
});

//convertimos OBJETO calzados en archivo data.json 

// ../data/data.json

//filtrado por precio
const inputPrecioMaximo = document.getElementById('precioMaximo');
inputPrecioMaximo.addEventListener('input', function() {
    const precioMaximo = parseInt(this.value);
    filtrarPorPrecio(precioMaximo);
});

const productos = document.querySelectorAll('.card');
function filtrarPorPrecio(precioMaximo) {
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const precio = parseInt(producto.querySelector('p').textContent.split('$')[1]);
        if (precio > precioMaximo) {
            producto.classList.add('filtro');
        } else {
            producto.classList.remove('filtro');
        }
    }
}
//talles
const talles = [40, 41, 42, 43, 44];
//querySelectors
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
let cantidadProductos = 0;
let carritoProductos = [];

//ASYNC
const getCalzados = async () => {
    const response = await fetch("../data/dataCalzados.json");
    const calzados = await response.json();

//filtro de tipo
    const buscadorTipo = document.querySelector("#buscarTipo");
    let tipoBuscado = "";
    buscadorTipo.addEventListener("keyup", e => {
        if (e.target.matches("#buscarTipo")) {
            tipoBuscado = e.target.value.toLowerCase();
            for (const calz of calzados) {
                if (calz.tipo.toLowerCase().includes(tipoBuscado)) {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                    elemento.classList.remove("filtro");
                    }
                } else {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.add("filtro");
                    }
                }
            }
        }
    });

//filtro de nombre
    const buscadorNombre = document.querySelector("#buscar");
    buscadorNombre.addEventListener("keyup", e => {
        if (e.target.matches("#buscar")) {
            const nombreBuscado = e.target.value.toLowerCase();
            for (const calz of calzados) {
                if (calz.nombre.toLowerCase().includes(nombreBuscado)) {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.remove("filtro");
                    }
                }else {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.add("filtro");
                    }
                }
            }
        }
    });
};
//llamamos a la promesa
getCalzados();

//ZOOM IMAGENES
const imagenesProducto = document.querySelectorAll('.card-img-top');
imagenesProducto.forEach((imagen) => {
    imagen.addEventListener('click', () => {
    const imageUrl = imagen.src;
        Swal.fire({
            title: imagen.alt,
            imageUrl: imageUrl,
            imageWidth: 800,
            imageHeight: 400,
            imageAlt: 'Imagen de producto ampliada',
        });
    });
});