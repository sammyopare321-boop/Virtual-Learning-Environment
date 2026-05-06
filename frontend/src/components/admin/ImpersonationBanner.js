'use client';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import { useRouter } from 'next/navigation';

export default function ImpersonationBanner() {
  const { user, isImpersonating } = useAuth();
  const router = useRouter();

  if (!isImpersonating || !isImpersonating()) return null;

  const handleExit = async () => {
    try {
      const res = await adminApi.exitImpersonation();
      // Replace token with returned admin token
      document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; path=/`;
      router.push('/dashboard/admin');
      window.location.reload(); // Force context refresh
    } catch (err) {
      console.error('Failed to exit impersonation:', err);
    }
  };

  return (
    <div style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B', padding: '8px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 9999 }}>
      <span>⚠️ You are currently impersonating <strong>{user?.name}</strong></span>
      <button onClick={handleExit}
        style={{ background: '#F59E0B', color: 'white', border: 'none',
                 borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontWeight: '600' }}>
        Exit Impersonation
      </button>
    </div>
  );
}
