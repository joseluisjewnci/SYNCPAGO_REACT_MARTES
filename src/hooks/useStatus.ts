import { useState } from 'react';

export function useStatus(initialValue: string = 'Hoy') {
  const [status, setStatus] = useState<string>(initialValue);

  return [status, setStatus] as const;
}