import {scene} from '../../index';
import UniversalObject from "./universalobject";

export function addObjSaver() {
    const button: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save-obj-button');
    button.onclick = () => {
        let index: number = 0;
        let istr: String = "";
        let objStr: String = "";
        let mtlStr: String = "";
        scene.forEach((obj) => {
            if ('saveObj' in obj) {
                const universalObj = <UniversalObject>(obj as any);
                istr = String(index);
                objStr = objStr + universalObj.saveObj(istr);
                mtlStr = mtlStr + universalObj.saveMtl(istr);
                console.log("objstr", objStr);
                index++;
            }
        })
    };
}