/*
 * created by Zhenyun Yu.
 */

export const defaultEngineConfig = (): { [entry: string]: any } => {
    return {
        shader: 'primitive',
        glFlags: [],
        width: 1280,
        height: 720
    };
};
