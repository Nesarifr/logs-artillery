const administradores = document.querySelector('.administrador')
const contenedorPrincipal = document.querySelector('.contenedor-varios')


administradores.addEventListener('click', (e)=>{
    e.preventDefault()
    Swal.fire({
        title:"¿Es Administrador?",
        icon: 'info',
        html:"no mienta por favoh ",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> si, soy',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i> ups, nop',
    }).then(respuesta=>{
        user = respuesta.value;
        if(user){
            autorizacionAdminitrador = user
            serAdministrador()
        }
    });
})

/* ---------------------------- carga de paginas ---------------------------- */
function serAdministrador() {
    fetch('../views/partials/administrador.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{
        derivarPaginaAdministrador()
        })
}


function cargaDeProductos() {
    fetch('../views/partials/cargaProductos.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{enviarProducto()})
    
};

function paginaBuscarProducto() {
    fetch('../views/partials/buscarProducto.hbs',
    {   method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{
        searchProduct()
        })
    
}

function mostrarError(error){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        
    })
}

function paginaModifProducto(){
    fetch('../views/partials/modifProducto.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{modifProducto()})
    
}

function paginaDeleteProductos(){
    fetch('../views/partials/paginaDelete.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{deleteProduct()})
    
}

/* -------------------------------- acciones productos -------------------------------- */
let enviarProducto = ()=> {
    const newProduct = document.querySelector('#newProduct')
    newProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const product = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            codigo: codigo.value,
            foto: foto.value,
            precio: precio.value,
            stock: stock.value,
            timestamp: new Date().toLocaleString()
        }

        const url = './productos'
        const configuraciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            },
            body: JSON.stringify(product)
        }
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            if(data.error){
                mostrarError(data.descripcion)
            };
        })
        newProduct.reset()
    })
}

let searchProduct= ()=>{
    const formSearchProduct=document.querySelector('#searchProduct')
    
    formSearchProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const id = document.querySelector('#id')

        const url = `./api/productos/${id.value}`
        const configuraciones = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            }
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(res => res.json())
        .then(data=> {
            const newProducto=data[0]
            if(data.error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                    
                })
            } else{
            const htmlProductos = 
            `<div class="card-productos">
                <div class="imagen">
                    <img src=${newProducto.thumbnail} alt="">
                </div>
                <h2>${newProducto.title}</h2>
                <p> <small>id: ${newProducto.id} </small></p>
                <div class="comprar">
                    <p>$ ${newProducto.price}</p>
                    <a href="/"><button>Volver atras</button></a>
                </div>
            </div>`
            contenedorPrincipal.innerHTML+= htmlProductos
        }
        })
        formSearchProduct.reset()
    })
}

let modifProducto= ()=>{
    const modifProduct=document.querySelector('#modifProduct')
    modifProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const url = `./api/productos/${id.value}`
        const product = {
            title: nombre.value,
            price: precio.value,
            thumbnail: foto.value,
        }
        const configuraciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            },
            body: JSON.stringify(product)
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            if(data.error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                    
                })
            } else {
            const htmlProductos = 
            `<div class="card-productos">
                <div class="imagen">
                    <img src=${data.thumbnail} alt="">
                </div>
                <h2>${data.title}</h2>
                <p> <small>id: ${data.id} </small></p>
                <div class="comprar">
                    <p>$ ${data.price}</p>
                    <a href="/"><button>Volver atras</button></a>
                </div>
            </div>`
            contenedorPrincipal.innerHTML+= htmlProductos
        }
        })
        modifProduct.reset()
    })

}

let deleteProduct=()=>{
    const formDeleteProduct=document.querySelector('#deleteProduct')
    formDeleteProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const url = `./api/productos/${id.value}`
        const configuraciones = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': true
            }
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.error,
                
            })
        })
        formDeleteProduct.reset()
    })
}

let derivarPaginaAdministrador = () =>{
    const buscarProducto = document.querySelector('.buscarProduct')
    const modificarProducto = document.querySelector('.modificarProducto')
    const borrarProduct = document.querySelector('.borrarProduct')

    buscarProducto.addEventListener('click', event =>{
        event.preventDefault()
        paginaBuscarProducto()
    })

    modificarProducto.addEventListener('click',(event)=>{
        event.preventDefault()
        paginaModifProducto()
    })

    borrarProduct.addEventListener('click',(event)=>{
        event.preventDefault()
        paginaDeleteProductos()})
}
