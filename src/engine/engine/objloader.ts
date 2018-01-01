import GeometryObject from './geometryobject';
import * as contentText from '../../module/cube.obj';

export default class ObjLoader {
    protected vertices: Vertex[] = [];
    protected normals: Normal[] = [];
    protected scale: number;
    protected reverse: boolean;
    protected textureVt: VTertex[] = [];
    protected object: Face[] = [];

    constructor(filename: string, scale: number, reverse: boolean) {
        this.scale = scale;
        this.reverse = reverse;
        const content = <string>(contentText as any);
        console.log("content", content);
        this.OBJDocparser(content);
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
        const vset: number[] = [];
        var numv = 0;
        var indices: number[] = [];
        var positions: number[] = [];

        function findv(faceset: { [p: number]: number }, v: number) {
            var value: any;
            for (value in faceset) {
                if (value == v) return true;
            }
            return false;
        }

        for (let entry of this.object) {
            let faceset: { [key: number]: number; } = {};
            for (let v of entry.vIndices) {
                if (vset.indexOf(v) != -1) {
                    if (!findv(faceset, v)) {
                        positions.push(this.vertices[v].x);
                        positions.push(this.vertices[v].y);
                        positions.push(this.vertices[v].z);
                        indices.push(numv);
                        faceset[v] = numv;
                        numv = numv + 1;
                    }
                    else {
                        indices.push(faceset[v]);
                    }
                }
                else {
                    positions.push(this.vertices[v].x);
                    positions.push(this.vertices[v].y);
                    positions.push(this.vertices[v].z);
                    indices.push(v);
                    faceset[v] = numv;
                    numv = numv + 1;
                    vset.push(v);
                }
            }
        }
        return new GeometryObject([0.0, 0.0, 0.0], positions, indices, colors);
    }

    protected OBJDocparser(content: string) {
        var lines = content.split("\n");
        lines.push(null); // Append null
        var tempIndex = 0;    // Initialize index of line

        //var currentObject = null;//理解为一个代号?
        var currentMaterialName = "";
        //var ifmtl=false;

        // Parse line by line
        var line;         // A string in the line to be parsed
        var sp: StringParser;  // Create StringParser
        sp = new StringParser();

        while ((line = lines[tempIndex++]) != null) {
            console.debug(line);
            sp.init(line);                  // init StringParser
            var command = sp.getWord();     // Get command
            if (command == null) continue;  // check null command

            switch (command) {
                case '#':
                    continue;  // Skip comments
                // case 'mtllib':
                //     ifmtl=true;// Read Material chunk
                //     var path = parseMtllib(sp, this.fileName);
                //     var mtl = new MTLDoc();   // Create MTL instance
                //     this.mtls.push(mtl);
                //     console.log(this.mtls,":this.mtls",modelObject[index].mtls);
                //     var request = new XMLHttpRequest();
                //     request.onreadystatechange = function() {
                //         if (request.readyState == 4) {
                //             if (request.status != 404) {
                //                 onReadMTLFile(request.responseText, mtl, modelObject, index, mtlArray);
                //             }else{
                //                 mtlArray[index]=!modelObject[index].mtls.some(function(x){return !x});
                //                 console.log("need a mtlib, but there is none",mtlArray[index]);
                //                 mtl.complete = true;
                //             }
                //         }
                //     };
                //     request.onerror=function(error){
                //         console.log(error);
                //     };
                //     request.ontimeout=function(error){
                //         console.log("timeout",error);
                //     };
                //     request.open('GET', path, true);  // Create a request to acquire the file
                //     request.send();
                //     continue; // Go to the next line
                // case 'o':
                // case 'g':   // Read Object name
                //     var object = parseObjectName(sp);
                //     this.objects.push(object);
                //     currentObject = object;
                //     //这是一个浅复制，可以简单地认为和object指向同一块内容
                //     continue; // Go to the next line
                case 'v':   // Read vertex
                    var vertex = this.parseVertex(sp, this.scale);
                    this.vertices.push(vertex);
                    continue; // Go to the next line
                case 'vn':   // Read normal
                    var normal = this.parseNormal(sp);
                    this.normals.push(normal);
                    continue; // Go to the next line
                // case 'usemtl': // Read Material name
                //     currentMaterialName = parseUsemtl(sp);
                //     continue; // Go to the next line
                case 'f': // Read face
                    var face = this.parseFace(sp, currentMaterialName, this.vertices, this.textureVt, this.normals, this.reverse);
                    this.object.push(face);
                    continue; // Go to the next line
                // case 'vt':
                //     var VTvertex = parseVTertex(sp,1);
                //     this.textureVt.push(VTvertex);
                //     continue;
                default:
                    continue;
            }
        }
        //objArray[index]=true;
        //if(!ifmtl)mtlArray[index]=true;
        return true;
    }

    parseVertex = function (sp: StringParser, scale: number) {
        var x = sp.getFloat() * scale;
        var y = sp.getFloat() * scale;
        var z = sp.getFloat() * scale;
        return (new Vertex(x, y, z));
    }

    parseNormal = function (sp: StringParser) {
        var x = sp.getFloat();
        var y = sp.getFloat();
        var z = sp.getFloat();
        return (new Normal(x, y, z));
    }

