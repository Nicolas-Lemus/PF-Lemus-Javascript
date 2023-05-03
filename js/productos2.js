const calzados = [
    {nombre: "Nike", precio: 4000 , tipo:"Deportivo"},
    {nombre: "Adidas", precio: 3900, tipo:"Deportivo"},
    {nombre: "Under", precio: 5000, tipo:"Deportivo"},
    {nombre: "Puma", precio: 4900, tipo:"Deportivo"},
    {nombre: "New Balance", precio: 5200, tipo:"Deportivo"},

    {nombre: "Botas", precio: 5000, tipo:"Casual"},
    {nombre: "Nauticas", precio: 4900, tipo:"Casual"},
    {nombre: "Sneakers", precio: 6000, tipo:"Casual"},
    {nombre: "Levi’s", precio: 5390, tipo:"Casual"},
    {nombre: "Converse", precio: 5999,  tipo:"Casual"},
    
    {nombre: "Cuero", precio: 7000, tipo:"Formal"},
    {nombre: "Zapatos sin cordones", precio: 5900, tipo:"Formal"},
    {nombre: "Desert", precio: 6900, tipo:"Formal"},
    {nombre: "Oxford", precio: 6199, tipo:"Formal"},
    {nombre: "Gaziano & G", precio: 10000, tipo:"Formal"}
];
let nuevoProducto = new agregarProductos("Reebok", 4500, "Deportivo");
//agregamos la variable a Calzados
calzados.push(nuevoProducto);
//sin stock
calzados.splice(5,1);

function agregarProductos(nombre,precio,tipo){
    this.nombre=nombre;
    this.precio=precio;
    this.tipo=tipo;
}

//filtro de busqueda
const buscador=document.querySelector("#buscar");
buscador.addEventListener("keyup" , e => {
    if(e.target.matches("#buscar")){
        document.querySelectorAll(".card").forEach(calz =>{
            calz.textContent.toLocaleLowerCase().includes(e.target.value)
            ? calz.classList.remove("filtro")
            :calz.classList.add("filtro");
        })
    }
});

//filtrado por precio
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

const inputPrecioMaximo = document.getElementById('precioMaximo');
inputPrecioMaximo.addEventListener('input', function() {
    const precioMaximo = parseInt(this.value);
    filtrarPorPrecio(precioMaximo);
});



//talles

const talles = [40, 41, 42, 43, 44];
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
let cantidadProductos = 0;
let carritoProductos = [];

// Comprobar si hay datos en el Local Storage
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
            <span class="precio" data-id="${producto.id}">Precio: $${producto.precio}</span>
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


function agregarProductoAlCarrito(nombreProducto,precioProducto, talleSeleccionado, imgProducto) {
    // Buscar si el producto ya existe en el carrito 
    const productoExistente = carritoProductos.find(producto => producto.nombre === nombreProducto && producto.talle === talleSeleccionado);
    
    if (productoExistente) {
        // Si el producto ya existe, sumar 1 a la cantidad y actualizar el precio
        productoExistente.cantidad++;
        productoExistente.precio = productoExistente.cantidad * precioProducto;
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
