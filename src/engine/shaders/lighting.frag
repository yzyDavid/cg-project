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

uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {

    //TODO:如果不存在材质设定
    vec3 TextColor = vec3(texture2D(u_Sampler, v_TexCoord));
    //vec3 AmbientColor = (uMaterialAmbientColor + TextColor);
    //vec3 DiffuseColor = (uMaterialDiffuseColor + TextColor);
    vec3 AmbientColor=uMaterialAmbientColor;
    vec3 DiffuseColor=uMaterialDiffuseColor;

    // Ambient.
    vec3 ambient = AmbientColor * uLightColor * uLightAmbientCoeff;

    // Diffuse.
    vec3 fragLightDir = normalize(uLightPos_world - vFragPos_world);
    float diffuseCoeff = clamp(dot(vFragNormal_world, fragLightDir), 0.0, 1.0);
    vec3 diffuse =  uMaterialDiffuseColor * diffuseCoeff * uLightColor;

    // Specular
    vec3 cameraDir = normalize(uCameraPos_world - vFragPos_world);
    vec3 reflectDir = reflect(-fragLightDir, vFragNormal_world);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterialShininess);
    vec3 specular = DiffuseColor * specularCoeff * uLightColor;

	gl_FragColor = vec4((ambient + diffuse + specular)*0.3+0.7*TextColor, 1.0);
//    gl_FragColor = vec4(diffuse, 1.0);
//    gl_FragColor = vec4(ambient, 1.0);
//    gl_FragColor = vec4(specular, 1.0);
}
