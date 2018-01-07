import Material from './material';
import {Vec3} from './public';
import UniversalObject from './universalobject';
import {loadImageAsync} from '../utils';

type ObjUrl = string;
type MtlUrl = string;

type ObjContent = string;
type MtlContent = string;

const SCALE = 1;
const REVERSE = false;

export default async function queryObjAsync(objUrl: ObjUrl): Promise<UniversalObject[]> {

    const loader = new ObjLoader(objUrl);
    await loader.initAsync();
    return await loader.getObjAsync();
}

class materialPart {
    public material: namedMaterial;
    public vt: number[] = [];
    public positions: number[] = [];
    public indices: number[] = [];
    public count: number = 0;
}

class ObjLoader {
    protected filename: string;

    protected vertices: Vertex[] = [];
    protected normals: Normal[] = [];
    protected textureVt: VT[] = [];
    protected object: Face[] = [];
    protected material: namedMaterial[] = [];

    protected vt: number[] = [];
    protected positions: number[] = [];
    protected indices: number[] = [];
    private useMaterial: number;
    protected count: number = 0;

    protected materialParts: materialPart[] = [];
    protected currentMaterialPart: materialPart;

    constructor(filename: string) {
        this.filename = filename;
    }

    async initAsync() {
        const query = await fetch(this.filename);
        const content: ObjContent = await query.text();
        await this.OBJDocParserAsync(content);
        console.log(this.normals);
        console.log(this.vertices);
        console.log(this.object);
    }

    async getObjAsync(): Promise<UniversalObject[]> {
        let resObjs: UniversalObject[] = [];
        for (let entry of this.materialParts) {
            let material: Material;
            if (entry.material == undefined) {
                material = new Material([-1, -1, -1], [-1, -1, -1], [-1, -1, -1], 30);
            }
            else {
                material = entry.material.changeToMaterial(30);
            }
            console.log("materialParts", this.materialParts);

            let obj: UniversalObject;
            const img = await loadImageAsync(entry.material.textureFile);
            obj = new UniversalObject([0, 0, 0],
                entry.positions,
                entry.positions,
                entry.indices,
                material,
                entry.vt,
                img
            );
            resObjs.push(obj);
        }
        return resObjs;
    }

    protected async OBJDocParserAsync(content: string) {
        let lines = content.split("\n");
        lines.push(null);
        let tempIndex = 0;

        let currentMaterialName = "";
        let mtlUsed: boolean;

        let line;
        let sp: StringParser;
        sp = new StringParser();

        while ((line = lines[tempIndex++]) != null) {
            console.debug(line);
            sp.init(line);
            let command = sp.getWord();
            if (command == null) continue;

            switch (command) {
                case '#':
                    continue;
                case 'mtllib':
                    const path: string = ObjLoader.parseMtllib(sp, this.filename);

                    const query = await fetch(path);
                    const content = await query.text();

                    let mtl = new MTLDoc();
                    this.onReadMTLFile(content, mtl);
                    continue;

                // TODO: 默认一个obj文件里只有一个obj，默认一个obj只有一个mtl（暂时
                // case 'o':
                // case 'g':   // Read Object name
                //     let object = this.parseObjectName(sp);
                //     this.objects.push(object);
                //     currentObject = object;
                //     //这是一个浅复制，可以简单地认为和object指向同一块内容
                //     continue; // Go to the next line
                case 'v':   // Read vertex
                    let vertex = ObjLoader.parseVertex(sp, SCALE);
                    this.vertices.push(vertex);
                    continue; // Go to the next line
                case 'vn':   // Read normal
                    let normal = ObjLoader.parseNormal(sp);
                    this.normals.push(normal);
                    continue;
                case 'usemtl':
                    mtlUsed = true;
                    currentMaterialName = ObjLoader.parseUsemtl(sp);
                    for (let i = 0; i < this.material.length; i++) {
                        if (this.material[i].name == currentMaterialName) {
                            this.useMaterial = i;
                            break;
                        }
                    }
                    if (this.currentMaterialPart != undefined) this.materialParts.push(this.currentMaterialPart);
                    this.currentMaterialPart = new materialPart();
                    this.currentMaterialPart.material = this.material[this.useMaterial];
                    continue;
                case 'f':
                    //可以接受两种情况：1.只有mtl没有纹理，可以多种mtl 2.只有mtl没有纹理，只能有一种纹理
                    if (!mtlUsed) {
                        mtlUsed = true;
                        this.currentMaterialPart = new materialPart();
                    }
                    let face = this.parseFace(sp, currentMaterialName, this.vertices, this.textureVt, this.normals, REVERSE);
                    this.object.push(face);
                    continue; // Go to the next line
                case 'vt':
                    let VTVertex = ObjLoader.parseVertex(sp, SCALE);
                    this.textureVt.push(VTVertex);
            }
        }
        if (this.currentMaterialPart != undefined) this.materialParts.push(this.currentMaterialPart);
        return true;
    }

