import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

describe('Validación de Email', () => {
  it('debe aceptar emails @gmail.com válidos', () => {
    expect(validateEmail('usuario@gmail.com')).toBe(true);
    expect(validateEmail('nombre.apellido@gmail.com')).toBe(true);
    expect(validateEmail('test123@gmail.com')).toBe(true);
  });

  it('debe rechazar emails que no son @gmail.com', () => {
    expect(validateEmail('usuario@yahoo.com')).toBe(false);
    expect(validateEmail('test@hotmail.com')).toBe(false);
    expect(validateEmail('admin@empresa.com')).toBe(false);
  });

  it('debe rechazar emails inválidos', () => {
    expect(validateEmail('invalido')).toBe(false);
    expect(validateEmail('@gmail.com')).toBe(false);
    expect(validateEmail('usuario@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Validación de Contraseña', () => {
  it('debe aceptar contraseñas válidas', () => {
    expect(validatePassword('Password123')).toBe(true);
    expect(validatePassword('SecurePass1')).toBe(true);
    expect(validatePassword('MyP4ssw0rd')).toBe(true);
  });

  it('debe rechazar contraseñas muy cortas', () => {
    expect(validatePassword('Pass1')).toBe(false);
    expect(validatePassword('1234567')).toBe(false);
  });

  it('debe rechazar contraseñas sin mayúsculas', () => {
    expect(validatePassword('password123')).toBe(false);
  });

  it('debe rechazar contraseñas sin minúsculas', () => {
    expect(validatePassword('PASSWORD123')).toBe(false);
  });

  it('debe rechazar contraseñas sin números', () => {
    expect(validatePassword('PasswordABC')).toBe(false);
  });
});

describe('Sanitización de Input', () => {
  it('debe eliminar etiquetas HTML', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
    expect(sanitizeInput('<b>negrita</b>')).toBe('negrita');
  });

  it('debe eliminar caracteres < y >', () => {
    expect(sanitizeInput('texto < con simbolos >')).toBe('texto  con simbolos ');
  });

  it('debe hacer trim del texto', () => {
    expect(sanitizeInput('  texto con espacios  ')).toBe('texto con espacios');
  });

  it('debe manejar strings vacíos', () => {
    expect(sanitizeInput('')).toBe('');
  });
});
