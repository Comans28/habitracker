// --- FASE 1: PERSISTENCIA ---
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

// --- FASE 2: CREAR HÁBITOS ---
document.getElementById('form-habito').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('habito-nombre').value.trim();
    if (!nombre) return alert("El nombre no puede estar vacío");

    const nuevoHabito = {
        id: Date.now().toString(),
        nombre: nombre,
        descripcion: document.getElementById('habito-desc').value,
        categoria: document.getElementById('habito-cat').value
    };

    habitos.push(nuevoHabito);
    guardarTodo();
    
    actualizarDesplegable(); 
    actualizarEstadisticas();
    
    this.reset();
    alert("Hábito creado correctamente");
});

// --- FASE 3: REGISTRAR DÍAS ---
function actualizarDesplegable() {
    const select = document.getElementById('reg-habitoId');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona un hábito...</option>';
    
    habitos.forEach(h => {
        const option = document.createElement('option');
        option.value = h.id;
        option.textContent = h.nombre;
        select.appendChild(option);
    });
}

document.getElementById('form-registro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const habitoId = document.getElementById('reg-habitoId').value;
    const fecha = document.getElementById('reg-fecha').value;

    if (!habitoId || !fecha) return alert("Falta seleccionar el hábito o la fecha");

    const nuevoRegistro = {
        id: Date.now().toString(),
        habitoId: habitoId,
        fecha: fecha,
        observaciones: document.getElementById('reg-obs').value,
        cumplido: document.getElementById('reg-cumplido').checked
    };

    registros.push(nuevoRegistro);
    guardarTodo();
    
    renderizarTabla();
    actualizarEstadisticas();
    
    this.reset();
    alert("Registro guardado correctamente");
});

// --- FASE 4: MENÚ Y MODAL ---
const modal = document.getElementById('mi-modal');

document.getElementById('link-seguimiento').addEventListener('click', function(e) {
    e.preventDefault();
    renderizarTabla();
    modal.classList.remove('oculto');
});

document.querySelector('.cerrar').addEventListener('click', function() {
    modal.classList.add('oculto');
});

modal.addEventListener('click', function(e) {
    if (e.target === this) {
        modal.classList.add('oculto');
    }
});

// --- FASE 5: RENDERIZAR TABLA Y CAMBIAR ESTADO ---
function renderizarTabla() {
    const tbody = document.querySelector('#tabla-registros tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    registros.forEach(reg => {
        const habitoVinculado = habitos.find(h => h.id === reg.habitoId);
        const nombreHabito = habitoVinculado ? habitoVinculado.nombre : 'Desconocido';
        
        const estadoTexto = reg.cumplido ? '✓ Cumplido' : '✗ Fallado';
        const colorTexto = reg.cumplido ? 'green' : 'red';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nombreHabito}</td>
            <td>${reg.fecha}</td>
            <td>${reg.observaciones}</td>
            <td style="color: ${colorTexto}; font-weight: bold;">${estadoTexto}</td>
            <td><button onclick="toggleCumplido('${reg.id}')">Cambiar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

window.toggleCumplido = function(id) {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        registro.cumplido = !registro.cumplido; 
        guardarTodo(); 
        renderizarTabla(); 
        actualizarEstadisticas();
    }
};

// --- FASE 6: ESTADÍSTICAS Y BORRADO ---
function actualizarEstadisticas() {
    const statHabitos = document.getElementById('stat-habitos');
    if(statHabitos) statHabitos.textContent = habitos.length;
    
    const cumplidos = registros.filter(r => r.cumplido).length;
    const fallados = registros.length - cumplidos;
    
    const statCumplidos = document.getElementById('stat-cumplidos');
    const statFallados = document.getElementById('stat-fallados');
    
    if(statCumplidos) statCumplidos.textContent = cumplidos;
    if(statFallados) statFallados.textContent = fallados;
}

document.getElementById('btn-borrar').addEventListener('click', function() {
    if (confirm("¿Seguro que quieres borrar TODOS los datos? Esto no se puede deshacer.")) {
        habitos = [];
        registros = [];
        
        document.cookie = "habitos=; max-age=0; path=/";
        document.cookie = "registros=; max-age=0; path=/";
        
        actualizarDesplegable();
        renderizarTabla();
        actualizarEstadisticas();
    }
});

// --- INICIALIZACIÓN ---
// Llamadas al cargar la página para que la interfaz muestre los datos guardados
actualizarDesplegable();
actualizarEstadisticas();