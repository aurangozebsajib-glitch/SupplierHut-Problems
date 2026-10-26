import assert from 'node:assert';
import { timingSafeEqual } from 'node:crypto';

console.log('Running Hermes Agent Auth & Validation Tests...\n');

// 1. Test constant-time token comparison
function safeCompare(tokenA, tokenB) {
  if (!tokenA || !tokenB) return false;
  const bufA = Buffer.from(tokenA);
  const bufB = Buffer.from(tokenB);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const SECRET = 'hermes_test_secret_token_12345';
assert.strictEqual(safeCompare(SECRET, SECRET), true, 'Identical tokens must match');
assert.strictEqual(safeCompare(SECRET, 'wrong_token'), false, 'Different tokens must fail');
assert.strictEqual(safeCompare(SECRET, ''), false, 'Empty token must fail');
console.log('✓ Constant-time token comparison passed.');

// 2. Test Sector Validation
const VALID_SECTORS = [
  'Agriculture',
  'Education',
  'Healthcare',
  'Logistics',
  'Retail & SMEs',
  'Technology',
  'Environment',
  'Employment',
  'Finance',
  'Public Services',
  'Other',
];

function isValidSector(sec) {
  return VALID_SECTORS.includes(sec);
}

assert.strictEqual(isValidSector('Agriculture'), true);
assert.strictEqual(isValidSector('Retail & SMEs'), true);
assert.strictEqual(isValidSector('Cryptocurrency'), false);
console.log('✓ Sector validation passed.');

// 3. Test Confirmation Gate logic
function isDestructiveAllowed(queryParam, headerVal) {
  return queryParam === true && headerVal === 'confirmed';
}

assert.strictEqual(isDestructiveAllowed(false, null), false, 'Default delete must be blocked');
assert.strictEqual(isDestructiveAllowed(true, null), false, 'Missing header must be blocked');
assert.strictEqual(isDestructiveAllowed(false, 'confirmed'), false, 'Missing query param must be blocked');
assert.strictEqual(isDestructiveAllowed(true, 'confirmed'), true, 'Explicit confirmation must be allowed');
console.log('✓ Destructive confirmation gate passed.');

console.log('\nAll Hermes Agent unit tests passed successfully!');
