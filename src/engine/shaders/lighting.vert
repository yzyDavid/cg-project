uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelNormalMatrix;

attribute vec3 aVertexPos;     // In model coordinate system.
attribute vec3 aVertexNormal;  // In model coordinate system.
attribute vec2 aTextCoord;

varying vec3 vFragPos;
varying vec3 vFragNormal;
varying vec2 vTexCoord;

void main() {

	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);

    vFragPos = (uModelMatrix * vec4(aVertexPos, 1.0)).xyz;
    vFragNormal = normalize(mat3(uModelNormalMatrix) * aVertexNormal);
    vTexCoord = aTextCoord;
}
