import PointLight from "./engine/engine/pointlight";
import DirectLight from "./engine/engine/directlight";

export default function initLightControl(pointLights: PointLight[], directLights: DirectLight[]) {
    for (let i = 0; i < 2; i++) {
        let idbase: string = "point-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "r", idbase + "g", idbase + "b"];
        for (let j = 0; j < id.length; j++) {
            (<HTMLInputElement>document.getElementById(id[j])).onchange = (ev: Event) => {
                const obj = <HTMLInputElement>document.getElementById(id[j]);
                pointLights[i].getColor()[j] = obj.valueAsNumber;
            };
        }
    }

    for (let i = 0; i < 2; i++) {
        let idbase: string = "line-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "r", idbase + "g", idbase + "b"];
        for (let j = 0; j < id.length; j++) {
            (<HTMLInputElement>document.getElementById(id[j])).onchange = (ev: Event) => {
                const obj = <HTMLInputElement>document.getElementById(id[j]);
                directLights[i].getColor()[j] = obj.valueAsNumber;
            };
        }
    }

    for (let i = 0; i < 2; i++) {
        let idbase: string = "point-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "x", idbase + "y", idbase + "z"];
        for (let j = 0; j < id.length; j++) {
            (<HTMLInputElement>document.getElementById(id[j])).onchange = (ev: Event) => {
                const obj = <HTMLInputElement>document.getElementById(id[j]);
                pointLights[i].getPosition()[j] = obj.valueAsNumber;
            };
        }
    }

    for (let i = 0; i < 2; i++) {
        let idbase: string = "line-light-" + (i + 1) + "-";
        let id: string[] = [idbase + "x", idbase + "y", idbase + "z"];
        for (let j = 0; j < id.length; j++) {
            (<HTMLInputElement>document.getElementById(id[j])).onchange = (ev: Event) => {
                const obj = <HTMLInputElement>document.getElementById(id[j]);
                directLights[i].getPosition()[j] = obj.valueAsNumber;
            };
        }
    }

    for (let i = 0; i < 2; i++) {
        let id: string = "point-light-" + (i + 1) + "-env";
        (<HTMLInputElement>document.getElementById(id)).onchange = (ev: Event) => {
            const obj = <HTMLInputElement>document.getElementById(id);
            pointLights[i].setAmbientCoeff(obj.valueAsNumber);
        };
    }

    for (let i = 0; i < 2; i++) {
        let id: string = "line-light-" + (i + 1) + "-env";
        (<HTMLInputElement>document.getElementById(id)).onchange = (ev: Event) => {
            const obj = <HTMLInputElement>document.getElementById(id);
            directLights[i].setAmbientCoeff(obj.valueAsNumber);
        };
    }
}
