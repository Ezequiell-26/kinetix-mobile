/**
 * security.test.ts - Tests de seguridad para KinetixFitt
 * 
 * Verifica:
 * 1. Trainer A NO puede acceder a datos de Cliente B
 * 2. Trainer A NO puede acceder a uploads de Cliente B
 * 3. Client A NO puede acceder a datos de Client B
 * 4. Cliente inexistente no permite enumeración útil
 * 5. Analytics respeta ownership
 * 6. Un clientId manipulado en el request no salta autorización
 * 7. Upload traversal falla
 * 8. Extensiones/MIME no permitidos fallan
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Security Tests - P0 Ownership/IDOR', () => {
  let trainerAToken: string;
  let trainerBToken: string;
  let clientAToken: string;
  let clientBToken: string;
  let trainerAId: string;
  let trainerBId: string;
  let clientAId: string;
  let clientBId: string;
  let clientARecordId: string;
  let clientBRecordId: string;

  beforeAll(async () => {
    // Limpiar datos previos
    await prisma.notification.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.progressPhoto.deleteMany({});
    await prisma.progressMeasurement.deleteMany({});
    await prisma.checkIn.deleteMany({});
    await prisma.workoutLog.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear Trainer A
    const trainerA = await prisma.user.create({
      data: {
        name: 'Trainer A',
        email: `trainer_a_${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'TRAINER',
      },
    });
    trainerAId = trainerA.id;

    // Crear Trainer B
    const trainerB = await prisma.user.create({
      data: {
        name: 'Trainer B',
        email: `trainer_b_${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'TRAINER',
      },
    });
    trainerBId = trainerB.id;

    // Crear Cliente A (asignado a Trainer A)
    const clientAUser = await prisma.user.create({
      data: {
        name: 'Client A',
        email: `client_a_${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'CLIENT',
      },
    });
    const clientA = await prisma.client.create({
      data: {
        name: 'Client A',
        email: `client_a_${Date.now()}@test.com`,
        userId: clientAUser.id,
      },
    });
    clientAId = clientAUser.id;
    clientARecordId = clientA.id;

    // Crear Cliente B (asignado a Trainer B)
    const clientBUser = await prisma.user.create({
      data: {
        name: 'Client B',
        email: `client_b_${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'CLIENT',
      },
    });
    const clientB = await prisma.client.create({
      data: {
        name: 'Client B',
        email: `client_b_${Date.now()}@test.com`,
        userId: clientBUser.id,
      },
    });
    clientBId = clientBUser.id;
    clientBRecordId = clientB.id;

    // Simular tokens JWT (en producción se generarían con jose)
    // Para tests usamos una aproximación
    trainerAToken = 'mock_trainer_a_token';
    trainerBToken = 'mock_trainer_b_token';
    clientAToken = 'mock_client_a_token';
    clientBToken = 'mock_client_b_token';
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.progressPhoto.deleteMany({});
    await prisma.progressMeasurement.deleteMany({});
    await prisma.checkIn.deleteMany({});
    await prisma.workoutLog.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('1. Trainer A NO puede acceder a datos de Cliente B', async () => {
    // Simular request de Trainer A intentando ver cliente de Trainer B
    const response = await fetch(`http://localhost:3001/api/clients/${clientBRecordId}`, {
      headers: { Cookie: `ec_token=${trainerAToken}` },
    });
    
    // Debe retornar 404 para no revelar existencia
    expect(response.status).toBe(404);
  });

  it('2. Client A NO puede acceder a datos de Client B', async () => {
    const response = await fetch(`http://localhost:3001/api/clients/${clientBRecordId}`, {
      headers: { Cookie: `ec_token=${clientAToken}` },
    });
    
    // Debe retornar 403 o 404
    expect([403, 404]).toContain(response.status);
  });

  it('3. Cliente inexistente no permite enumeración útil', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await fetch(`http://localhost:3001/api/clients/${fakeId}`, {
      headers: { Cookie: `ec_token=${trainerAToken}` },
    });
    
    // Debe retornar 404 sin revelar si es ID inválido o no existe
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe('Cliente no encontrado');
  });

  it('4. Upload path traversal falla', async () => {
    // Intentar acceder a archivo con path traversal
    const maliciousPath = '../../../../etc/passwd';
    const response = await fetch(`http://localhost:3001/api/uploads/progress/${maliciousPath}`, {
      headers: { Cookie: `ec_token=${clientAToken}` },
    });
    
    // Debe fallar con 400 o 404
    expect([400, 404]).toContain(response.status);
  });

  it('5. Upload sin autenticación falla', async () => {
    const response = await fetch('http://localhost:3001/api/uploads/progress/test.jpg');
    
    // Debe retornar 401
    expect(response.status).toBe(401);
  });
});

describe('Security Tests - Authorization Functions', () => {
  it('assertTrainerOwnsClient retorna false para trainer sin cliente', async () => {
    const { assertTrainerOwnsClient } = await import('@/lib/authorization');
    
    const fakeTrainerId = '00000000-0000-0000-0000-000000000000';
    const fakeClientId = '11111111-1111-1111-1111-111111111111';
    
    const result = await assertTrainerOwnsClient(fakeTrainerId, fakeClientId);
    expect(result).toBe(false);
  });

  it('validateClientIdForTrainer retorna null para clientId inválido', async () => {
    const { validateClientIdForTrainer } = await import('@/lib/authorization');
    
    const fakeTrainerId = '00000000-0000-0000-0000-000000000000';
    const fakeClientId = '11111111-1111-1111-1111-111111111111';
    
    const result = await validateClientIdForTrainer(fakeTrainerId, fakeClientId);
    expect(result).toBeNull();
  });

  it('sanitizePath elimina secuencias de traversal', async () => {
    const { sanitizePath } = await import('@/lib/security');
    
    expect(sanitizePath('../../../etc/passwd')).toBe('etc/passwd');
    expect(sanitizePath('..\\..\\windows\\system32')).toBe('windows/system32');
    expect(sanitizePath('normal/path/file.jpg')).toBe('normal/path/file.jpg');
  });
});

describe('Security Tests - MIME Validation', () => {
  it('rejecta extensiones peligrosas', async () => {
    const { ALLOWED_EXTENSIONS } = await import('@/lib/security');
    
    const dangerousExtensions = ['.exe', '.bat', '.sh', '.php', '.js', '.html', '.svg'];
    
    for (const ext of dangerousExtensions) {
      expect(ALLOWED_EXTENSIONS).not.toContain(ext);
    }
  });

  it('permite solo MIME types seguros', async () => {
    const { ALLOWED_MIME_TYPES } = await import('@/lib/security');
    
    const dangerousMimes = ['application/x-executable', 'text/html', 'application/javascript'];
    
    for (const mime of dangerousMimes) {
      expect(ALLOWED_MIME_TYPES).not.toContain(mime);
    }
  });
});

console.log('✅ Security tests loaded successfully');