    static parseVertex(sp: StringParser, scale: number) {
        let x = sp.getFloat() * scale;
        let y = sp.getFloat() * scale;
        let z = sp.getFloat() * scale;
        return (new Vertex(x, y, z));
    };

    static parseNormal(sp: StringParser) {
        let x = sp.getFloat();
        let y = sp.getFloat();
        let z = sp.getFloat();
        return (new Normal(x, y, z));
    };

    parseFace(sp: StringParser, materialName: string, vertices: Vertex[], textureVt: VT[], Normals: Normal[], reverse: boolean) {
        let face = new Face(materialName);
        // get indices
        for (; ;) {
            let word = sp.getWord();
            if (!word || !word.replace(/^\s+|\s+$/g, "")) break;
            let subWords;
            subWords = word.split('/');

            if (subWords.length >= 1) {
                let vi = parseInt(subWords[0]) < 0 ? vertices.length + parseInt(subWords[0]) : parseInt(subWords[0]) - 1;
                face.vIndices.push(vi);
            }
            if (subWords.length >= 2) {
                if (subWords[1]) {
                    let ti = parseInt(subWords[1]) < 0 ? textureVt.length + parseInt(subWords[1]) : parseInt(subWords[1]) - 1;
                    face.tIndices.push(ti);
                }
            }
            if (subWords.length >= 3) {
                let ni = parseInt(subWords[2]) < 0 ? Normals.length + parseInt(subWords[2]) : parseInt(subWords[2]) - 1;
                face.nIndices.push(ni);
            } else {
                face.nIndices.push(-1);
            }
        }

        // calc normal
        // console.log(vertices,face.vIndices[0],face.vIndices[1],face.vIndices[2]);
        let v0 = [
            vertices[face.vIndices[0]].x,
            vertices[face.vIndices[0]].y,
            vertices[face.vIndices[0]].z];
        let v1 = [
            vertices[face.vIndices[1]].x,
            vertices[face.vIndices[1]].y,
            vertices[face.vIndices[1]].z];
        let v2 = [
            vertices[face.vIndices[2]].x,
            vertices[face.vIndices[2]].y,
            vertices[face.vIndices[2]].z];

        let normal = ObjLoader.calcNormal(v0, v1, v2);
        if (normal == null) {
            if (face.vIndices.length >= 4) {
                let v3 = [
                    vertices[face.vIndices[3]].x,
                    vertices[face.vIndices[3]].y,
                    vertices[face.vIndices[3]].z];
                normal = ObjLoader.calcNormal(v1, v2, v3);
            }
            if (normal == null) {
                normal = new Float32Array([0.0, 1.0, 0.0]);
            }
        }
        face.normal = new Normal(normal[0], normal[1], normal[2]);
        if (face.nIndices[0] != -1) {
            if (!face.normal.parallel(Normals[face.nIndices[0]])) {
                face.vIndices.reverse();
                face.nIndices.reverse();
                face.tIndices.reverse();
            }
        }

        for (let i = 0; i < face.vIndices.length; i++) {
            this.currentMaterialPart.vt.push(textureVt[face.tIndices[i]].x);
            this.currentMaterialPart.vt.push(textureVt[face.tIndices[i]].y);
            this.currentMaterialPart.positions.push(vertices[face.vIndices[i]].x);
            this.currentMaterialPart.positions.push(vertices[face.vIndices[i]].y);
            this.currentMaterialPart.positions.push(vertices[face.vIndices[i]].z);
            face.vIndices[i] = this.currentMaterialPart.count;
            this.currentMaterialPart.count++;
        }

        // Devide to triangles if face contains over 3 points.
        if (face.vIndices.length > 3) {
            let n = face.vIndices.length - 2;
            for (let i = 0; i < n; i++) {
                this.currentMaterialPart.indices.push(face.vIndices[0], face.vIndices[i + 1], face.vIndices[i + 2]);
            }
        }
        face.numIndices = face.vIndices.length;

        return face;
    }

