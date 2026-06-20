import { describe, expect, it, vi } from 'vitest';

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('react-toastify', () => ({ toast: mockToast }));

import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast.js';

describe('notifySuccess', () => {
  it('calls toast.success with "Sucesso:" prefix', () => {
    notifySuccess('Operação concluída');
    expect(mockToast.success).toHaveBeenCalledWith(
      expect.stringMatching(/^Sucesso:/),
      expect.any(Object),
    );
  });

  it('uses fallback message when message is empty', () => {
    notifySuccess('');
    expect(mockToast.success).toHaveBeenCalledWith(
      expect.stringContaining('Operação realizada com sucesso'),
      expect.any(Object),
    );
  });
});

describe('notifyError', () => {
  it('calls toast.error with "Erro:" prefix', () => {
    notifyError('Algo deu errado');
    expect(mockToast.error).toHaveBeenCalledWith(
      expect.stringMatching(/^Erro:/),
      expect.any(Object),
    );
  });

  it('uses fallback message when message is non-string', () => {
    notifyError(null);
    expect(mockToast.error).toHaveBeenCalledWith(
      expect.stringContaining('Não foi possível concluir a operação'),
      expect.any(Object),
    );
  });
});

describe('notifyInfo', () => {
  it('calls toast.info with "Info:" prefix', () => {
    notifyInfo('Informação');
    expect(mockToast.info).toHaveBeenCalledWith(
      expect.stringMatching(/^Info:/),
      expect.any(Object),
    );
  });
});

describe('notifyWarning', () => {
  it('calls toast.warning with "Aviso:" prefix', () => {
    notifyWarning('Atenção');
    expect(mockToast.warning).toHaveBeenCalledWith(
      expect.stringMatching(/^Aviso:/),
      expect.any(Object),
    );
  });
});
