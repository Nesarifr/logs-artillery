
Swal.fire({
        title: 'Loguearse con email:',
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
        <a href="/api/login/register" style="color:#f1f1f1">No poseo cuenta, registrarme</a>`,
        confirmButtonText: 'Iniciar',
        focusConfirm: false,
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#email').value;
            const password = Swal.getPopup().querySelector('#password').value;
            if ( !email || !password ) {
                Swal.showValidationMessage(`Por favor complete el formulario`);
            }
            return { email, password }
        },
        allowOutsideClick: false
    }).then((result) => {
        let user = result.value;
        let configuracion = {
            method: 'POST',
            body: JSON.stringify ({
                email: user.email,
                password: user.password
            }, null, 2),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(configuracion);
        return fetch(`./login/user`,configuracion).then(response=>response.JSON)
        .then(data=>console.log(data))
        .then(()=> {location.replace('/')})
        })
        // 
    ;