    parseFace = function (sp: StringParser, materialName: string, vertices: Vertex[], textureVt: VTertex[], Normals: Normal[], reverse: boolean) {
        var face = new Face(materialName);
        // get indices
        for (; ;) {
            var word = sp.getWord();
            if (!word || !word.replace(/^\s+|\s+$/g, "")) break;
            var subWords;
            subWords = word.split('/');

            if (subWords.length >= 1) {
                var vi = parseInt(subWords[0]) < 0 ? vertices.length + parseInt(subWords[0]) : parseInt(subWords[0]) - 1;
                //if(iiii<4)console.log(vi,"vi",parseInt(subWords[0]),subWords,word,(word.replace( /^\s+|\s+$/g, "" )));
                face.vIndices.push(vi);
            }
            if (subWords.length >= 2) {
                if (subWords[1]) {
                    var ti = parseInt(subWords[1]) < 0 ? textureVt.length + parseInt(subWords[1]) : parseInt(subWords[1]) - 1;
                    face.tIndices.push(ti);
                }
            }
            if (subWords.length >= 3) {
                var ni = parseInt(subWords[2]) < 0 ? Normals.length + parseInt(subWords[2]) : parseInt(subWords[2]) - 1;
                face.nIndices.push(ni);
            } else {
                face.nIndices.push(-1);
            }
        }
        //if(iiii<4)console.log(face.vIndices,"face.vIndices",vertices[face.vIndices[0]],vertices[face.vIndices[1]],vertices[face.vIndices[2]]);

        // calc normal
        // console.log(vertices,face.vIndices[0],face.vIndices[1],face.vIndices[2]);
        var v0 = [
            vertices[face.vIndices[0]].x,
            vertices[face.vIndices[0]].y,
            vertices[face.vIndices[0]].z];
        var v1 = [
            vertices[face.vIndices[1]].x,
            vertices[face.vIndices[1]].y,
            vertices[face.vIndices[1]].z];
        var v2 = [
            vertices[face.vIndices[2]].x,
            vertices[face.vIndices[2]].y,
            vertices[face.vIndices[2]].z];

        //这个其实没有什么用，留着以后删除吧
        var t1, t2, t3;

        if (face.tIndices.length >= 3) {
            if (!textureVt[face.tIndices[0]]) {
                console.log("textureVt.length:", textureVt.length, "face.tIndices[0]", face.tIndices, "face.tIndices.length", face.tIndices.length);
                throw("hhhh");
            }
            t1 = [
                textureVt[face.tIndices[0]].x,
                textureVt[face.tIndices[0]].y];
            t2 = [
                textureVt[face.tIndices[1]].x,
                textureVt[face.tIndices[1]].y];
            t3 = [
                textureVt[face.tIndices[2]].x,
                textureVt[face.tIndices[2]].y];
        }
        // 计算法向量
        var normal = this.calcNormal(v0, v1, v2);
        // 法線が正しく求められたか調べる
        if (normal == null) {
            if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
                var v3 = [
                    vertices[face.vIndices[3]].x,
                    vertices[face.vIndices[3]].y,
                    vertices[face.vIndices[3]].z];
                normal = this.calcNormal(v1, v2, v3);
            }
            if (normal == null) {         // 法線が求められなかったのでY軸方向の法線とする
                normal = [0.0, 1.0, 0.0];
            }
        }
        if (reverse) {
            normal[0] = -normal[0];
            normal[1] = -normal[1];
            normal[2] = -normal[2];
        }
        face.normal = new Normal(normal[0], normal[1], normal[2]);
        face.textureVt = [t1, t2, t3];

        // Devide to triangles if face contains over 3 points.
        if (face.vIndices.length > 3) {
            var n = face.vIndices.length - 2;
            var newVIndices = new Array(n * 3);
            var newNIndices = new Array(n * 3);
            var newTIndices = new Array(n * 3);
            for (var i = 0; i < n; i++) {
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

        //iiii++;

        return face;
    }

    calcNormal = function (p0: number[], p1: number[], p2: number[]) {
        // v0: a vector from p1 to p0, v1; a vector from p1 to p2
        var v0 = new Float32Array(3);
        var v1 = new Float32Array(3);
        for (var i = 0; i < 3; i++) {
            v0[i] = p0[i] - p1[i];
            v1[i] = p2[i] - p1[i];
        }

        // The cross product of v0 and v1
        var c = new Float32Array(3);
        c[0] = v0[1] * v1[2] - v0[2] * v1[1];
        c[1] = v0[2] * v1[0] - v0[0] * v1[2];
        c[2] = v0[0] * v1[1] - v0[1] * v1[0];

        // Normalize the result
        var v = new Vector3(c);
        v.normalize();
        return v.elements;
    }
}

class Face {
    materialName: string;
    vIndices: number[];
    nIndices: number[];
    tIndices: number[];
    normal: Normal;
    textureVt: number[][];
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
        var v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
            v[2] = opt_src[2];
        }
        this.elements = v;
    }

    normalize = function () {
        var v = this.elements;
        var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
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
}

class VTertex {
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
}

class StringParser {
    str: string;
    index: number;

    constructor() {
        this.str = null;   // Store the string specified by the argument
        this.index = 0; // Position in the string to be processed
        // this.init(str);
    }

    init = function (str: string) {
        this.str = str;
        this.index = 0;
    }

    getWordLength = function (str: string, start: number) {
        var n = 0;
        for (var i = start, len = str.length; i < len; i++) {
            var c = str.charAt(i);
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
                break;
        }
        return i - start;
    }

    skipDelimiters = function () {
        for (var i = this.index, len = this.str.length; i < len; i++) {
            var c = this.str.charAt(i);
            // Skip TAB, Space, '(', ')
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
            break;
        }
        this.index = i;
    }

    getWord = function () {
        this.skipDelimiters();
        var n = this.getWordLength(this.str, this.index);
        if (n == 0) return null;
        var word = this.str.substr(this.index, n);
        this.index += (n + 1);

        return word;
    }

    skipToNextWord = function () {
        this.skipDelimiters();
        var n = this.getWordLength(this.str, this.index);
        this.index += (n + 1);
    }

    getInt = function () {
        return parseInt(this.getWord());
    }

    getFloat = function () {
        return parseFloat(this.getWord());
    }
}