document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const email = document.getElementById("email").value;

            try {
                const response = await fetch("http://localhost:3000/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password, email })
                });

                const data = await response.json();

                if (response.ok) {
                    // บันทึกชื่อผู้ใช้ใน localStorage
                    localStorage.setItem("loggedInUser", username);  // ใช้ชื่อผู้ใช้ที่สมัคร

                    Swal.fire({
                        title: "สมัครสมาชิกสำเร็จ!",
                        text: "กำลังนำคุณไปยังหน้าหลัก...",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "index1.html";  // เปลี่ยนเส้นทางหลังสมัคร
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: data.message,
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'custom-swal-button'  // ใช้ CSS ปรับแต่งปุ่ม
                        }
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
                    icon: "error",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'custom-swal-button'  // ใช้ CSS ปรับแต่งปุ่ม
                    }
                });
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // ป้องกันการรีเฟรชหน้า

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            console.log("กำลังเข้าสู่ระบบ...");
            console.log("Username:", username);
            console.log("Password:", password);

            try {
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json(); // แปลงเป็น JSON

                if (response.ok) {
                    // ✅ บันทึก user_id ลง localStorage
                    localStorage.setItem("loggedInUserId", data.user_id);
                    localStorage.setItem("loggedInUser", username);

                    Swal.fire({
                        title: "เข้าสู่ระบบสำเร็จ!",
                        text: "กำลังนำคุณไปยังหน้าหลัก...",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "index1.html"; // เปลี่ยนเส้นทางไปยังหน้าหลัก
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                        confirmButton: 'custom-swal-button'
                        }
                    });
                }
            } catch (error) {
                console.error("❌ เกิดข้อผิดพลาดจากเซิร์ฟเวอร์:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
                    icon: "error",
                    buttonsStyling: false,
                    customClass: {
                    confirmButton: 'custom-swal-button'
                    }
                });
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const recordForm = document.getElementById("record-form");

    if (recordForm) {
        recordForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const user_id = localStorage.getItem("loggedInUserId");
            const name = document.getElementById("child-name").value.trim();
            const age = document.getElementById("child-age").value.trim();
            const weight = document.getElementById("child-weight").value.trim();
            const height = document.getElementById("child-height").value.trim();
            const illness = document.getElementById("child-illness").value.trim();

            if (!user_id || !name || !age || !weight || !height) {
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/addChild", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id, name, age, weight, height, illness })
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        title: "บันทึกข้อมูลสำเร็จ!",
                        text: "กำลังนำคุณไปยังหน้าหลัก...",
                        icon: "success",
                        timer: 2000, // ตั้งเวลา 2 วินาที
                        showConfirmButton: false // ซ่อนปุ่ม OK
                    }).then(() => {
                        window.location.href = "display.html"; // เปลี่ยนหน้าอัตโนมัติ
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: data.message || "ไม่สามารถบันทึกข้อมูลได้",
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'custom-swal-button' // ใช้ CSS ปรับแต่งปุ่ม
                        }
                    });
                }
            } catch (error) {
                console.error("❌ เกิดข้อผิดพลาด:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
                    icon: "error",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'custom-swal-button' // ใช้ CSS ปรับแต่งปุ่ม
                    }
                });
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("children-table");

    try {
        const response = await fetch("http://localhost:3000/api/children");
        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลเด็กได้");
        }
        const children = await response.json();
        tableBody.innerHTML = ""; // ล้างข้อมูลที่แสดงอยู่ในตาราง

        children.forEach((child, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${child.name}</td>
                <td>${child.age} ปี</td>
                <td>${child.weight} กก.</td>
                <td>${child.height} ซม.</td>
                <td>${child.illness || 'ไม่มี'}</td>
                <td>
                    <div class="button-group">
                        <button class="add-child-btn" onclick="window.location.href='record.html'">เพิ่มข้อมูลเด็ก</button>
                        <button class="edit-btn" onclick="editChild(${child.id}, '${child.name}', ${child.age}, ${child.weight}, ${child.height})">แก้ไขข้อมูลเด็ก</button>
                        <button class="delete-btn" onclick="deleteChild(${child.id})">ลบข้อมูลเด็ก</button>
                        <button class="edit-btn" onclick="editHealthRecord(${child.id})">แก้ไขอาการป่วย</button>
                        <button class="delete-btn" onclick="deleteHealthRecord(${child.id})">ลบอาการป่วย</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);

            // เพิ่มคลาส blink เฉพาะแถวล่าสุดที่เพิ่มเข้าไป
            if (index === children.length - 1) {
                row.classList.add('blink');
                // รีเซ็ตการกระพริบหลังจาก 3 วินาที (ถ้าต้องการให้กระพริบเฉพาะครั้งแรก)
                setTimeout(() => {
                    row.classList.remove('blink');
                }, 5000);
            }
        });
        
    } catch (error) {
        // console.error(error);
    }
});


