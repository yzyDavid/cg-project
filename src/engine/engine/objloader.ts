import GeometryObject from './geometryobject';
import * as contentText from '../../module/cube.obj';

export default class ObjLoader {
    protected filename: string;
    protected vertices: Vertex[] = [];
    protected normals: Normal[] = [];
    protected textureVt: VT[] = [];
    protected object: Face[] = [];
    protected material: Material[] = [];
    protected scale: number;
    protected reverse: boolean;
    protected textureFile: string;
    protected vt: number[] = [];
    private useMaterial: number;

    constructor(filename: string, scale: number, reverse: boolean, textureFile: string) {
        this.scale = scale;
        this.reverse = reverse;
        const content = <string>(contentText as any);
        //this.getText(filename, this.content);
        //let content:string;
        //this.fetchThatAsync(filename).then<string>();
        this.filename = filename;
        this.textureFile = textureFile;
        this.OBJDocParser(content);
        this.textureFile = textureFile;
        console.log(this.normals);
        console.log(this.vertices);
        console.log(this.object);
    }

    getObj() {
        const faceColors = [
            [0.7, 0.7, 0.3, 1.0],    // Front face: white - modified
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],    // Left face: purple
        ];
        let colors: number[] = [];
        faceColors.forEach(v => {
            colors = colors.concat(v, v, v, v);
        });
        let indices: number[] = [];
        let positions: number[] = [];
        let vt: number[] = [];
        let count = 0;

        for (let entry of this.object) {
            for (let i = 0; i < entry.vIndices.length; i++) {
                positions.push(this.vertices[entry.vIndices[i]].x);
                positions.push(this.vertices[entry.vIndices[i]].y);
                positions.push(this.vertices[entry.vIndices[i]].z);
                if (this.textureVt.length > 0) {
                    vt.push(this.textureVt[entry.tIndices[i]].x);
                    vt.push(this.textureVt[entry.tIndices[i]].y);
                }
                indices.push(count);
                count++;
            }
        }
        console.log("material", this.material[this.useMaterial]);
        return new GeometryObject([0.0, 0.0, 0.0], positions, indices, colors, vt, this.textureFile, true);
    }

    async fetchTextAsync(url: string): Promise<string> {
        const response = await fetch(url);
        return await response.text();
    }

    fetchText(url: string) {
        const fn = async () => {
            return fetch(url).then((response) => {
                return response.text();
            }).then((text) => {
                return text;
            }).catch((e) => {
                console.error("fetch text error: " + url);
            });
        };
    }

    protected OBJDocParser(content: string) {
        let lines = content.split("\n");
        lines.push(null);
        let tempIndex = 0;

        let currentMaterialName = "";

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
                    let ifmtl = true;
                    let path = ObjLoader.parseMtllib(sp, this.filename);
                    let mtl = new MTLDoc();
                    let content = "newmtl new\n" +
                        "\tNs 32\n" +
                        "\td 1\n" +
                        "\tTr 0\n" +
                        "\tTf 1 1 1\n" +
                        "\tillum 2\n" +
                        "\tKa 0.1255 0.1255 0.1255\n" +
                        "\tKd 0.1255 0.1255 0.1255\n" +
                        "\tKs 0.3500 0.3500 0.3500";
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
                    let vertex = ObjLoader.parseVertex(sp, this.scale);
                    this.vertices.push(vertex);
                    continue; // Go to the next line
                case 'vn':   // Read normal
                    let normal = ObjLoader.parseNormal(sp);
                    this.normals.push(normal);
                    continue;
                case 'usemtl':
                    currentMaterialName = ObjLoader.parseUsemtl(sp);
                    for (let i = 0; i < this.material.length; i++) {
                        this.useMaterial = i;
                        break;
                    }
                    continue;
                case 'f':
                    let face = this.parseFace(sp, currentMaterialName, this.vertices, this.textureVt, this.normals, this.reverse);
                    this.object.push(face);
                    continue; // Go to the next line
                case 'vt':
                    let VTVertex = ObjLoader.parseVertex(sp, this.scale);
                    this.textureVt.push(VTVertex);
            }
        }
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

        // 计算法向量
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
        if (reverse) {
            normal[0] = -normal[0];
            normal[1] = -normal[1];
            normal[2] = -normal[2];
        }
        face.normal = new Normal(normal[0], normal[1], normal[2]);
        if (face.nIndices[0] != -1) {
            if (!face.normal.parallel(Normals[face.nIndices[0]])) {
                face.vIndices.reverse();
                face.nIndices.reverse();
                face.tIndices.reverse();
            }
        }

        for (let v of face.tIndices) {
            this.vt.push(textureVt[v].x);
            this.vt.push(textureVt[v].y);
        }


        // Devide to triangles if face contains over 3 points.
        if (face.vIndices.length > 3) {
            let n = face.vIndices.length - 2;
            let newVIndices = new Array(n * 3);
            let newNIndices = new Array(n * 3);
            let newTIndices = new Array(n * 3);
            for (let i = 0; i < n; i++) {
                newVIndices[i * 3] = face.vIndices[0];
                newVIndices[i * 3 + 1] = face.vIndices[i + 1];
                newVIndices[i * 3 + 2] = face.vIndices[i + 2];
                newNIndices[i * 3] = face.nIndices[0];
                newNIndices[i * 3 + 1] = face.nIndices[i + 1];
                newNIndices[i * 3 + 2] = face.nIndices[i + 2];
                newTIndices[i * 3] = face.tIndices[0];
                newTIndices[i * 3 + 1] = face.tIndices[i + 1];
                newTIndices[i * 3 + 2] = face.tIndices[i + 2]
            }
            face.vIndices = newVIndices;
            face.nIndices = newNIndices;
            face.tIndices = newTIndices;
            //if(iiii<4)console.log("face.vIndices",face.vIndices);
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
                    currentMaterial = new Material(name);
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
            }
        }
        mtl.complete = true;
        this.material.push(currentMaterial);
    }
}

class MTLDoc {
    complete: boolean;
    materials: Array<Material>;

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

class Material {
    name: string;
    Ka: Color;
    Kd: Color;
    Ks: Color;
    d: number;

    constructor(name: string) {
        this.name = name;
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