#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
vTexCoord = aTexCoord;

vec4 positionVec4 = vec4(aPosition, 1.0);
positionVec4.x = positionVec4.x * 2.0 - 1.0;
positionVec4.y = 1.0 - positionVec4.y * 2.0;

gl_Position = positionVec4;
}