    static calcNormal(p0: number[], p1: number[], p2: number[]) {
        // v0: a vector from p1 to p0, v1; a vector from p1 to p2
        let v0 = new Float32Array(3);
        let v1 = new Float32Array(3);
        for (let i = 0; i < 3; i++) {
            v0[i] = p0[i] - p1[i];
            v1[i] = p2[i] - p1[i];
        }

        // The cross product of v0 and v1
        let c = new Float32Array(3);
        c[0] = v0[1] * v1[2] - v0[2] * v1[1];
        c[1] = v0[2] * v1[0] - v0[0] * v1[2];
        c[2] = v0[0] * v1[1] - v0[1] * v1[0];

        // Normalize the result
        let v = new Vector3(c);
        v.normalize();
        return v.elements;
    }

    static parseUsemtl(sp: StringParser) {
        return sp.getWord();
    }

    static parseMtllib(sp: StringParser, fileName: string) {
        let i = fileName.lastIndexOf("/");
        let dirPath = "";
        if (i > 0) dirPath = fileName.substr(0, i + 1);
        return dirPath + sp.getWord();
    }

    onReadMTLFile(fileString: string, mtl: MTLDoc) {
        let lines = fileString.split('\n');
        lines.push(null);
        let tempindex = 0;

        let line;
        let name = "";
        let sp = new StringParser();
        let currentMaterial = null;
        while ((line = lines[tempindex++]) != null) {
            sp.init(line);
            let command = sp.getWord();
            if (command == null) continue;
            let color;
            switch (command) {
                case '#':
                    continue;
                case 'newmtl':
                    name = MTLDoc.parseNewmtl(sp);
                    if (currentMaterial != null) {
                        this.material.push(currentMaterial);
                    }
                    currentMaterial = new namedMaterial(name);
                    continue;
                case 'Kd':
                    if (name == "") continue;
                    color = MTLDoc.parseRGB(sp, name);
                    currentMaterial.setKd(color);
                    continue;
                case 'Ka':
                    if (name == "") continue;
                    color = MTLDoc.parseRGB(sp, name);
                    currentMaterial.setKa(color);
                    continue;
                case 'Ks':
                    if (name == "") continue;
                    color = MTLDoc.parseRGB(sp, name);
                    currentMaterial.setKs(color);
                    continue;
                default:
                    if (command.endsWith(".jpg")) {
                        let i = this.filename.lastIndexOf("/");
                        if (i > 0) currentMaterial.textureFile = this.filename.substr(0, i + 1) + command;
                    }
            }
        }
        mtl.complete = true;
        this.material.push(currentMaterial);
    }
}

class MTLDoc {
    complete: boolean;
    materials: Array<namedMaterial>;

