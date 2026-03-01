import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

export function requireAdmin(user: UserProfile): void {
  const groups: string[] = (user as any).groups ?? [];
  if (!groups.includes('Admin')) {
    throw new HttpErrors.Forbidden('Accesso riservato agli amministratori.');
  }
}

// Gli utenti normali non hanno gruppi Cognito (nessun gruppo = User).
// L'autenticazione JWT è già verificata da @authenticate('cognito'),
// quindi qualsiasi token valido appartiene a un utente autorizzato.
export function requireUser(_user: UserProfile): void {}
