precision mediump float;

uniform vec3 uCameraPos_world;

uniform vec3 uLightPos_world;
uniform vec3 uLightColor;
uniform float uLightAmbientCoeff;

uniform float hasText;
uniform float hasAmbientColor;
uniform float hasDiffuseColor;
uniform float hasSpecularColor;

uniform vec3 uMaterialAmbientColor;
uniform vec3 uMaterialDiffuseColor;
uniform vec3 uMaterialSpecularColor;
uniform float uMaterialShininess;

varying vec3 vFragPos_world;
varying vec3 vFragNormal_world;

uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    vec3 AmbientColor=uMaterialAmbientColor;
    vec3 DiffuseColor=uMaterialDiffuseColor;
    vec3 SpecularColor=uMaterialSpecularColor;
    vec3 TextColor;
    if (hasText==-1.0) TextColor=AmbientColor; else TextColor= vec3(texture2D(u_Sampler, v_TexCoord));
    if (hasAmbientColor==-1.0) AmbientColor=TextColor;
    if (hasDiffuseColor==-1.0) DiffuseColor=TextColor;
    if (hasDiffuseColor==-1.0) SpecularColor=vec3(1,1,1);

    // Ambient.
    vec3 ambient = AmbientColor * uLightColor * uLightAmbientCoeff;

    // Diffuse.
    vec3 fragLightDir = normalize(uLightPos_world - vFragPos_world);
    float diffuseCoeff = clamp(dot(vFragNormal_world, fragLightDir), 0.0, 1.0);
    vec3 diffuse =  DiffuseColor * diffuseCoeff * uLightColor;

    // Specular
    vec3 cameraDir = normalize(uCameraPos_world - vFragPos_world);
    vec3 reflectDir = reflect(-fragLightDir, vFragNormal_world);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterialShininess);
    vec3 specular = SpecularColor * specularCoeff * uLightColor;

	gl_FragColor = vec4((ambient + diffuse)*0.3+0.7*TextColor + specular, 1.0);

}
