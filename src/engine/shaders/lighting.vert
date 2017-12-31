uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelNormalMatrix;

attribute vec3 aVertexPos_model;
attribute vec3 aVertexNormal_model;

varying vec3 vFragPos_world;
varying vec3 vFragNormal_world;

void main() {

	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos_model, 1.0);

    vFragPos_world = (uModelMatrix * vec4(aVertexPos_model, 1.0)).xyz;
    vFragNormal_world = normalize(mat3(uModelNormalMatrix) * aVertexNormal_model);
}
