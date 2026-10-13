let habitos = leerCookie('habitos') || [];
let registros = leerCookie('registros') || [];

function guardarCookie(nombre, datos) {
    const jsonStr = encodeURIComponent(JSON.stringify(datos));
    document.cookie = `${nombre}=${jsonStr}; max-age=31536000; path=/`;
}

function leerCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch (error) {
                return [];
            }
        }
    }
    return [];
}

function guardarTodo() {
    guardarCookie('habitos', habitos);
    guardarCookie('registros', registros);
}