// ฟังก์ชันแก้ไขข้อมูลเด็ก
function editChild(id, name, age, weight, height) {
    // ตรวจสอบให้แน่ใจว่าแต่ละ input element ถูกโหลด
    const nameInput = document.getElementById("child-name");
    const ageInput = document.getElementById("child-age");
    const weightInput = document.getElementById("child-weight");
    const heightInput = document.getElementById("child-height");

    if (nameInput && ageInput && weightInput && heightInput) {
        document.getElementById("edit-form-container").style.display = "block";
        document.getElementById("child-id").value = id;  // เพิ่ม ID ในฟอร์ม
        nameInput.value = name;
        ageInput.value = age;
        weightInput.value = weight;
        heightInput.value = height;

                // เพิ่ม class เพื่อเบลอพื้นหลัง
        document.body.classList.add("blur-background");
    } else {
        console.error("ไม่พบ input element ที่ต้องการ");
    }
}

// ฟังก์ชันปิดฟอร์มแก้ไขข้อมูลเด็ก
function closeEditForm() {
    document.getElementById("edit-form-container").style.display = "none";
    // ลบ class เพื่อทำให้พื้นหลังกลับมาเป็นปกติ
    document.body.classList.remove("blur-background");
}

// เพิ่ม event listener ให้กับปุ่มยกเลิก
document.addEventListener("DOMContentLoaded", function () {
    const cancelButton = document.getElementById("cancel-btn");
    
    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            closeEditForm();  // ฟังก์ชันปิดฟอร์ม
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const editForm = document.getElementById("edit-form");
    // console.log(editForm); // ตรวจสอบว่าได้ค่าเป็น null หรือไม่
    if (editForm) {
        editForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const id = document.getElementById("child-id").value;
            const name = document.getElementById("child-name").value;
            const age = document.getElementById("child-age").value;
            const weight = document.getElementById("child-weight").value;
            const height = document.getElementById("child-height").value;
        
            // ตรวจสอบข้อมูลก่อนส่ง
            if (!name || !age || !weight || !height) {
                Swal.fire({
                    title: "ข้อมูลไม่ครบถ้วน",
                    text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก",
                    icon: "warning"
                });
                return;
            }
        
            try {
                const response = await fetch(`http://localhost:3000/api/children/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, age, weight, height })  // ส่งข้อมูลที่จำเป็น
                });
        
                if (response.ok) {
                    const data = await response.json();
                    Swal.fire({
                        title: "ข้อมูลเด็กถูกอัปเดตแล้ว!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload(); // รีเฟรชหน้าแสดงข้อมูลเด็ก
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: errorData.message || "ไม่สามารถบันทึกข้อมูลได้",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
                    icon: "error"
                });
            }
        });
    }
});

// ฟังก์ชันลบข้อมูลเด็ก
async function deleteChild(child_id) {
    console.log("กำลังลบเด็กที่มี id:", child_id); // ตรวจสอบว่า ID ถูกส่งมาไหม
    Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่สามารถกู้คืนข้อมูลนี้ได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบข้อมูล",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/children/${child_id}`, { method: "DELETE" });
                console.log(response); // ตรวจสอบผลลัพธ์จากเซิร์ฟเวอร์
                if (response.ok) {
                    Swal.fire({
                        title: "ข้อมูลเด็กถูกลบแล้ว!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload(); // รีเฟรชหน้า
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลบข้อมูลได้",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
                    icon: "error"
                });
            }
        }
    });
}
// ฟังก์ชันแก้ไขอาการป่วย
function editHealthRecord(child_id) {
    // ดึงข้อมูลอาการป่วยจาก API (จะใช้ children แทน health_records)
    fetch(`http://localhost:3000/api/children/${child_id}/illness`)
        .then(response => response.json())
        .then(data => {
            // ตั้งค่าอาการป่วยในฟอร์ม
            document.getElementById("health-child-id").value = child_id;
            document.getElementById("child-illness").value = data.illness || ""; // แสดงข้อมูลอาการป่วย

            // แสดงฟอร์มแก้ไขอาการป่วย
            document.getElementById("edit-health-form-container").style.display = "block";
            document.body.classList.add("blur-background");
        })
        .catch(error => {
            console.error("ไม่สามารถโหลดข้อมูลอาการป่วย:", error);
        });
}

