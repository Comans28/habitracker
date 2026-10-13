document.getElementById('form-habito').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    const nombre = document.getElementById('habito-nombre').value.trim();
    if (!nombre) return alert("El nombre no puede estar vacío");

    const nuevoHabito = {
        id: Date.now().toString(), // Usamos la fecha en milisegundos como ID único
        nombre: nombre,
        descripcion: document.getElementById('habito-desc').value,
        categoria: document.getElementById('habito-cat').value
    };

    habitos.push(nuevoHabito); // Añadimos el hábito al array
    guardarTodo(); // Guardamos los arrays actualizados en las cookies
    
    // Si la función de actualizar el desplegable ya existe (Fase 3), la llamamos
    if(typeof actualizarDesplegable === 'function') actualizarDesplegable(); 
    
    this.reset(); // Limpia los campos del formulario
    alert("Hábito creado correctamente");
});