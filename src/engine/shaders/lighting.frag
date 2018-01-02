// Computing lighting in world coordinate system.

precision mediump float;

#define MAX_NUM_POINT_LIGHTS 4

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
uniform PointLight uPointLights[MAX_NUM_POINT_LIGHTS];

// Texture and material.
uniform sampler2D uTexture;
uniform Material uMaterial;

varying vec3 vFragPos;
varying vec3 vFragNormal;
varying vec2 vTexCoord;

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraPos);

void main() {

//    texture2D(u_Sampler, v_TexCoord);
    vec3 result = CalPointLight(uPointLights[0], vFragPos, vFragNormal, uCameraPos);

	gl_FragColor = vec4(result, 1.0);
}

vec3 CalPointLight(PointLight light, vec3 fragPos, vec3 fragNormal, vec3 cameraPos){
    // Ambient.
    vec3 ambient = uMaterial.ambient * light.ambient;
    // Diffuse.
    vec3 lightDir = normalize(light.position - vFragPos);
    float diffuseCoeff = clamp(dot(vFragNormal, lightDir), 0.0, 1.0);
    vec3 diffuse =  uMaterial.diffuse * diffuseCoeff * light.diffuse;
    // Specular
    vec3 cameraDir = normalize(uCameraPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, vFragNormal);
    float specularCoeff = pow(clamp(dot(cameraDir, reflectDir), 0.0, 1.0), uMaterial.shininess);
    vec3 specular = uMaterial.specular * specularCoeff * light.specular;
    return (ambient + diffuse + specular);
}