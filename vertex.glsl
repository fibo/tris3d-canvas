attribute vec3 coords;
uniform mat4 modelview;
uniform mat4 projection;
uniform bool lit;
uniform vec3 normal;
uniform mat3 normalMatrix;
uniform vec4 color;
varying vec4 vColor;

void main() {
	vec4 coords = vec4(coords,1.0);
	vec4 transformedVertex = modelview * coords;
	gl_Position = projection * transformedVertex;

	if (lit) {
		vec3 unitNormal = normalize(normalMatrix*normal);
		float multiplier = abs(unitNormal.z);
		vColor = vec4( multiplier*color.r, multiplier*color.g, multiplier*color.b, color.a );
}
	else {
	vColor = color;
	}
}
