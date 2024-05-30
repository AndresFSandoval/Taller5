document.addEventListener('DOMContentLoaded', () => {
    const calendarioAnual = document.getElementById('calendario-anual');
    const calendarioMensual = document.getElementById('calendario-mensual');
    const calendarioDiario = document.getElementById('calendario-diario');
    const contenedorFormulario = document.getElementById('contenedor-formulario');
    const formularioEvento = document.getElementById('formulario-evento');
    const botonCancelar = document.getElementById('boton-cancelar');
    const tituloFormulario = formularioEvento.querySelector('h2');
    const entradaTituloEvento = document.getElementById('titulo-evento');
    const entradaFechaEvento = document.getElementById('fecha-evento');
    const entradaHoraEvento = document.getElementById('hora-evento');
    const entradaDescripcionEvento = document.getElementById('descripcion-evento');
    const entradaParticipantesEvento = document.getElementById('participantes-evento');

    let elementoEventoActual = null;
    let eventos = {};

    const cambiarVista = (vista) => {
        document.querySelectorAll('.vista-calendario').forEach(v => v.style.display = 'none');
        document.getElementById(vista).style.display = 'grid';
    };

    const generarColorAleatorio = () => {
        const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const abrirFormularioEvento = (elemento, vista = 'mensual') => {
        elementoEventoActual = elemento;
        entradaFechaEvento.value = vista === 'diario' ? elemento.dataset.fecha : '';
        entradaHoraEvento.value = vista === 'diario' ? elemento.dataset.hora : '';
        const eventoData = eventos[elemento.dataset.fecha]?.[elemento.dataset.hora];
        if (eventoData) {
            tituloFormulario.textContent = 'Modificar Evento';
            entradaTituloEvento.value = eventoData.titulo;
            entradaHoraEvento.value = eventoData.hora;
            entradaDescripcionEvento.value = eventoData.descripcion;
            entradaParticipantesEvento.value = eventoData.participantes;
        } else {
            tituloFormulario.textContent = 'Añadir Evento';
            formularioEvento.reset();
        }
        contenedorFormulario.style.display = 'block';
    };

    const cerrarFormularioEvento = () => {
        contenedorFormulario.style.display = 'none';
        formularioEvento.reset();
        elementoEventoActual = null;
    };

    const guardarEvento = (event) => {
        event.preventDefault();
        const titulo = entradaTituloEvento.value;
        const fecha = entradaFechaEvento.value;
        const hora = entradaHoraEvento.value;
        const descripcion = entradaDescripcionEvento.value;
        const participantes = entradaParticipantesEvento.value;
        const color = generarColorAleatorio();
        const eventoData = { titulo, fecha, hora, descripcion, participantes, color };

        if (!eventos[fecha]) {
            eventos[fecha] = {};
        }
        eventos[fecha][hora] = eventoData;

        if (elementoEventoActual) {
            if (!elementoEventoActual.classList.contains('con-evento')) {
                elementoEventoActual.classList.add('con-evento');
            }
            elementoEventoActual.style.backgroundColor = color;
            elementoEventoActual.textContent = `${hora} - ${titulo}`;
        }

        cerrarFormularioEvento();
    };

    const generarCalendarioAnual = () => {
        for (let mes = 0; mes < 12; mes++) {
            const elementoMes = document.createElement('div');
            elementoMes.classList.add('mes');
            elementoMes.dataset.mes = mes;
            elementoMes.textContent = new Date(2024, mes).toLocaleString('es-ES', { month: 'long' });
            elementoMes.addEventListener('click', () => mostrarCalendarioMensual(mes));
            calendarioAnual.appendChild(elementoMes);
        }
    };

    const mostrarCalendarioMensual = (mes) => {
        calendarioMensual.innerHTML = '';
        const diasEnMes = new Date(2024, mes + 1, 0).getDate();
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const elementoDia = document.createElement('div');
            const fecha = `2024-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            elementoDia.textContent = dia;
            elementoDia.dataset.fecha = fecha;
            if (eventos[fecha]) {
                elementoDia.classList.add('con-evento');
                elementoDia.style.backgroundColor = eventos[fecha][Object.keys(eventos[fecha])[0]].color;
            }
            elementoDia.addEventListener('click', () => abrirFormularioEvento(elementoDia));
            calendarioMensual.appendChild(elementoDia);
        }
        cambiarVista('calendario-mensual');
    };

    const mosCalendarioDiario = (fecha) => {
        calendarioDiario.innerHTML = '';
        const horasDia = [
            "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM",
            "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
            "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
        ];

        for (const hora of horasDia) {
            const HoraElem = document.createElement('div');
            HoraElem.textContent = hora;
            HoraElem.dataset.hora = hora;
            HoraElem.dataset.fecha = fecha;
            const evento = eventos[fecha]?.[hora];
            if (evento) {
                HoraElem.classList.add('con-evento');
                HoraElem.textContent += ` - ${evento.titulo}`;
                HoraElem.style.backgroundColor = evento.color;
            }
            HoraElem.addEventListener('click', () => abrirFormularioEvento(HoraElem, 'diario'));
            calendarioDiario.appendChild(HoraElem);
        }
        cambiarVista('calendario-diario');
    };

    document.getElementById('boton-vista-anual').addEventListener('click', () => cambiarVista('calendario-anual'));
    document.getElementById('boton-vista-mensual').addEventListener('click', () => cambiarVista('calendario-mensual'));
    document.getElementById('boton-vista-diaria').addEventListener('click', () => mosCalendarioDiario(new Date().toISOString().split('T')[0]));

    formularioEvento.addEventListener('submit', guardarEvento);
    botonCancelar.addEventListener('click', cerrarFormularioEvento);

    generarCalendarioAnual();
    cambiarVista('calendario-anual');
});