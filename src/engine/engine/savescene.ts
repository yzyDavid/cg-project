import {scene} from '../../index';
import UniversalObject from "./universalobject";

export function addObjSaver() {
    const button: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save-obj-button');
    button.onclick = () => {
        let index: number = 0;
        let istr: string = "";
        let objStr: string = "";
        let mtlStr: string = "";
        scene.forEach((obj) => {
            if ('saveObj' in obj) {
                const universalObj = <UniversalObject>(obj as any);
                istr = index + "";
                objStr = objStr + universalObj.saveObj(istr);
                mtlStr = mtlStr + universalObj.saveMtl(istr);
                index++;
            }
        });
        const anchor = document.createElement('a');
        anchor.download = 'scene.obj';
        const blob = new Blob([objStr], {type: 'text/plain'});
        anchor.href = URL.createObjectURL(blob);
        anchor.click();

        const anchor2 = document.createElement('a');
        anchor2.download = 'scene.mtl';
        const blob2 = new Blob([mtlStr], {type: 'text/plain'});
        anchor2.href = URL.createObjectURL(blob2);
        anchor2.click();
    };
}