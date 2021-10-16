import getRandomValues from 'get-random-values';

/**
 * Creates an Interclip-compatible random ID
 * @param length the length of the ID to generate
 * @returns a random ID
 */
export const getRandomID = (length: number): string => {
    return [...getRandomValues(new Uint8Array(length))]
        .map(
            (x, i) => (
                (i = ((x / 255) * 61) | 0),
                String.fromCharCode(i + (i > 9 ? (i > 35 ? 61 : 55) : 48))
            )
        )
        .join("").toLowerCase();
};
