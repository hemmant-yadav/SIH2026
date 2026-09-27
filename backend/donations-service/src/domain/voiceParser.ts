export interface ParsedVoiceLog {
  itemName: string;
  quantityKg: number;
  isValid: boolean;
}

/**
 * Pure domain parser for natural language / voice input (e.g., "5kg rice", "12.5 kilos potatoes")
 * Zero external framework or cloud dependencies.
 */
export const parseVoiceInput = (textInput: string): ParsedVoiceLog => {
  const trimmed = textInput.trim();
  if (!trimmed) {
    return { itemName: '', quantityKg: 0, isValid: false };
  }

  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)?\s+(.+)$/i);

  if (match) {
    return {
      quantityKg: parseFloat(match[1]),
      itemName: match[2].trim(),
      isValid: true,
    };
  }

  return {
    quantityKg: 1.0,
    itemName: trimmed,
    isValid: true,
  };
};
