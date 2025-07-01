// utils/gameStateCodec.js

/**
 * Encodes a game state object into a base64 string for use in URLs.
 *
 * @param {Object} gameState
 * @param {number[]} gameState.clues - Array of 81 numbers (0-9) for the puzzle clues.
 * @param {number[]} gameState.inputs - Array of 81 numbers (0-9) for the player inputs.
 * @param {number[][]} gameState.hints - Array of 81 arrays of 9 bits (0/1) for pencilmarks.
 * @returns {string} base64 encoded game state
 */
export function encodeGameState({ clues, inputs, hints }) {
  const totalBytes = 81 + 81 + 92; // 254
  const buffer = new Uint8Array(totalBytes);

  let offset = 0;

  // Write clues
  for (let i = 0; i < 81; i++) {
    buffer[offset++] = clues[i];
  }

  // Write inputs
  for (let i = 0; i < 81; i++) {
    buffer[offset++] = inputs[i];
  }

  // Write hints packed as bits
  let bitIndex = 0;
  let byte = 0;
  for (let cell = 0; cell < 81; cell++) {
    for (let n = 0; n < 9; n++) {
      const bit = hints[cell][n] ? 1 : 0;
      byte |= (bit << (7 - (bitIndex % 8)));
      bitIndex++;
      if (bitIndex % 8 === 0) {
        buffer[offset++] = byte;
        byte = 0;
      }
    }
  }
  if (bitIndex % 8 !== 0) {
    buffer[offset++] = byte;
  }

  // Encode as base64
  return btoa(String.fromCharCode(...buffer));
}

/**
 * Decodes a base64 game state string into its structured form.
 *
 * @param {string} base64 - Encoded game state string
 * @returns {Object} Decoded { clues, inputs, hints }
 */
export function decodeGameState(base64) {
  const binaryStr = atob(base64);
  const buffer = new Uint8Array([...binaryStr].map(c => c.charCodeAt(0)));

  let offset = 0;

  // Read clues into flat
  const flatClues = [];
  for (let i = 0; i < 81; i++) {
    flatClues.push(buffer[offset++]);
  }
  // Convert to 9x9
  const clues = [];
  for (let i = 0; i < 9; i++) {
    clues.push(flatClues.slice(i * 9, (i + 1) * 9));
  }

  // Read inputs into flat
  const flatInputs = [];
  for (let i = 0; i < 81; i++) {
    flatInputs.push(buffer[offset++]);
  }
  // Convert to 9x9
  const inputs = [];
  for (let i = 0; i < 9; i++) {
    inputs.push(flatInputs.slice(i * 9, (i + 1) * 9));
  }


  // Read hints
  const hints = Array(81).fill(0).map(() => Array(9).fill(0));
  let bitIndex = 0;
  for (let cell = 0; cell < 81; cell++) {
    for (let n = 0; n < 9; n++) {
      const byte = buffer[offset + Math.floor(bitIndex / 8)];
      const bitPos = 7 - (bitIndex % 8);
      const bit = (byte >> bitPos) & 1;
      hints[cell][n] = bit;
      bitIndex++;
    }
  }

  return { clues, inputs, hints };
}

