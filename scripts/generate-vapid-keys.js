#!/usr/bin/env node
/**
 * Script para generar VAPID keys para notificaciones push
 * Ejecutar: node scripts/generate-vapid-keys.js
 */

const webPush = require('web-push');

const vapidKeys = webPush.generateVAPIDKeys();

console.log('\n========================================');
console.log('VAPID KEYS GENERADAS EXITOSAMENTE');
console.log('========================================\n');
console.log('Agregá estas variables a tu .env:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`);
console.log('========================================');
console.log('⚠️  IMPORTANTE:');
console.log('- Guardá estas claves en un lugar seguro');
console.log('- NUNCA las commitees a Git');
console.log('- Si las perdés, los usuarios tendrán que resuscribirse');
console.log('========================================\n');
