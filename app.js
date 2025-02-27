document.getElementById('register').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
  
    const data = await response.json();
    
    if (response.ok) {
      alert('ลงทะเบียนสำเร็จ!');
    } else {
      alert('เกิดข้อผิดพลาด: ' + data.message);
    }
  });
  