const toastStyles = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  background: '#fff',
  color: '#1a1a2e',
  padding: '14px 18px',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  zIndex: 99999,
  fontSize: '0.9rem',
  fontWeight: 500,
  maxWidth: '360px',
  animation: 'toastIn 0.3s ease',
};

export function showToast(message, type = 'success') {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
  };
  const icons = {
    success: 'bx bx-check-circle',
    error: 'bx bx-error-circle',
    info: 'bx bx-info-circle',
  };

  const toast = document.createElement('div');
  Object.assign(toast.style, toastStyles, {
    borderLeft: `4px solid ${colors[type] || colors.success}`,
  });

  const icon = document.createElement('i');
  icon.className = icons[type] || icons.success;
  icon.style.color = colors[type] || colors.success;
  icon.style.fontSize = '1.25rem';

  const text = document.createElement('span');
  text.textContent = message;
  text.style.flex = '1';

  const close = document.createElement('button');
  close.innerHTML = '<i class="bx bx-x"></i>';
  close.style.cssText = 'border:0;background:none;cursor:pointer;color:#868e96;font-size:1.1rem;';
  close.addEventListener('click', () => toast.remove());

  toast.append(icon, text, close);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
