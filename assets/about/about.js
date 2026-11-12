/* LT STUDIO DESIGN - panel About / Contact
   Para cambiar los textos, editá solo el bloque CONTENT de abajo. */
(function () {
    'use strict';

    var CONTENT =
        '<div class="ltsd-about">' +
            '<h2 id="ltsd-about-title">About</h2>' +
            '<p>LT Studio Design is an architectural lighting and visualization studio based in Buenos Aires, Argentina. ' +
            'We create bespoke illumination concepts and hyper-realistic imagery for high-end residences, hotels and urban towers around the world.</p>' +
            '<p>Light is how we define architecture. Our work is nocturnal, cinematic and deliberately dramatic &mdash; ' +
            'every project is lit, composed and rendered in-house, from the first concept image to the final walkthrough film.</p>' +
            '<p>Founded by Luciano Troviano, the studio works directly with architects, developers and private clients ' +
            'who need to see &mdash; and sell &mdash; a space before it exists.</p>' +

            '<h3>Services</h3>' +
            '<ul>' +
                '<li>Architectural lighting design</li>' +
                '<li>Photorealistic 3D rendering</li>' +
                '<li>Cinematic walkthrough films</li>' +
                '<li>Virtual tours</li>' +
            '</ul>' +

            '<h3>Contact</h3>' +
            '<ul>' +
                '<li><span>Projects</span><a href="mailto:info@ltstudiodesign.com">info@ltstudiodesign.com</a></li>' +
                '<li><span>Collaborations</span><a href="mailto:jobs@ltstudiodesign.com">jobs@ltstudiodesign.com</a></li>' +
                '<li><span>Instagram</span><a href="https://www.instagram.com/ltstudiodesign/" target="_blank" rel="noopener">@ltstudiodesign</a></li>' +
                '<li><span>Based in</span>Buenos Aires, Argentina</li>' +
            '</ul>' +
        '</div>';

    var overlay = null;
    var closeBtn = null;
    var lastFocus = null;

    function build() {
        overlay = document.createElement('div');
        overlay.className = 'ltsd-about-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'ltsd-about-title');
        overlay.innerHTML = CONTENT;

        closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ltsd-about__close';
        closeBtn.setAttribute('aria-label', 'Close About');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', close);
        overlay.appendChild(closeBtn);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) { close(); }
        });
        document.body.appendChild(overlay);
    }

    function open() {
        if (!overlay) { build(); }
        lastFocus = document.activeElement;
        // Un frame después para que la transición de opacidad se vea
        window.requestAnimationFrame(function () {
            overlay.classList.add('is-open');
            closeBtn.focus();
        });
    }

    function close() {
        if (!overlay) { return; }
        overlay.classList.remove('is-open');
        if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }

    function isOpen() {
        return overlay && overlay.classList.contains('is-open');
    }

    // Captura el clic en "About" antes de que lo procese el menú original
    document.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('a.about') : null;
        if (!link) { return; }
        e.preventDefault();
        e.stopImmediatePropagation();
        open();
    }, true);

    document.addEventListener('keydown', function (e) {
        if (!isOpen()) { return; }
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Tab') {
            // Mantiene el foco dentro del panel
            var focusables = overlay.querySelectorAll('a[href], button');
            if (!focusables.length) { return; }
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
})();
