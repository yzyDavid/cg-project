#version 100

precision mediump float;

#define NUM_DIR_LIGHTS 4
#define NUM_POINT_LIGHTS 4

struct DirectLight {
    vec3 direction;
    vec3 color;
    float ambientCoeff;
};

struct PointLight {
    vec3 position;
    vec3 color;
    float ambientCoeff;
};

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    float useDiffuseMap;  // 0.0 for false, 1.0 for true.
    sampler2D diffuseMap;
};

// Camera.
uniform vec3 uCameraPos;

// Lights.
uniform DirectLight uDirectLights[NUM_DIR_LIGHTS];
uniform PointLight uPointLights[NUM_POINT_LIGHTS];

// Material.
uniform Material uMaterial;

// Varyings.
varying vec3 vFragPos;
varying vec3 vFragNormal;
varying vec2 vFragTexCoord;

// Globals.
vec3 materialAmbient;
vec3 materialDiffuse;

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraPos);

void main() {

    vec3 cameraDir = normalize(uCameraPos - vFragPos);
    if (uMaterial.useDiffuseMap > 0.5) {
        materialAmbient = materialDiffuse = texture2D(uMaterial.diffuseMap, vFragTexCoord).rgb;
    } else {
        materialAmbient = uMaterial.ambient;
        materialDiffuse = uMaterial.ambient;
    }

    vec3 result = CalPointLight(uPointLights[0], vFragPos, vFragNormal, cameraDir);
	gl_FragColor = vec4(result, 1.0);
}

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir){
    // Ambient.
    vec3 ambient = light.ambientCoeff * materialAmbient * light.color;
    // Diffuse.
    vec3 lightDir = normalize(light.position - vFragPos);
    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
    vec3 diffuse =  diffuseCoeff * materialDiffuse * light.color;
    // Specular
    vec3 reflectDir = reflect(-lightDir, vFragNormal);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
    vec3 specular = specularCoeff * uMaterial.specular * light.color;
    return ambient + diffuse + specular;
}