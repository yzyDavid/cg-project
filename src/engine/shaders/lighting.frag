// Computing lighting in world coordinate system.

precision mediump float;

#define NUM_DIR_LIGHTS 4
#define NUM_POINT_LIGHTS 4

struct DirectLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct PointLight {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

// Camera.
uniform vec3 uCameraPos;

// Lights.
uniform DirectLight uDirectLights[NUM_DIR_LIGHTS];
uniform PointLight uPointLights[NUM_POINT_LIGHTS];

// Texture and material.
//uniform sampler2D uTexture;
uniform Material uMaterial;

varying vec3 vFragPos;
varying vec3 vFragNormal;
varying vec2 vTexCoord;
uniform sampler2D u_Sampler;

uniform float hasText;
uniform float hasAmbientColor;
uniform float hasDiffuseColor;
uniform float hasSpecularColor;

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraPos,vec3 TextColor);

void main() {

    vec3 cameraDir = normalize(uCameraPos - vFragPos);

//    vec3 result = vec3(0.0, 0.0, 0.0);

//    for(int i = 0; i < NR_DIR_LIGHTS; i++){
//        result += CalcDirLight(dirLight[i], norm, viewDir);
//    }
//    for(int i = 0; i < NR_POINT_LIGHTS; i++){
//        result += CalcPointLight(pointLight[i], norm, FragPos, viewDir);
//        //result += CalcSpotLight(spotLight[i], norm, FragPos, viewDir);
//    }
    vec3 TextColor;
    if (hasText==-1.0) TextColor=uMaterial.ambient; else TextColor= vec3(texture2D(u_Sampler, vTexCoord));
    vec3 result = CalPointLight(uPointLights[0], vFragPos, vFragNormal, cameraDir,TextColor);

	gl_FragColor = vec4(result, 1.0);
}

//vec3 CalDirLight(DirectLight light, vec3 fragNormal, vec3 cameraDir){
//    // Ambient.
//    vec3 ambient = uMaterial.ambient * light.ambient;
//    // Diffuse.
//    vec3 lightDir = normalize(-light.direction);
//    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
//    vec3 diffuse =  uMaterial.diffuse * diffuseCoeff * light.diffuse;
//    // Specular
//    vec3 reflectDir = reflect(-lightDir, vFragNormal);
//    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
//    vec3 specular = uMaterial.specular * specularCoeff * light.specular;
//    return (ambient + diffuse + specular);
//}

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir,vec3 TextColor){
    vec3 AmbientColor=uMaterial.ambient;
    vec3 DiffuseColor= uMaterial.diffuse;
    vec3 SpecularColor=uMaterial.specular;

    if (hasAmbientColor==-1.0) AmbientColor=TextColor;
    if (hasDiffuseColor==-1.0) DiffuseColor=TextColor;
    if (hasDiffuseColor==-1.0) SpecularColor=vec3(1,1,1);

    // Ambient.
    vec3 ambient = AmbientColor * light.ambient;
    // Diffuse.
    vec3 lightDir = normalize(light.position - vFragPos);
    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
    vec3 diffuse =  DiffuseColor * diffuseCoeff * light.diffuse;
    // Specular
    vec3 reflectDir = reflect(-lightDir, vFragNormal);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
    vec3 specular = SpecularColor * specularCoeff * light.specular;
    return (ambient + diffuse + specular)*0.3+TextColor*0.7;
}