import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return; // Eğer container yoksa hata vermesin
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, duration);
}

(function init() {
  const emailPasswordForm = document.getElementById('emailPasswordForm');
  const googleBtn = document.getElementById('googleBtn');

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    showToast('Supabase yapılandırması eksik. Lütfen config.js dosyasını doldurun.', 'error');
    return;
  }

  const supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  const basePath = (() => {
    const origin = window.location.origin;
    const path = window.location.pathname.replace(/[^/]+$/, ''); // keep trailing slash and repo path
    return origin + path; // e.g., https://user.github.io/Fitness_App/
  })();

  // Login page notice from signup
  try {
    const params = new URLSearchParams(window.location.search);
    const notice = params.get('notice');
    if (notice === 'verify') {
      showToast('Kayıt başarılı! Lütfen e-posta doğrulama bağlantısına tıklayın.', 'success', 6000); // 6 saniye
  
    }
  } catch {}

  // If already logged in, redirect to dashboard
  supabaseClient.auth.getUser().then(({ data }) => {
    if (data && data.user) {
      window.location.href = 'dashboard.html';
    }
  });

  if (emailPasswordForm) {
  emailPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // "Giriş yapılıyor..." mesajını kaldırdık.
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) {
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('email not confirmed')) {
        showToast('E-posta doğrulanmamış. Lütfen mailinizi kontrol edin.', 'error');
      } else if (msg.includes('invalid login credentials')) {
        showToast('Geçersiz bilgiler. Üyeliğiniz yoksa önce kayıt olun.', 'error');
      } else {
        showToast('Giriş hatası: ' + error.message, 'error');
      }
      return;
    }
    
    if (data && data.user) {
      showToast('Giriş başarılı, yönlendiriliyor...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000); // Bildirimi görmek için 1sn bekle
    }
  });
}

  // Magic Link kaldırıldı

  // Sign-up moved to signup.html

  if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    // "Yönlendiriliyorsunuz..." mesajını kaldırdık.
    const redirectTo = basePath + 'callback.html';
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: false, // Mobil için bu daha güvenilir
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) {
      showToast('Google giriş hatası: ' + error.message, 'error');
      return;
    }
    if (data && data.url) {
      window.location.href = data.url;
    }
  });
}
})();


