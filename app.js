import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

(function init() {
  const messageEl = document.getElementById('message');
  const emailPasswordForm = document.getElementById('emailPasswordForm');
  const googleBtn = document.getElementById('googleBtn');

  function setMessage(text, isError) {
    if (!messageEl) return;
    messageEl.textContent = text || '';
    messageEl.style.color = isError ? '#f87171' : '#94a3b8';
  }

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    setMessage('Supabase yapılandırması eksik. Lütfen config.js dosyasını doldurun.', true);
    return;
  }

  const supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  // Login page notice from signup
  try {
    const params = new URLSearchParams(window.location.search);
    const notice = params.get('notice');
    if (notice === 'verify') {
      setMessage('Kayıt başarılı! Lütfen e‑posta doğrulama bağlantısına tıklayın.', false);
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
      setMessage('Giriş yapılıyor...');
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('email not confirmed')) {
          setMessage('E-posta doğrulanmamış. Lütfen mailinizdeki doğrulama bağlantısına tıklayın.', true);
        } else if (msg.includes('invalid login credentials')) {
          setMessage('Geçersiz bilgiler. Üyeliğiniz yoksa önce kayıt olun.', true);
        } else {
          setMessage('Giriş hatası: ' + error.message, true);
        }
        return;
      }
      if (data && data.user) {
        setMessage('Giriş başarılı, yönlendiriliyor...');
        window.location.href = 'dashboard.html';
      }
    });
  }

  // Magic Link kaldırıldı

  // Sign-up moved to signup.html

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      setMessage('Google ile yönlendiriliyorsunuz...');
      const redirectTo = new URL('dashboard.html', window.location.href).toString();
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      });
      if (error) setMessage('Google giriş hatası: ' + error.message, true);
    });
  }
})();


