precision mediump float;

uniform vec3 uMaterialAmbientColor;
uniform vec3 uMaterialDiffuseColor;
uniform vec3 uMaterialSpecularColor;
uniform float uMaterialShininess;

uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform float uLightAmbientCoeff;

// varying vec3 vVertexNormal;

void main() {

    vec3 ambient = uMaterialAmbientColor * uLightColor;
    vec3 diffuse = uMaterialDiffuseColor;

	gl_FragColor = vec4(ambient + diffuse, 1.0);
//	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}