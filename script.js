// === UI & SPA Control ===

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

function switchSection(sectionId, element) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show target section
    document.getElementById('s-' + sectionId).classList.add('active');

    // Update Sidebar active state
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

// === Authentication ===

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const userStr = localStorage.getItem(email);
    if (!userStr) {
        alert("هذا الحساب غير مسجل، يرجى إنشاء حساب جديد.");
        return;
    }

    const user = JSON.parse(userStr);
    
    if (user.password !== password) {
        alert("كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.");
        return;
    }
    
    checkActivationAndShowPlatform(user, email);
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 4) {
        alert("يرجى إدخال الاسم رباعي للتمكن من التسجيل.");
        return;
    }

    const existingUserStr = localStorage.getItem(email);
    if (existingUserStr) {
        const existingUser = JSON.parse(existingUserStr);
        if (existingUser.password === password) {
            checkActivationAndShowPlatform(existingUser, email);
            return;
        } else {
            alert("هذا الحساب مسجل بالفعل. يرجى إدخال كلمة السر الصحيحة الخاصة بك للوصول للحساب، أو التوجه لصفحة تسجيل الدخول.");
            return;
        }
    }

    const user = { name, phone, password, activated: false };
    localStorage.setItem(email, JSON.stringify(user));

    // Simulate sending email notification to the requested admin email
    sendEmailNotification(name, email, phone);

    checkActivationAndShowPlatform(user, email);
}

function checkActivationAndShowPlatform(user, email) {
    if (user.activated) {
        showPlatform(user.name);
    } else {
        const activationCode = prompt("يرجى إدخال كود التفعيل للوصول إلى المنصة (اسأل الأستاذ للحصول عليه):");
        if (activationCode === "123454321") {
            user.activated = true;
            localStorage.setItem(email, JSON.stringify(user));
            alert("تم التفعيل بنجاح!");
            showPlatform(user.name);
        } else {
            alert("كود التفعيل غير صحيح!");
        }
    }
}

function showPlatform(userName) {
    // Hide Auth
    document.getElementById('authScreen').classList.add('hidden');
    // Show Platform
    document.getElementById('mainPlatform').classList.remove('hidden');
    // Update Name
    document.getElementById('userNameDisplay').innerText = userName;
}

function logout() {
    window.location.reload();
}

// === Notifications & Email Handling ===

function showToast(message) {
    // Create Toast Container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create Toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ph ph-check-circle" style="font-size: 1.5rem; color: #10b981;"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function sendEmailNotification(studentName, studentEmail, studentPhone) {
    // إرسال إشعار عبر FormSubmit إلى إيميل mofarid533@gmail.com
    fetch("https://formsubmit.co/ajax/mofarid533@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "الموضوع": "تسجيل طالب جديد في منصة الروضة",
            "اسم الطالب": studentName,
            "البريد الإلكتروني": studentEmail,
            "رقم الهاتف": studentPhone,
            "_subject": "طالب جديد سجل في المنصة: " + studentName
        })
    })
    .then(response => response.json())
    .then(data => console.log("تم إرسال الإيميل بنجاح:", data))
    .catch(error => console.log("خطأ في إرسال الإيميل:", error));

    showToast(`تم التسجيل بنجاح!`);
}

// Initialize on page load Let's ensure the right tab is active
document.addEventListener('DOMContentLoaded', () => {
    // Clean start
});

// === Video Playing ===
function playVideo(element, videoId) {
    element.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    element.onclick = null; // Prevent multiple clicks
    element.style.cursor = 'default';
}
