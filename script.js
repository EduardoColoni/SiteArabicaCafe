// ============================================
// VALIDAÇÕES E UTILITÁRIOS
// ============================================

// Função auxiliar para aplicar as cores verde/vermelho automaticamente
function gerenciarEstadoValidacao(inputElement, isValid) {
    if (inputElement.value.trim().length === 0) {
        // Se o campo estiver vazio, remove as cores (volta ao normal)
        inputElement.classList.remove('is-invalid', 'is-valid');
        return;
    }
    if (isValid) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid'); // Verde
    } else {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid'); // Vermelho
    }
}

// Verifica se tem 2 ou mais letras
function validarNomeTempoReal() {
    const input = document.getElementById('nome');
    gerenciarEstadoValidacao(input, input.value.trim().length >= 2);
}

// Verifica se tem 2 ou mais letras
function validarSobrenomeTempoReal() {
    const input = document.getElementById('sobrenome');
    gerenciarEstadoValidacao(input, input.value.trim().length >= 2);
}

// Usa a regra Regex de email (exige texto + @ + texto + . + texto)
function validarEmailTempoReal() {
    const input = document.getElementById('email');
    gerenciarEstadoValidacao(input, validarEmail(input.value.trim()));
}

// Verifica se digitou todos os 10 (fixo) ou 11 (celular) números
function validarTelefoneTempoReal() {
    const input = document.getElementById('telefone');
    const digits = input.value.replace(/\D/g, '');
    gerenciarEstadoValidacao(input, digits.length >= 10 && digits.length <= 11);
}

function validarCPF(cpf) {
    let digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    let allEqual = true;
    for (let j = 1; j < 11; j++) {
        if (digits[j] !== digits[0]) {
            allEqual = false;
            break;
        }
    }
    if (allEqual) return false;

    // Cálculo dos dígitos verificadores
    let sum1 = 0;
    for (let j = 0; j < 9; j++) {
        sum1 += (digits.charCodeAt(j) - 48) * (j + 1);
    }

    let b1 = sum1 % 11;
    if (b1 === 10) b1 = 0;

    let sum2 = 0;
    for (let j = 0; j < 9; j++) {
        sum2 += (digits.charCodeAt(j) - 48) * (9 - j);
    }

    let b2 = sum2 % 11;
    if (b2 === 10) b2 = 0;

    let d10 = digits.charCodeAt(9) - 48;
    let d11 = digits.charCodeAt(10) - 48;

    return (b1 === d10 && b2 === d11);
}

function validarRequisitosSenh() {
    const senhaInput = document.getElementById('senha');
    const senha = senhaInput.value;

    const requisitos = {
        'req-length': senha.length >= 8,
        'req-uppercase': /[A-Z]/.test(senha),
        'req-number': /[0-9]/.test(senha),
        'req-special': /[!@#$%^&*]/.test(senha)
    };

    for (const [id, isValid] of Object.entries(requisitos)) {
        const elemento = document.getElementById(id);
        const icon = elemento.querySelector('i');
        
        if (isValid) {
            elemento.classList.add('valid');
            elemento.classList.remove('invalid');
            icon.classList.remove('fa-times', 'text-danger');
            icon.classList.add('fa-check', 'text-success');
            icon.style.color = ''; // Limpa o estilo direto para deixar o CSS agir
        } else {
            elemento.classList.add('invalid');
            elemento.classList.remove('valid');
            icon.classList.remove('fa-check', 'text-success');
            icon.classList.add('fa-times', 'text-danger');
            icon.style.color = '';
        }
    }

    const todosAtendidos = Object.values(requisitos).every(req => req === true);
    
    gerenciarEstadoValidacao(senhaInput, todosAtendidos);

    return todosAtendidos;
}

function validarCPFEmTempoReal() {
    const cpfInput = document.getElementById('cpf');
    const cpfFeedback = document.getElementById('cpfFeedback');
    const cpf = cpfInput.value;

    if (cpf.length === 0) {
        cpfFeedback.innerHTML = '';
        cpfInput.classList.remove('is-invalid', 'is-valid');
        return;
    }

    if (validarCPF(cpf)) {
        cpfFeedback.innerHTML = '<i class="fas fa-check-circle text-success"></i> CPF válido';
        cpfFeedback.style.color = '#28a745';
        cpfInput.classList.remove('is-invalid');
        cpfInput.classList.add('is-valid');
    } else {
        cpfFeedback.innerHTML = '<i class="fas fa-times-circle text-danger"></i> CPF inválido';
        cpfFeedback.style.color = '#dc3545';
        cpfInput.classList.remove('is-valid');
        cpfInput.classList.add('is-invalid');
    }
}

// ============================================
// MÁSCARAS DE FORMATAÇÃO
// ============================================

function formatarTelefone(telefone) {
    let digits = telefone.replace(/\D/g, '');
    digits = digits.substring(0, 11);
    
    // Formato: (XX) XXXXX-XXXX
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
}

function formatarCPF(cpf) {
    let digits = cpf.replace(/\D/g, '');
    digits = digits.substring(0, 11);
    
    // Formato: XXX.XXX.XXX-XX
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.substring(0, 3)}.${digits.substring(3)}`;
    if (digits.length <= 9) return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}`;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ============================================
// LÓGICA DE NEGÓCIO
// ============================================

function validarFormularioInscricao(event) {
    event.preventDefault();
    
    const form = document.getElementById('inscricaoForm');
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value;
    
    let isValid = true;
    
    if (!nome) {
        document.getElementById('nome').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('nome').classList.remove('is-invalid');
    }
    
    if (!sobrenome) {
        document.getElementById('sobrenome').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('sobrenome').classList.remove('is-invalid');
    }
    
    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
        document.getElementById('telefone').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('telefone').classList.remove('is-invalid');
    }
    
    if (!email || !validarEmail(email)) {
        document.getElementById('email').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('email').classList.remove('is-invalid');
    }
    
    if (!validarCPF(cpf)) {
        document.getElementById('cpf').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('cpf').classList.remove('is-invalid');
    }
    
    if (!validarRequisitosSenh()) {
        document.getElementById('senha').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('senha').classList.remove('is-invalid');
    }
    
    if (isValid) {
        // Simula envio do formulário (protótipo sem backend)
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        form.reset();
        
        // Reseta estados visuais de validação
        form.classList.remove('was-validated');
        
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        
        document.getElementById('cpfFeedback').innerHTML = '';
        
        document.querySelectorAll('.requirement').forEach(req => {
            req.classList.remove('valid', 'invalid');
            const icon = req.querySelector('i');
            icon.classList.remove('fa-check');
            icon.classList.add('fa-times');
            icon.style.color = 'var(--text-secondary)'; 
        });
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 20000);
    }
}

function realizarLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const loginMessage = document.getElementById('loginMessage');
    const navbarLoginBtn = document.getElementById('navbarLoginBtn'); 
    
    // Credenciais estáticas para protótipo
    const usuarioCorreto = 'teste@teste';
    const senhaCorreta = 'teste';
    
    if (email === usuarioCorreto && senha === senhaCorreta) {
        loginMessage.className = 'alert alert-success';
        loginMessage.innerHTML = '<i class="fas fa-check-circle"></i> Login realizado com sucesso!';
        loginMessage.style.display = 'block';
        
        // Atualiza a navbar para refletir o estado de usuário logado
        if (navbarLoginBtn) {
            navbarLoginBtn.innerHTML = '<i class="fas fa-user"></i> Teste';
            navbarLoginBtn.classList.remove('btn-primary');
            navbarLoginBtn.classList.add('btn-success');
            navbarLoginBtn.removeAttribute('data-bs-toggle');
            navbarLoginBtn.removeAttribute('data-bs-target');
            navbarLoginBtn.style.cursor = 'default';
        }

        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginSenha').value = '';
            loginMessage.style.display = 'none';
        }, 2000);
    } else {
        loginMessage.className = 'alert alert-danger';
        loginMessage.innerHTML = '<i class="fas fa-times-circle"></i> Email ou senha incorretos. Tente novamente.';
        loginMessage.style.display = 'block';
    }
}

// ============================================
// INICIALIZAÇÃO E EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Mostrar/Ocultar Senha
    const toggleSenhaBtn = document.getElementById('toggleSenha');
    const senhaInputToggle = document.getElementById('senha');
    
    if (toggleSenhaBtn && senhaInputToggle) {
        toggleSenhaBtn.addEventListener('click', function() {
            // Verifica se o tipo atual é senha. Se for, muda pra texto. Se não, volta pra senha.
            const type = senhaInputToggle.getAttribute('type') === 'password' ? 'text' : 'password';
            senhaInputToggle.setAttribute('type', type);
            
            // Troca o ícone do olho (aberto/fechado)
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Mostrar/Ocultar Senha do Login (O Olhinho do Modal)
    const toggleLoginSenhaBtn = document.getElementById('toggleLoginSenha');
    const loginSenhaInputToggle = document.getElementById('loginSenha');
    
    if (toggleLoginSenhaBtn && loginSenhaInputToggle) {
        toggleLoginSenhaBtn.addEventListener('click', function() {
            // Verifica se o tipo atual é senha. Se for, muda pra texto. Se não, volta pra senha.
            const type = loginSenhaInputToggle.getAttribute('type') === 'password' ? 'text' : 'password';
            loginSenhaInputToggle.setAttribute('type', type);
            
            // Troca o ícone do olho (aberto/fechado)
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    const inscricaoForm = document.getElementById('inscricaoForm');
    if (inscricaoForm) {
        inscricaoForm.addEventListener('submit', validarFormularioInscricao);
    }
    
    // --- NOVOS LISTENERS EM TEMPO REAL ---
    const nomeInput = document.getElementById('nome');
    if (nomeInput) nomeInput.addEventListener('input', validarNomeTempoReal);
    
    const sobrenomeInput = document.getElementById('sobrenome');
    if (sobrenomeInput) sobrenomeInput.addEventListener('input', validarSobrenomeTempoReal);
    
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.addEventListener('input', validarEmailTempoReal);
    // -------------------------------------

    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        senhaInput.addEventListener('input', validarRequisitosSenh);
    }
    
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            this.value = formatarCPF(this.value);
            validarCPFEmTempoReal();
        });
    }
    
    // Listener do telefone modificado para formatar E validar
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            this.value = formatarTelefone(this.value);
            validarTelefoneTempoReal(); // Aciona a cor verde/vermelha
        });
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', realizarLogin);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarLogin();
            }
        });
    }
});

// ============================================
// FUNÇÕES AUXILIARES E ACESSIBILIDADE
// ============================================

function anunciarParaLeitorTela(mensagem, tipo = 'polite') {
    const anuncio = document.createElement('div');
    anuncio.setAttribute('role', 'status');
    anuncio.setAttribute('aria-live', tipo);
    anuncio.setAttribute('aria-atomic', 'true');
    anuncio.style.position = 'absolute';
    anuncio.style.left = '-10000px';
    anuncio.textContent = mensagem;
    
    document.body.appendChild(anuncio);
    
    setTimeout(() => {
        document.body.removeChild(anuncio);
    }, 1000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function detectarModoEscuro() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

// ============================================
// PERFORMANCE
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Site Café Arábica carregado com sucesso!');
console.log('Versão: 1.0.0');
console.log('Desenvolvido com HTML5, CSS3 e JavaScript puro');