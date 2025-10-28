// vlibras-offline.js
(function() {
    'use strict';

    // Configurações do VLibras
    const VLIBRAS_CONFIG = {
        ROOT_PATH: window.location.origin + '/vlibras-assets/',
        DICTIONARY_URL: 'https://dicionario2.vlibras.gov.br/signs?version=2018.3.1',
        REVIEW_URL: 'https://traducao2.vlibras.gov.br/review',
        SIGNS_URL: 'https://dicionario2.vlibras.gov.br/bundles',
        AVATARS: ['icaro', 'hosana', 'guga', 'random']
    };

    // CSS do VLibras
    const VLIBRAS_CSS = `
        [vw] [vw-access-button] {
            display: none;
            flex-direction: row-reverse;
            width: 40px;
            height: 40px;
            cursor: pointer;
            overflow: hidden;
            position: absolute;
            border-radius: 8px;
            transition: all 0.5s ease;
            right: 0;
            left: auto
        }

        [vw] [vw-access-button] img {
            max-height: 40px;
            transition: all 0.5s ease;
            border-radius: 8px;
            opacity: 1 !important;
            visibility: visible !important
        }

        [vw] [vw-access-button] .vp-access-button {
            width: 40px;
            height: 40px;
            z-index: 1
        }

        [vw] [vw-access-button] .vp-pop-up {
            position: absolute;
            height: 40px;
            min-width: 150px;
            z-index: 0;
            left: 0;
            right: auto
        }

        [vw] [vw-access-button]:hover {
            width: 200px
        }

        [vw] [vw-access-button].isLeft {
            flex-direction: row;
            left: 0;
            right: auto
        }

        [vw] [vw-access-button].isLeft .vp-pop-up {
            left: auto;
            right: 0
        }

        [vw] [vw-access-button].isTopOrBottom:hover {
            bottom: -20px;
            top: 0;
            margin-right: -80px
        }

        [vw] [vw-access-button].active {
            display: flex
        }

        [vw].left [vw-plugin-wrapper] {
            float: left
        }

        [vw] [vw-plugin-wrapper] {
            position: relative;
            display: none;
            width: 300px;
            height: 100%;
            float: right;
            background: white;
            -webkit-box-shadow: 0px 0px 15px rgba(0,0,0,0.2);
            -moz-box-shadow: 0px 0px 15px rgba(0,0,0,0.2);
            box-shadow: 0px 0px 15px rgba(0,0,0,0.2);
            border-radius: 12px;
            -moz-border-radius: 12px;
            -webkit-border-radius: 12px
        }

        [vw] [vw-plugin-wrapper].active {
            display: -webkit-flex;
            display: flex;
            flex-direction: column;
            -webkit-flex-direction: column;
            height: 450px;
            max-width: 100%;
            min-height: 100%
        }

        div[vw] {
            position: fixed;
            max-width: 95vw;
            min-height: 40px;
            min-width: 40px;
            z-index: 2147483645 !important;
            display: none;
            margin: 10px !important
        }

        div[vw].enabled {
            display: block
        }

        div[vw].active {
            margin-top: -285px
        }

        div[vw].left {
            left: 0;
            right: initial
        }
    `;

    // HTML do botão de acesso
    const ACCESS_BUTTON_HTML = `
        <img
            class="vp-access-button"
            src="${VLIBRAS_CONFIG.ROOT_PATH}assets/access_icon.svg"
            alt="Conteúdo acessível em Libras usando o VLibras Widget com opções dos Avatares Ícaro, Hosana ou Guga."
        />
        <img
            class="vp-pop-up"
            src="${VLIBRAS_CONFIG.ROOT_PATH}assets/access_popup.jpg"
            alt="Conteúdo acessível em Libras usando o VLibras Widget com opções dos Avatares Ícaro, Hosana ou Guga."
        />
    `;

    // HTML do plugin wrapper
    const PLUGIN_WRAPPER_HTML = `
        <div vp>
            <div vp-box></div>
            <div vp-message-box></div>
            <div vp-settings></div>
            <div vp-dictionary></div>
            <div vp-settings-btn></div>
            <div vp-info-screen></div>
            <div vp-suggestion-screen></div>
            <div vp-translator-screen></div>
            <div vp-more-options-screen></div>
            <div vp-emotions-tooltip></div>
            <div vp-main-guide-screen></div>
            <div vp-suggestion-button></div>
            <div vp-rate-box></div>
            <div vp-change-avatar></div>
            <div vp-aux-controls></div>
            <div vp-controls></div>
            <span vp-click-blocker></span>
        </div>
    `;

    // Funções utilitárias
    const Utils = {
        $: (selector, context = null) => context ? context.querySelector(selector) : document.querySelector(selector),
        $$: (selector, context = null) => context ? context.querySelectorAll(selector) : document.querySelectorAll(selector),
        addClass: (element, className) => element.classList.add(className),
        removeClass: (element, className) => element.classList.remove(className),
        hasClass: (element, className) => element ? element.classList.contains(className) : false,
        toggleClass: (element, className, force) => element.classList.toggle(className, force)
    };

    // Classe principal do VLibras Offline
    class VLibrasOffline {
        constructor(config = {}) {
            this.config = { ...VLIBRAS_CONFIG, ...config };
            this.isLoaded = false;
            this.init();
        }

        init() {
            this.injectCSS();
            this.createWidget();
            this.loadPlugin();
        }

        injectCSS() {
            if (document.getElementById('vlibras-offline-css')) return;

            const style = document.createElement('style');
            style.id = 'vlibras-offline-css';
            style.textContent = VLIBRAS_CSS;
            document.head.appendChild(style);
        }

        createWidget() {
            // Remove widget existente se houver
            const existingWidget = Utils.$('div[vw]');
            if (existingWidget) {
                existingWidget.remove();
            }

            // Cria o widget
            this.widget = document.createElement('div');
            this.widget.setAttribute('vw', '');
            this.widget.className = 'enabled';

            // Botão de acesso
            const accessButton = document.createElement('div');
            accessButton.setAttribute('vw-access-button', '');
            accessButton.className = 'active';
            accessButton.innerHTML = ACCESS_BUTTON_HTML;

            // Plugin wrapper
            const pluginWrapper = document.createElement('div');
            pluginWrapper.setAttribute('vw-plugin-wrapper', '');
            pluginWrapper.innerHTML = PLUGIN_WRAPPER_HTML;

            this.widget.appendChild(accessButton);
            this.widget.appendChild(pluginWrapper);
            document.body.appendChild(this.widget);

            this.accessButton = accessButton;
            this.pluginWrapper = pluginWrapper;
        }

        loadPlugin() {
            try {
                // Simula o carregamento do plugin
                this.setupEventListeners();
                this.isLoaded = true;
                
                console.log('VLibras Offline carregado com sucesso');
                
                // Dispara evento de carregamento
                window.dispatchEvent(new CustomEvent('vlibras:loaded', {
                    detail: { version: 'offline-1.0.0' }
                }));
            } catch (error) {
                console.error('Erro ao carregar VLibras Offline:', error);
                this.fallbackToOnline();
            }
        }

        setupEventListeners() {
            // Evento de clique no botão de acesso
            this.accessButton.addEventListener('click', () => {
                this.toggleWidget();
            });

            // Eventos de teclado para acessibilidade
            this.accessButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleWidget();
                }
            });

            // Fechar widget ao clicar fora
            document.addEventListener('click', (e) => {
                if (!this.widget.contains(e.target) && this.isWidgetOpen()) {
                    this.closeWidget();
                }
            });
        }

        toggleWidget() {
            const isActive = Utils.hasClass(this.pluginWrapper, 'active');
            
            if (isActive) {
                this.closeWidget();
            } else {
                this.openWidget();
            }
        }

        openWidget() {
            Utils.addClass(this.pluginWrapper, 'active');
            Utils.addClass(this.accessButton, 'active');
            
            // Dispara evento de abertura
            window.dispatchEvent(new CustomEvent('vlibras:open'));
        }

        closeWidget() {
            Utils.removeClass(this.pluginWrapper, 'active');
            Utils.removeClass(this.accessButton, 'active');
            
            // Dispara evento de fechamento
            window.dispatchEvent(new CustomEvent('vlibras:close'));
        }

        isWidgetOpen() {
            return Utils.hasClass(this.pluginWrapper, 'active');
        }

        fallbackToOnline() {
            console.log('Tentando carregar VLibras online...');
            
            const onlineScript = document.createElement('script');
            onlineScript.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
            onlineScript.onload = () => {
                if (window.VLibras) {
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                    // Remove o widget offline
                    this.destroy();
                }
            };
            
            document.head.appendChild(onlineScript);
        }

        destroy() {
            if (this.widget && this.widget.parentNode) {
                this.widget.parentNode.removeChild(this.widget);
            }
            
            const css = document.getElementById('vlibras-offline-css');
            if (css) {
                css.remove();
            }
            
            this.isLoaded = false;
        }

        // Métodos públicos
        show() {
            Utils.addClass(this.widget, 'enabled');
        }

        hide() {
            Utils.removeClass(this.widget, 'enabled');
        }

        setPosition(position) {
            const validPositions = ['TL', 'T', 'TR', 'L', 'R', 'BL', 'B', 'BR'];
            if (validPositions.includes(position)) {
                this.widget.style.left = position.includes('L') ? '0' : ['T', 'B'].includes(position) ? '50%' : 'initial';
                this.widget.style.right = position.includes('R') ? '0' : 'initial';
                this.widget.style.top = position.includes('T') ? '0' : ['L', 'R'].includes(position) ? '50%' : 'initial';
                this.widget.style.bottom = position.includes('B') ? '0' : 'initial';
                this.widget.style.transform = ['L', 'R'].includes(position) ? 'translateY(calc(-50% - 10px))' : ['T', 'B'].includes(position) ? 'translateX(calc(-50% - 10px))' : 'initial';
            }
        }

        setOpacity(opacity) {
            if (opacity >= 0 && opacity <= 1) {
                this.pluginWrapper.style.background = `rgba(235,235,235, ${opacity})`;
            }
        }
    }

    // Expor para o escopo global
    window.VLibrasOffline = VLibrasOffline;

    // Auto-inicialização quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.vlibrasOffline = new VLibrasOffline();
        });
    } else {
        window.vlibrasOffline = new VLibrasOffline();
    }

})();