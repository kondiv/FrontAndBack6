document.addEventListener('DOMContentLoaded', async () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  
  try {
    const response = await fetch('/user');
    if (response.ok) {
      const user = await response.json();
      document.getElementById('username').textContent = user.username;
    }
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
  }
  
  loadData();
});

async function loadData() {
  try {
    const response = await fetch('/data');
    const data = await response.json();
    document.getElementById('dataContainer').innerHTML = `
    <p>Время: ${new Date(data.timestamp).toLocaleString()}</p>
    <p>Значение: ${data.value}</p>
    `;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

async function logout() {
  try {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}