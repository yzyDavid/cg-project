uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aVertexPos_model;

// varying vec3 vFragPos_world;
// varying vec3 vFragNormal;

void main() {
	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos_model, 1.0);

}
