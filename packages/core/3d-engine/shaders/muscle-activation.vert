// Vertex Shader - Muscle activation visualization
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float activationStrength;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vActivation;

void main() {
  vUv = uv;
  vNormal = normal;
  
  // Kinetic vertex displacement for muscle activation effect
  vec3 newPos = position;
  float activation = sin(uv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
  vActivation = mix(0.0, activation, activationStrength);
  
  newPos += normal * vActivation * 0.02;
  vPosition = newPos;
  
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
}
