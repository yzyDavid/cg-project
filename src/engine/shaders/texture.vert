attribute vec3 aVertexPosition;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec2 a_TextCoord;
varying vec2 v_TexCoord;

void main() {
	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
	v_TexCoord = a_TextCoord;
}
