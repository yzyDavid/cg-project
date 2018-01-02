uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

attribute vec3 aVertexPos_model;

// varying vec3 vFragPos_world;
// varying vec3 vFragNormal;

void main() {
	gl_Position = uProjection * uView * uModel * vec4(aVertexPos_model, 1.0);

}
