import { API_BASE_URL } from './common';
import { SfxDescUpdateRequest } from '../interface/sfxDescInterface';

export async function updateSfxDescAPI(request: SfxDescUpdateRequest) {
  const response = await fetch(`${API_BASE_URL}/sfx-desc/update-sfx-desc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('Failed to update sfx desc');
  }
  const data = await response.json();
  return data.data;
}
