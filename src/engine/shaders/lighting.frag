#version 100

precision mediump float;

#define NUM_DIRECT_LIGHTS 4
#define NUM_POINT_LIGHTS 4

struct DirectLight {
    float valid;
    vec3 direction;
    vec3 color;
    float ambientCoeff;
};

struct PointLight {
    float valid;  // 0.0 for false, 1.0 for true.
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
uniform DirectLight uDirectLights[NUM_DIRECT_LIGHTS];
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
vec3 CalDirectLight(DirectLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir);

void main() {

    vec3 cameraDir = normalize(uCameraPos - vFragPos);
    if (uMaterial.useDiffuseMap > 0.5) {
        materialAmbient = materialDiffuse = texture2D(uMaterial.diffuseMap, vFragTexCoord).rgb;
    } else {
        materialAmbient = uMaterial.ambient;
        materialDiffuse = uMaterial.ambient;
    }

	vec3 result = vec3(0.0, 0.0, 0.0);

    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
    	if (uPointLights[i].valid > 0.5) {
    		result += CalPointLight(uPointLights[i], vFragPos, vFragNormal, cameraDir);
    	}
    }

    for (int i = 0; i < NUM_DIRECT_LIGHTS; i++) {
        if (uDirectLights[i].valid == 1.0) {
            result += CalDirectLight(uDirectLights[i], vFragPos, vFragNormal, cameraDir);
        }
    }

	gl_FragColor = vec4(result, 1.0);
}

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir) {
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

vec3 CalDirectLight(DirectLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraDir) {
    // Ambient.
    vec3 ambient = light.ambientCoeff * materialAmbient * light.color;
    // Diffuse.
    vec3 lightDir = normalize(-light.direction);
    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
    vec3 diffuse =  diffuseCoeff * materialDiffuse * light.color;
    // Specular
    vec3 reflectDir = reflect(-lightDir, vFragNormal);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
    vec3 specular = specularCoeff * uMaterial.specular * light.color;
    return ambient + diffuse + specular;
}