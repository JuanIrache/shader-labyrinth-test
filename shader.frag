#ifdef GL_ES
precision highp float;
#endif

varying highp vec2 vTexCoord;

uniform highp sampler2D uFrame;
uniform highp vec2 uRes;

bool isRed(vec4 frag) {
    return (frag.r > 0.0) && all(equal(frag.gb, vec2(0.0,0.0)));
}

bool isBlue(vec4 frag) {
    return (frag.b > 0.0) && all(equal(frag.rg, vec2(0.0,0.0)));
}

bool isGreen(vec4 frag) {
    return (frag.g > 0.0) && all(equal(frag.rb, vec2(0.0,0.0)));
}

bool isBlack(vec4 frag) {
    return all(equal(frag.rgb, vec3(0.0,0.0,0.0)));
}

void main() {
  highp vec2 fragStep = vec2(1.0,1.0)/uRes;
  highp float colStep = 1.0 / (uRes.x * uRes.y);
  highp vec4 current = texture2D(uFrame, vTexCoord);

    if (isGreen(current)) {
        gl_FragColor = current;
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
              if (x != 0 || y != 0) {
                 highp vec4 neighborColor = texture2D(uFrame, vTexCoord + fragStep * vec2(x,y));
                 if (isRed(neighborColor) || isBlue(neighborColor)) {
                     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
                     break;
                 }
              }
            }
        }
    } else if (isRed(current)) {
        gl_FragColor = current;
        for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
                if (x != 0 || y != 0) {
                    highp vec4 neighborColor = texture2D(uFrame, vTexCoord + fragStep * vec2(x,y));
                    if (isGreen(neighborColor)) {
                        bool best = true;
                        for (int xx = -1; xx <= 1; xx++) {
                            for (int yy = -1; yy <= 1; yy++) {
                                if (xx != 0 || yy != 0) {
                                    highp vec4 candidate = texture2D(uFrame, vTexCoord + fragStep * vec2(x+xx,y+yy));
                                    if ((isRed(candidate) && candidate.r > current.r)) {
                                        best = false;
                                        break;
                                }
                            }
                        }
                      }
                    if (best) {
                        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
                    }
                }
            }
        }
      }
  } else if (isBlack(current)) {
      for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            if (x != 0 || y != 0) {
                highp vec4 neighborColor = texture2D(uFrame, vTexCoord + fragStep * vec2(x,y));
                if (isRed(neighborColor)) {
                    gl_FragColor = vec4(neighborColor.x-colStep, 0.0, 0.0, 1.0);
                    break;
                }
            }
        }
      }
  } else gl_FragColor = current;
}