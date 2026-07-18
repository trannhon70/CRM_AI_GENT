export function getContrastTextColor(hex: string) {
    const color = hex.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    const values = [r, g, b].map(c =>
        c <= 0.03928
            ? c / 12.92
            : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    const luminance =
        0.2126 * values[0] +
        0.7152 * values[1] +
        0.0722 * values[2];

    return luminance > 0.179 ? "#000000" : "#ffffff";
}