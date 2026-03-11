window.addEventListener('load', () => {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    const templateImg = document.getElementById('elfo-template');
    const colorBoxes = document.querySelectorAll('.color-box');
    const clearBtn = document.getElementById('clearBtn');

    // Ajustar el tamaño real del canvas al tamaño de la imagen
    function resizeCanvas() {
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 15; // Grosor del pincel (puedes cambiarlo)
    }

    // Esperar a que la imagen cargue para saber su tamaño
    if (templateImg.complete) {
        resizeCanvas();
    } else {
        templateImg.addEventListener('load', resizeCanvas);
    }
    window.addEventListener('resize', resizeCanvas); // Por si cambia el tamaño de ventana

    let isPainting = false;
    let selectedColor = '#A6242F'; // Color por defecto

    // Función para empezar a pintar
    function startPosition(e) {
        isPainting = true;
        paint(e); // Para pintar incluso si solo haces un clic
    }

    // Función para parar de pintar
    function finishedPosition() {
        isPainting = false;
        ctx.beginPath(); // Resetea el trazo para no unir líneas
    }

    // Función principal de pintura
    function paint(e) {
        if (!isPainting) return;

        // Obtener coordenadas correctas dentro del canvas
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        // Soporte para táctil y ratón
        if(e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.strokeStyle = selectedColor;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Eventos de Ratón
    canvas.addEventListener('mousedown', startPosition);
    window.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', paint);

    // Eventos Táctiles (para móviles/tablets)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evita scroll al pintar
        startPosition(e);
    });
    window.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        paint(e);
    });

    // Selección de color en la paleta
    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Quitar clase activa del anterior
            document.querySelector('.color-box.active').classList.remove('active');
            // Añadir clase activa al pulsado
            box.classList.add('active');
            // Cambiar color del pincel
            selectedColor = box.dataset.color;
        });
    });

    // Botón borrar
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});
