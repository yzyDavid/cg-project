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
uniform sampler2D uTexture;
uniform Material uMaterial;

varying vec3 vFragPos;
varying vec3 vFragNormal;
varying vec2 vTexCoord;

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraPos);

void main() {

    vec3 cameraDir = normalize(uCameraPos - vFragPos);
    vec3 result = vec3(0.0, 0.0, 0.0);

//    for(int i = 0; i < NR_DIR_LIGHTS; i++){
//        result += CalcDirLight(uDirectLights[i], vFragNormal, cameraDir);
//    }
    for(int i = 0; i < 1; i++){
        result += CalPointLight(uPointLights[i], vFragPos, vFragNormal, cameraDir);
    }

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

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir){
    // Ambient.
    vec3 ambient = uMaterial.ambient * light.ambient;
    // Diffuse.
    vec3 lightDir = normalize(light.position - vFragPos);
    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
    vec3 diffuse =  uMaterial.diffuse * diffuseCoeff * light.diffuse;
    // Specular
    vec3 reflectDir = reflect(-lightDir, vFragNormal);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
    vec3 specular = uMaterial.specular * specularCoeff * light.specular;
    return (ambient + diffuse + specular);
}