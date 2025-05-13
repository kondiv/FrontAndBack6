async function login() {
  const login = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (response.ok) {
      window.location.href = '/profile';
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function register() {
  const login = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (response.status === 201) {
      showLogin();
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
});

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

async function login() {
  const login = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (response.ok) {
      window.location.href = '/profile';
    } else {
      const error = await response.json();
      alert(error.error || 'Ошибка входа');
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    alert('Ошибка соединения');
  }
}

async function register() {
  const login = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (!login || !password) {
    alert('Заполните все поля');
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (response.status === 201) {
      showLogin();
      alert('Регистрация успешна!');
    } else {
      const error = await response.json();
      alert(error.error || 'Ошибка регистрации');
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    alert('Ошибка соединения');
  }
}