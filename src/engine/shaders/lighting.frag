precision mediump float;

uniform vec3 uCameraPos_world;

uniform vec3 uLightPos_world;
uniform vec3 uLightColor;
uniform float uLightAmbientCoeff;

uniform vec3 uMaterialAmbientColor;
uniform vec3 uMaterialDiffuseColor;
uniform vec3 uMaterialSpecularColor;
uniform float uMaterialShininess;

varying vec3 vFragPos_world;
varying vec3 vFragNormal_world;

void main() {

    // Ambient.
    vec3 ambient = uMaterialAmbientColor * uLightColor * uLightAmbientCoeff;

    // Diffuse.
    vec3 fragLightDir = normalize(uLightPos_world - vFragPos_world);
    float diffuseCoeff = clamp(dot(vFragNormal_world, fragLightDir), 0.0, 1.0);
    vec3 diffuse =  uMaterialDiffuseColor * diffuseCoeff * uLightColor;

    // Specular
    vec3 cameraDir = normalize(uCameraPos_world - vFragPos_world);
    vec3 reflectDir = reflect(-fragLightDir, vFragNormal_world);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterialShininess);
    vec3 specular = uMaterialSpecularColor * specularCoeff * uLightColor;

	gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
//    gl_FragColor = vec4(diffuse, 1.0);
//    gl_FragColor = vec4(ambient, 1.0);
//    gl_FragColor = vec4(specular, 1.0);
}
