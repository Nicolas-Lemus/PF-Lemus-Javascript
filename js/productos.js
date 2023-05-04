//convertimos OBJETO calzados en archivo data.json 
// ../data/data.json
//filtrado por precio
const inputPrecioMaximo = document.getElementById('precioMaximo');
inputPrecioMaximo.addEventListener('input', function() {
    const precioMaximo = parseInt(this.value);
    filtrarPorPrecio(precioMaximo);
});
//mostramos card de precios
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
//async
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

if (localStorage.getItem('carritoProductos')){
    carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    cantidadProductos = parseInt(localStorage.getItem('cantidadProductos'));
    actualizarCarrito();
    actualizarPrecioTotal();
}

function guardarProductosEnLocalStorage() {
    localStorage.setItem('carritoProductos',JSON.stringify(carritoProductos));
    localStorage.setItem('cantidadProductos', cantidadProductos);
} 


function actualizarCarrito() {
    carrito.innerHTML = '';
    let cantidadTotalProductos = 0;
    carritoProductos.forEach((producto, index) => {
        cantidadTotalProductos += producto.cantidad;
        const li = document.createElement('li');
        li.classList.add('producto-carrito');
        li.innerHTML = `
            <span class="cantidad">${producto.cantidad}</span>
            <img src="${producto.img}"class="imgCarrito">
            <span class="nombre">${producto.nombre}</span>
            <span class="talle">Talle ${producto.talle}</span>
            <span class="precio" data-id="${producto.id}">${producto.precio}</span>
            <button class="eliminar-producto" data-index="${index}">X</button>
        `;
        carrito.appendChild(li);
    });
    contadorCarrito.textContent = cantidadTotalProductos;
}


productosTalles.forEach((producto) => {
    const nombreProducto = producto.querySelector('.card-title').textContent;
    const precioProducto = parseFloat(producto.querySelector('.card-text').textContent.replace('Precio: $',''));
    const botonesTalles = producto.querySelectorAll('.btn-outline-secondary');
    const imgProducto = producto.querySelector(".card-img-top").src;

    let talleSeleccionado;
    

    botonesTalles.forEach(botonTalle => {
        botonTalle.addEventListener('click', () => {
            botonesTalles.forEach(boton => {
                boton.classList.remove('seleccionado');
            });
            botonTalle.classList.add('seleccionado');
            talleSeleccionado = botonTalle.textContent;
        });
    });

    const botonTarjeta = producto.querySelector('.btn-primary');
    botonTarjeta.addEventListener('click', () => {
        if (!talleSeleccionado) {
            Swal.fire({
                title: 'Ingrese Talle',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            return;
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto Agregado',
            showConfirmButton: false,
            timer: 1000
        })
        agregarProductoAlCarrito(nombreProducto, precioProducto, talleSeleccionado, imgProducto)
        guardarProductosEnLocalStorage();
        actualizarCarrito();
        actualizarPrecioTotal();
        talleSeleccionado = null;
        botonesTalles.forEach(boton => {
            boton.classList.remove('seleccionado');
        });
        cantidadProductos++;
        contadorCarrito.textContent = cantidadProductos;
    });
})

function agregarProductoAlCarrito(nombreProducto,precioProducto, talleSeleccionado, imgProducto) {
    // Buscar si el producto ya existe en el carrito 
    const productoExistente = carritoProductos.find(producto => producto.nombre === nombreProducto && producto.talle === talleSeleccionado);
    
    if (productoExistente) {
        // Si el producto ya existe, sumar 1 a la cantidad y actualizar el precio
        productoExistente.cantidad++;
        productoExistente.precio = productoExistente.cantidad * parseFloat(precioProducto);
    } else {
        // Si el producto no existe, agregarlo al carrito
        carritoProductos.push({
            nombre: nombreProducto,
            precio:parseFloat(precioProducto),
            talle: talleSeleccionado,
            img: imgProducto,
            cantidad: 1
        });
    }
    actualizarCarrito();
    actualizarPrecioTotal();
    guardarProductosEnLocalStorage();
}

function actualizarPrecioTotal() {
    let precioTotalCarrito = 0;
    const preciosProductos = document.querySelectorAll('.precio');
    preciosProductos.forEach(precioProducto => {
        const precioProductoNumerico = parseFloat(precioProducto.textContent.replace('Precio: $', ''));
        if (!isNaN(precioProductoNumerico)) {
            precioTotalCarrito += precioProductoNumerico;
        }
    });
    precioTotal.textContent  = `$${precioTotalCarrito.toFixed(2)}`;
}