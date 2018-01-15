import PointLight from "./engine/engine/pointlight";
import DirectLight from "./engine/engine/directlight";

export default function initLightControl(pointLights: PointLight[], directLights: DirectLight[]) {
    // Point lights r,g,b.
    for (let i = 0; i < 2; i++) {
        let idbase: string = "point-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "r", idbase + "g", idbase + "b"];
        for (let j = 0; j < id.length; j++) {
            const obj = <HTMLInputElement>document.getElementById(id[j]);
            obj.valueAsNumber = pointLights[i].getColor()[j];
            obj.onchange = (ev: Event) => {
                pointLights[i].getColor()[j] = obj.valueAsNumber;
            }
        }
    }
    // Direct light r,g,b.
    for (let i = 0; i < 2; i++) {
        let idbase: string = "line-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "r", idbase + "g", idbase + "b"];
        for (let j = 0; j < id.length; j++) {
            const obj = <HTMLInputElement>document.getElementById(id[j]);
            obj.valueAsNumber = directLights[i].getColor()[j];
            obj.onchange = (ev: Event) => {
                directLights[i].getColor()[j] = obj.valueAsNumber;
            }
        }
    }
    // Direct light r,g,b;
    for (let i = 0; i < 2; i++) {
        let idbase: string = "point-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "x", idbase + "y", idbase + "z"];
        for (let j = 0; j < id.length; j++) {
            const obj = <HTMLInputElement>document.getElementById(id[j]);
            obj.valueAsNumber = pointLights[i].getPosition()[j];
            obj.onchange = (ev: Event) => {
                pointLights[i].getPosition()[j] = obj.valueAsNumber;
            };
        }
    }
    // Direct light x,y,z;
    for (let i = 0; i < 2; i++) {
        let idbase: string = "line-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "x", idbase + "y", idbase + "z"];
        for (let j = 0; j < id.length; j++) {
            const obj = <HTMLInputElement>document.getElementById(id[j]);
            obj.valueAsNumber = directLights[i].getPosition()[j];
            obj.onchange = (ev: Event) => {
                directLights[i].getPosition()[j] = obj.valueAsNumber;
            };
        }
    }
    // Point lights ambient coefficient.
    for (let i = 0; i < 2; i++) {
        let id: string = "point-light-" + (i + 1) + "-env";
        const obj = <HTMLInputElement>document.getElementById(id);
        obj.valueAsNumber = pointLights[i].getAmbientCoeff();
        obj.onchange = (ev: Event) => {
            pointLights[i].setAmbientCoeff(obj.valueAsNumber);
        };
    }
    // Direct lights ambient coefficient.
    for (let i = 0; i < 2; i++) {
        let id: string = "line-light-" + (i + 1) + "-env";
        const obj = <HTMLInputElement>document.getElementById(id);
        obj.valueAsNumber = directLights[i].getAmbientCoeff();
        obj.onchange = (ev: Event) => {
            directLights[i].setAmbientCoeff(obj.valueAsNumber);
        };
    }
}
