import { ReactNode, useEffect, useState } from 'react';
import AgeGateModal from '../compliance/AgeGateModal';

const AGE_GATE_KEY = 'velvet_age_confirmed';

export default function RequireAgeGate({ children }: { children: ReactNode }) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AGE_GATE_KEY);
    setConfirmed(stored === 'true');
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    setConfirmed(true);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (confirmed === null) {
    return null;
  }

  if (!confirmed) {
    return <AgeGateModal onConfirm={handleConfirm} onDecline={handleDecline} />;
  }

  return <>{children}</>;
}
