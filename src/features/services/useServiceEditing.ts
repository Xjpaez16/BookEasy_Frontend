import { useState } from 'react';
import type { Service } from '../../entities/service/model';

/** Owns the "which service row is being edited" UI state for the page. */
export function useServiceEditing() {
  const [editing, setEditing] = useState<Service | null>(null);
  return {
    editing,
    edit: (s: Service) => setEditing(s),
    clear: () => setEditing(null),
  };
}
