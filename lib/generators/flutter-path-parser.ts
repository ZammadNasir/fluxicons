import { roundTo } from "@/lib/utils";

/**
 * A minimal SVG path parser that converts a `d` attribute into Flutter
 * `Path` Canvas API calls. Handles M, L, H, V, C, S, Q, T, A, Z (both absolute
 * and relative forms) — relative commands are normalized to absolute.
 */

interface SubCommand {
  cmd: string;
  args: number[];
}

const ARG_COUNT: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

/** Tokenize a path string into a flat list of absolute/relative commands. */
function parseCommands(d: string): SubCommand[] {
  const out: SubCommand[] = [];
  const n = d.length;
  let i = 0;

  const isCmd = (c: string) => /[a-zA-Z]/.test(c);
  const skipSep = () => {
    while (i < n && /[\s,]/.test(d[i])) i++;
  };
  const readNumber = (): number => {
    skipSep();
    const start = i;
    if (d[i] === "+" || d[i] === "-") i++;
    while (i < n && /[0-9]/.test(d[i])) i++;
    if (d[i] === ".") {
      i++;
      while (i < n && /[0-9]/.test(d[i])) i++;
    }
    if (d[i] === "e" || d[i] === "E") {
      i++;
      if (d[i] === "+" || d[i] === "-") i++;
      while (i < n && /[0-9]/.test(d[i])) i++;
    }
    return parseFloat(d.slice(start, i));
  };
  const readFlag = (): number => {
    skipSep();
    const c = d[i];
    i++;
    return c === "1" ? 1 : 0;
  };

  let lastCmd = "";
  while (i < n) {
    skipSep();
    if (i >= n) break;

    let cmd: string;
    if (isCmd(d[i])) {
      cmd = d[i];
      i++;
    } else {
      // Implicit repeat: extra coords after M/m become L/l.
      if (!lastCmd) break;
      cmd = lastCmd === "M" ? "L" : lastCmd === "m" ? "l" : lastCmd;
    }

    const up = cmd.toUpperCase();
    if (up === "Z") {
      out.push({ cmd, args: [] });
    } else if (up === "A") {
      const rx = readNumber();
      const ry = readNumber();
      const rot = readNumber();
      const large = readFlag();
      const sweep = readFlag();
      const x = readNumber();
      const y = readNumber();
      out.push({ cmd, args: [rx, ry, rot, large, sweep, x, y] });
    } else {
      const args: number[] = [];
      for (let k = 0; k < ARG_COUNT[up]; k++) args.push(readNumber());
      out.push({ cmd, args });
    }
    lastCmd = cmd;
  }
  return out;
}

/** Format a number for Dart source (integers stay integral, else 4 dp). */
function f(value: number): string {
  return Number.isInteger(value) ? String(value) : String(roundTo(value, 4));
}

/**
 * Convert an SVG path `d` string into Flutter `Path` statements.
 * @param d the SVG path data
 * @param pathVar the Dart variable name of the `Path` (default "path")
 */
export function svgPathToFlutter(d: string, pathVar = "path"): string[] {
  const commands = parseCommands(d);
  const out: string[] = [];

  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let prevCtrlX = 0;
  let prevCtrlY = 0;
  let prevUp = "";

  for (const { cmd, args } of commands) {
    const rel = cmd === cmd.toLowerCase() && cmd !== cmd.toUpperCase();
    const up = cmd.toUpperCase();

    switch (up) {
      case "M": {
        let [x, y] = args;
        if (rel) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        sx = x;
        sy = y;
        out.push(`${pathVar}.moveTo(${f(x)}, ${f(y)});`);
        break;
      }
      case "L": {
        let [x, y] = args;
        if (rel) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        out.push(`${pathVar}.lineTo(${f(x)}, ${f(y)});`);
        break;
      }
      case "H": {
        let x = args[0];
        if (rel) x += cx;
        cx = x;
        out.push(`${pathVar}.lineTo(${f(cx)}, ${f(cy)});`);
        break;
      }
      case "V": {
        let y = args[0];
        if (rel) y += cy;
        cy = y;
        out.push(`${pathVar}.lineTo(${f(cx)}, ${f(cy)});`);
        break;
      }
      case "C": {
        let [x1, y1, x2, y2, x, y] = args;
        if (rel) {
          x1 += cx;
          y1 += cy;
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        out.push(
          `${pathVar}.cubicTo(${f(x1)}, ${f(y1)}, ${f(x2)}, ${f(y2)}, ${f(x)}, ${f(y)});`,
        );
        prevCtrlX = x2;
        prevCtrlY = y2;
        cx = x;
        cy = y;
        break;
      }
      case "S": {
        let [x2, y2, x, y] = args;
        if (rel) {
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        const reflect = prevUp === "C" || prevUp === "S";
        const x1 = reflect ? 2 * cx - prevCtrlX : cx;
        const y1 = reflect ? 2 * cy - prevCtrlY : cy;
        out.push(
          `${pathVar}.cubicTo(${f(x1)}, ${f(y1)}, ${f(x2)}, ${f(y2)}, ${f(x)}, ${f(y)});`,
        );
        prevCtrlX = x2;
        prevCtrlY = y2;
        cx = x;
        cy = y;
        break;
      }
      case "Q": {
        let [x1, y1, x, y] = args;
        if (rel) {
          x1 += cx;
          y1 += cy;
          x += cx;
          y += cy;
        }
        out.push(
          `${pathVar}.quadraticBezierTo(${f(x1)}, ${f(y1)}, ${f(x)}, ${f(y)});`,
        );
        prevCtrlX = x1;
        prevCtrlY = y1;
        cx = x;
        cy = y;
        break;
      }
      case "T": {
        let [x, y] = args;
        if (rel) {
          x += cx;
          y += cy;
        }
        const reflect = prevUp === "Q" || prevUp === "T";
        const x1 = reflect ? 2 * cx - prevCtrlX : cx;
        const y1 = reflect ? 2 * cy - prevCtrlY : cy;
        out.push(
          `${pathVar}.quadraticBezierTo(${f(x1)}, ${f(y1)}, ${f(x)}, ${f(y)});`,
        );
        prevCtrlX = x1;
        prevCtrlY = y1;
        cx = x;
        cy = y;
        break;
      }
      case "A": {
        const [rx, ry, rot, large, sweep] = args;
        let x = args[5];
        let y = args[6];
        if (rel) {
          x += cx;
          y += cy;
        }
        const rad = (rot * Math.PI) / 180;
        out.push(
          `${pathVar}.arcToPoint(Offset(${f(x)}, ${f(y)}), ` +
            `radius: Radius.elliptical(${f(rx)}, ${f(ry)}), ` +
            `rotation: ${f(rad)}, largeArc: ${large ? "true" : "false"}, ` +
            `clockwise: ${sweep ? "true" : "false"});`,
        );
        cx = x;
        cy = y;
        break;
      }
      case "Z": {
        out.push(`${pathVar}.close();`);
        cx = sx;
        cy = sy;
        break;
      }
    }
    prevUp = up;
  }

  return out;
}
