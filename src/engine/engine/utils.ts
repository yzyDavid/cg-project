/*
 * created by Zhenyun Yu.
 */

export async function loadImageAsync(sourceUrl: string): Promise<HTMLImageElement> {
    const img = new Image();
    const load = new Promise((resolve) => {
        img.onload = () => resolve(img);
    });
    img.src = sourceUrl;
    await load;
    return img;
}
