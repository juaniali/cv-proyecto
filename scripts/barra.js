const productos = document.querySelectorAll('.tarjeta');

productos.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const nombre = tarjeta.getAttribute('data-nombre');
        const cantidad = parseInt(tarjeta.getAttribute('data-cantidad'));
        const precio = parseInt(tarjeta.getAttribute('data-precio'));

        agregarProductoAFactura(nombre, cantidad, precio);
    });
});

function agregarProductoAFactura(nombre, cantidad, precio) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nombre}</td>
        <td>${cantidad}</td>
        <td>$${precio.toFixed(2)}</td>
        <td>$${(cantidad * precio).toFixed(2)}</td>
    `;
    document.querySelector('#factura tbody').appendChild(fila);
    actualizarTotalFactura(cantidad * precio);
}

function actualizarTotalFactura(precioProducto) {
    const totalElemento = document.getElementById('total');
    let total = parseFloat(totalElemento.innerText.replace('$', ''));
    total += precioProducto;
    totalElemento.innerText = `$${total.toFixed(2)}`;
}

function reiniciarFactura() {
    document.querySelector('#factura tbody').innerHTML = '';
    document.getElementById('total').innerText = '$0.00';
}

document.getElementById('reiniciarMesa').addEventListener('click', () => {
    reiniciarFactura();
    mostrarMensaje('Venta Restaurada');
});

document.getElementById('cerrarMesa').addEventListener('click', () => {
  const totalVenta = parseFloat(document.getElementById('total').innerText.replace('$', ''));
  mostrarMensaje('Venta cerrada', `Total de la venta: $${totalVenta.toFixed(2)}`);
  reiniciarFactura();
  capturarVenta(totalVenta); // Llamada a la función para almacenar el total de la venta
});


document.getElementById('cerrarCuadro').addEventListener('click', () => {
    ocultarMensaje();
});

function mostrarMensaje(mensaje, detalle = '') {
    const cuadro = document.getElementById('cuadro');
    cuadro.style.display = 'block';
    document.getElementById('mensaje').innerText = mensaje;
    document.getElementById('totalVenta').innerText = detalle;
    document.getElementById('totalVenta').style.display = detalle ? 'block' : 'none';
}

function ocultarMensaje() {
    document.getElementById('cuadro').style.display = 'none';
}

// Función para capturar y almacenar el total de la venta en la página de barra
function capturarVenta(totalVenta) {
  if (localStorage.getItem('ventaParcialBarra') == null) {
    localStorage.setItem('ventaParcialBarra', totalVenta);
  } else {
    let acumulado = parseInt(localStorage.getItem('ventaParcialBarra'));
    totalVenta += acumulado;
    localStorage.setItem('ventaParcialBarra', totalVenta);
  }
}
function mostrarVentasDelDia() {
  console.log('La función mostrarVentasDelDia se ha llamado correctamente');
  // Resto del código...
}


let productosBusqueda = [];

async function consumirDb(){
  try {
    const db = await fetch('./../db/productos.json');
    const data = await db.json();
    productosBusqueda = data.productos;
  } catch (error) {
    console.error(error);
  }
}

consumirDb();
const buscar = document.querySelector("#buscar-producto");

const contenedorProductos= document.querySelector("#listado-productos");
const fragmento= document.createDocumentFragment();


buscar.addEventListener("keyup", () => {
  const valorBuscado = buscar.value.toLowerCase();
  const resultados =  productosBusqueda.filter( productosBusqueda => productosBusqueda.nombre.toLowerCase().includes(valorBuscado) );
  limpiarProductos();
  mostrarProductos(resultados);
});

function mostrarProductos(productosB){
  
  productosB.forEach( producto =>{
    let li= document.createElement("li");
    li.className= "tarjeta";
    
    let nombre= document.createElement("p");
    nombre.textContent= producto.nombre;
    li.appendChild(nombre);
    
    let precio= document.createElement("p");
    precio.textContent= producto.precio;
    li.appendChild(precio);

    let imagen= document.createElement("img");
    imagen.src= producto.img;
    imagen.className= "imagen-tarjeta";
    li.appendChild(imagen);

    fragmento.appendChild(li);
  });
  contenedorProductos.appendChild(fragmento);
}

function limpiarProductos(){
  while(contenedorProductos.firstChild){
    contenedorProductos.removeChild(contenedorProductos.firstChild);
  }
}