    constructor() {
        this.complete = false;
        this.materials = new Array(0);
    }

    static parseNewmtl(sp: StringParser) {
        return sp.getWord();         // Get name
    }

    static parseRGB(sp: StringParser, name: string) {
        let r = sp.getFloat();
        let g = sp.getFloat();
        let b = sp.getFloat();
        return new Color(r, g, b, 1);
    }

}

class namedMaterial {
    public name: string;
    public textureFile: string = null;
    Ka: Color;
    Kd: Color;
    Ks: Color;
    d: number;

    constructor(name: string) {
        this.name = name;
        this.Ka = new Color(-1, -1, -1, 1);
        this.Kd = new Color(-1, -1, -1, 1);
        this.Ks = new Color(-1, -1, -1, 1);
        this.d = 1;
    }

    setKa(c: Color) {
        this.Ka = c;
    }

    setKd(c: Color) {
        this.Kd = c;
    }

    setKs(c: Color) {
        this.Ks = c;
    }

    changeToMaterial(number: number) {
        let m = new Material(this.Ka.changeIntoVec(), this.Kd.changeIntoVec(), this.Ks.changeIntoVec(), 30);
        return m;
    }
}

class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    changeIntoVec() {
        let vec3: Vec3 = [this.r, this.g, this.b];
        return vec3;
    }
}

class Face {
    materialName: string;
    vIndices: number[];
    nIndices: number[];
    tIndices: number[];
    normal: Normal;
    numIndices: number;

    constructor(materialName: string) {
        this.materialName = materialName;
        if (materialName == null) this.materialName = "";
        this.vIndices = new Array(0);
        this.nIndices = new Array(0);
        this.tIndices = new Array(0); // 用来记录纹理坐标
    }
}

class Vector3 {
    elements: Float32Array;

    constructor(opt_src: Float32Array) {
        let v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
            v[2] = opt_src[2];
        }
        this.elements = v;
    }

    normalize() {
        let v = this.elements;
        let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
        if (g) {
            if (g == 1)
                return this;
        } else {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            return this;
        }
        g = 1 / g;
        v[0] = c * g;
        v[1] = d * g;
        v[2] = e * g;
        return this;
    }

    parallel(direction2: Vector3) {
        return this.normalize() == direction2.normalize();
    }
}

class VT {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Vertex {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Normal {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    parallel = function (n2: Normal) {
        let v1 = new Float32Array(3);
        v1[0] = this.x;
        v1[1] = this.y;
        v1[2] = this.z;
        let v2 = new Float32Array(3);
        v2[0] = n2.x;
        v2[0] = n2.y;
        v2[2] = n2.z;
        let V1 = new Vector3(v1);
        let V2 = new Vector3(v2);
        return V1.parallel(V2);
    }

}

class StringParser {
    str: string;
    index: number;

    constructor() {
        this.str = null;
        this.index = 0;
    }

    init(str: string) {
        this.str = str;
        this.index = 0;
    }

    static getWordLength(str: string, start: number) {
        let i, len;
        for (i = start, len = str.length; i < len; i++) {
            let c = str.charAt(i);
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
                break;
        }
        return i - start;
    }

    skipDelimiters() {
        let i, len;
        for (i = this.index, len = this.str.length; i < len; i++) {
            let c = this.str.charAt(i);
            // Skip TAB, Space, '(', ')
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
            break;
        }
        this.index = i;
    };

    getWord() {
        this.skipDelimiters();
        let n = StringParser.getWordLength(this.str, this.index);
        if (n == 0) return null;
        let word = this.str.substr(this.index, n);
        this.index += (n + 1);

        return word;
    };

    skipToNextWord() {
        this.skipDelimiters();
        let n = StringParser.getWordLength(this.str, this.index);
        this.index += (n + 1);
    };

    getInt() {
        return parseInt(this.getWord());
    };

    getFloat() {
        return parseFloat(this.getWord());
    };
}