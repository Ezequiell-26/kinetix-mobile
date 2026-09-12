// Fragment Shader - Muscle activation with Kinetix branding
precision highp float;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vActivation;

uniform vec3 baseColor;
uniform vec3 activatedColor;
uniform float ambientIntensity;

void main() {
  // Base lighting calculation
  vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
  float diffuse = max(dot(vNormal, lightDir), 0.0);
  
  // Kinetic gradient from base to activated color (Electric Lime #D6FF2A)
  vec3 finalColor = mix(baseColor, activatedColor, vActivation);
  
  // Add subtle energy glow on activated areas
  float glow = pow(vActivation, 3.0) * 0.5;
  finalColor += vec3(0.84, 1.0, 0.16) * glow; // Electric Lime glow
  
  // Apply lighting
  vec3 litColor = finalColor * (ambientIntensity + diffuse * 0.7);
  
  // Add rim lighting for depth
  float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  rim = pow(rim, 3.0) * 0.3;
  litColor += vec3(0.39, 0.4, 0.95) * rim; // Violet rim light
  
  gl_FragColor = vec4(litColor, 1.0);
}
