/* catalogos.js — Toggle y limpieza de catálogos (fallas, equipos, responsables) */

function toggleArea(id) {
    const el   = document.getElementById(id);
    const chev = document.getElementById('chev-' + id);
    const c    = el.classList.toggle('collapsed');
    chev.style.transform = c ? 'rotate(-90deg)' : 'rotate(0deg)';
    localStorage.setItem('cat-' + id, c ? '1' : '0');
}

document.querySelectorAll('.area-content').forEach(el => {
    if (localStorage.getItem('cat-' + el.id) === '1') {
        el.classList.add('collapsed');
        const chev = document.getElementById('chev-' + el.id);
        if (chev) chev.style.transform = 'rotate(-90deg)';
    }
});

function confirmarLimpiar(areaId, areaNombre, tipo) {
    document.getElementById('modal-limpiar-msg').textContent =
        `¿Eliminar todos los ${tipo} del área "${areaNombre}"?`;
    document.getElementById('form-limpiar').action = `/catalogos/${tipo}/limpiar/${areaId}/`;
    document.getElementById('modal-limpiar').style.display = 'flex';
}

document.getElementById('modal-limpiar').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

function filtrarCatalogo(areaId, q, singular, plural) {
    q = q.toLowerCase().trim();
    const tbody = document.getElementById('tbody-' + areaId);
    const nores = document.getElementById('nores-' + areaId);
    const cnt   = document.getElementById('cnt-' + areaId);
    const rows  = tbody.querySelectorAll('tr');
    let count = 0;
    rows.forEach(r => {
        const match = !q || r.dataset.busqueda.includes(q);
        r.style.display = match ? '' : 'none';
        if (match) count++;
    });
    nores.style.display = (count === 0 && q) ? '' : 'none';
    cnt.textContent = count + ' ' + (count !== 1 ? plural : singular);
}

function filtrarFallas(areaId, q)       { filtrarCatalogo(areaId, q, 'falla', 'fallas'); }
function filtrarEquipos(areaId, q)      { filtrarCatalogo(areaId, q, 'equipo', 'equipos'); }
function filtrarResponsables(areaId, q) { filtrarCatalogo(areaId, q, 'responsable', 'responsables'); }


function abrirModalAgregar(areaId, areaNombre, url) {
    document.getElementById('modal-agregar-titulo').textContent = 'Agregar — ' + areaNombre;
    document.getElementById('form-agregar').action = url;

    const campoCodigoEl = document.getElementById('agregar-codigo');
    campoCodigoEl.value = '';
    campoCodigoEl.placeholder = 'Cargando…';

    const nombre = document.getElementById('agregar-nombre');
    if (nombre) nombre.value = '';

    const origen = document.getElementById('agregar-area-origen');
    if (origen && origen.tagName === 'SELECT') {
        origen.innerHTML = '<option value="">— Selecciona responsable —</option>';
        fetch('/responsables/buscar/?area_id=' + areaId)
            .then(r => r.json())
            .then(data => {
                data.forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.responsable;
                    opt.textContent = r.responsable;
                    origen.appendChild(opt);
                });
                if (data.length === 0) {
                    origen.innerHTML = '<option value="">— Sin responsables registrados —</option>';
                }
            })
            .catch(() => {
                origen.innerHTML = '<option value="">— Error al cargar —</option>';
            });
    } else if (origen) {
        origen.value = '';
    }

    const tipo = url.includes('/fallas/') ? 'fallas' :
                 url.includes('/equipos/') ? 'equipos' : 'responsables';
    fetch('/' + tipo + '/siguiente-codigo/?area_id=' + areaId)
        .then(r => r.json())
        .then(data => {
            campoCodigoEl.value = data.codigo || '';
            campoCodigoEl.placeholder = 'ej. código';
        })
        .catch(() => {
            campoCodigoEl.placeholder = 'ej. código';
        });

    document.getElementById('modal-agregar').style.display = 'flex';
}

const modalAgregar = document.getElementById('modal-agregar');
if (modalAgregar) {
    modalAgregar.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
}

function validarCampo(input) {
    const val = input.value.trim();
    if (val) {
        input.style.borderColor = '#10B981';
        input.style.background  = 'var(--white)';
        input.style.boxShadow   = '0 0 0 3px rgba(16,185,129,.08)';
    } else {
        input.style.borderColor = '#EF4444';
        input.style.background  = 'var(--white)';
        input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.08)';
    }
}

function resetCampo(input) {
    input.style.borderColor = '';
    input.style.background  = '';
    input.style.boxShadow   = '';
}

document.getElementById('form-agregar').addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT') validarCampo(e.target);
});

document.getElementById('form-agregar').addEventListener('submit', function(e) {
    const inputs = this.querySelectorAll('input[required]');
    let valido = true;
    inputs.forEach(inp => {
        validarCampo(inp);
        if (!inp.value.trim()) valido = false;
    });
    if (!valido) e.preventDefault();
});

const formAgregar = document.getElementById('form-agregar');
if (formAgregar) {
    const observer = new MutationObserver(() => {
        formAgregar.querySelectorAll('input').forEach(resetCampo);
    });
    const modalAg = document.getElementById('modal-agregar');
    if (modalAg) observer.observe(modalAg, { attributes: true, attributeFilter: ['style'] });
}