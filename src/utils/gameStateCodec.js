export function encodeGameState({ clues, inputs, hints }) {
  const totalBytes = 81 + 81 + 92; // 254 bytes
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

  // Write hints as bits
  let bitOffset = offset;
  let bitPos = 0;
  buffer[bitOffset] = 0; // init first byte

  function writeBit(bit) {
    if (bit) {
      buffer[bitOffset] |= (1 << (7 - bitPos));
    }
    bitPos++;
    if (bitPos === 8) {
      bitPos = 0;
      bitOffset++;
      buffer[bitOffset] = 0;
    }
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      for (let n = 0; n < 9; n++) {
        writeBit(hints[row][col][n] ? 1 : 0);
      }
    }
  }

  return btoa(String.fromCharCode(...buffer));
}

export function decodeGameState(base64) {
  const binaryStr = atob(base64);
  const buffer = new Uint8Array([...binaryStr].map(c => c.charCodeAt(0)));

  let offset = 0;

  // Read clues
  const clues = [];
  for (let i = 0; i < 81; i++) {
    clues.push(buffer[offset++]);
  }

  // Read inputs
  const inputs = [];
  for (let i = 0; i < 81; i++) {
    inputs.push(buffer[offset++]);
  }

  // Read hints as bits
  const hints = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );

  let bitOffset = offset;
  let bitPos = 0;

  function readBit() {
    const byte = buffer[bitOffset];
    const bit = (byte >> (7 - bitPos)) & 1;
    bitPos++;
    if (bitPos === 8) {
      bitPos = 0;
      bitOffset++;
    }
    return bit;
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      for (let n = 0; n < 9; n++) {
        hints[row][col][n] = readBit() === 1;
      }
    }
  }

  return {
    clues: to2D(clues),
    inputs: to2D(inputs),
    hints
  };
}

function to2D(arr) {
  return Array.from({ length: 9 }, (_, i) => arr.slice(i * 9, i * 9 + 9));
}
