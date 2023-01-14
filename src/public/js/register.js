const newUser = document.querySelector('#newUser')
newUser.addEventListener('submit', event =>{
    event.preventDefault()
    const user = {
        username: nombre.value,
        email: email.value,
        password: password.value
    }
    const url = './register'
    const configuraciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user, null, 2)
    }
    fetch(url,configuraciones )
    .then(resp => console.log("llegamos"))
    .then(()=> {location.replace('/')})

    
})