// ฟังก์ชันปิดฟอร์มแก้ไขอาการป่วย
function closeHealthEditForm() {
    document.getElementById("edit-health-form-container").style.display = "none";
    document.body.classList.remove("blur-background");
}

document.addEventListener("DOMContentLoaded", function () {
    const cancelHealthBtn = document.getElementById("cancel-health-btn");

    if (cancelHealthBtn) {
        cancelHealthBtn.addEventListener("click", function () {
            closeHealthEditForm();
        });
    } else {
        // console.error("ปุ่ม cancel-health-btn ไม่พบใน DOM");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const formElement = document.getElementById("edit-health-form");
    
    if (formElement) {
        formElement.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const id = document.getElementById("health-child-id").value;
            const illness = document.getElementById("child-illness").value;
    
            // ตรวจสอบข้อมูลก่อนส่ง
            if (!illness) {
                Swal.fire({
                    title: "ข้อมูลไม่ครบถ้วน",
                    text: "กรุณากรอกข้อมูลอาการป่วยก่อนบันทึก",
                    icon: "warning"
                });
                return;
            }
    
            try {
                // เรียกใช้ API สำหรับการอัปเดตอาการป่วย
                const response = await fetch(`http://localhost:3000/api/children/${id}/illness`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ illness })  // ส่งข้อมูลอาการป่วย
                });
    
                // ตรวจสอบผลลัพธ์จาก API
                if (response.ok) {
                    const data = await response.json();
                    Swal.fire({
                        title: "อาการป่วยถูกอัปเดตแล้ว!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload(); // รีเฟรชหน้าแสดงข้อมูลเด็กหลังจากอัปเดต
                    });
                } else {
                    // หากมีข้อผิดพลาดจาก API
                    const errorData = await response.json();
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: errorData.message || "ไม่สามารถบันทึกข้อมูลได้",
                        icon: "error"
                    });
                }
            } catch (error) {
                // กรณีเกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์
                console.error("เกิดข้อผิดพลาดในการอัปเดตอาการป่วย:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
                    icon: "error"
                });
            }
        });
    } else {
        // console.error("ไม่พบฟอร์ม edit-health-form");
    }
});

// ฟังก์ชันลบอาการป่วย
async function deleteHealthRecord(child_id) {
    Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการลบอาการป่วยของเด็กนี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบอาการป่วย",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/children/${child_id}/illness`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    Swal.fire({
                        title: "อาการป่วยถูกลบแล้ว!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload(); // รีเฟรชหน้าแสดงข้อมูลเด็ก
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: errorData.message || "ไม่สามารถลบอาการป่วยได้",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการลบอาการป่วย:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
                    icon: "error"
                });
            }
        }
    });
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html"; // กลับไปหน้า Login
}
