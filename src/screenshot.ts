/*
 * created by Zhenyun Yu.
 */

export default function saveScreenshot() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
    canvas.toBlob((blob) => {
        const anchor = document.createElement('a');
        anchor.download = 'screenshot.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
    });
}
