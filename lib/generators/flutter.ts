import type { AnimationSpec, AnimationStep, IconPaths, PathData } from "@/lib/animation-spec";
import type { IconMetadata } from "@/lib/icon-registry";
import {
  DEFAULT_ICON_PROPS,
  type GeneratedFile,
  type GeneratorConfig,
  type GeneratorInput,
  type GeneratorInterface,
  type GeneratorOutput,
  type IconGenerator,
} from "./types";
import {
  componentName,
  DEFAULT_ORIGIN,
  flutterColor,
  flutterCurve,
  isContinuous,
  snakeCase,
  stepValues,
} from "./shared";
import { svgPathToFlutter } from "./flutter-path-parser";

/* -------------------------------------------------------------------------- */
/* Usage snippet (playground code panel)                                      */
/* -------------------------------------------------------------------------- */

function num(value: number): string {
  return Number.isInteger(value) ? `${value}.0` : String(value);
}

/** Generate a copy-ready Flutter widget-call snippet for the playground. */
export function generateFlutterCode(input: GeneratorInput): GeneratorOutput {
  const name = `${componentName(input.slug)}Icon`;
  const file = snakeCase(input.slug);
  const importLine = `import 'package:your_app/icons/${file}_icon.dart';`;

  const args: string[] = [];
  if (input.size !== DEFAULT_ICON_PROPS.size) args.push(`size: ${num(input.size)}`);
  if (input.color !== DEFAULT_ICON_PROPS.color && input.color !== "currentColor") {
    args.push(`color: ${flutterColor(input.color)}`);
  }
  if (input.strokeWidth !== DEFAULT_ICON_PROPS.strokeWidth) {
    args.push(`strokeWidth: ${num(input.strokeWidth)}`);
  }
  if (input.speed !== DEFAULT_ICON_PROPS.speed) args.push(`speed: ${num(input.speed)}`);

  const jsxLine =
    args.length === 0
      ? `${name}()`
      : `${name}(\n${args.map((a) => `  ${a},`).join("\n")}\n)`;

  const code = `${importLine}\n\n// Inside your build method:\n${jsxLine}`;
  return { code, importLine, jsxLine };
}

/** Flutter usage-snippet descriptor for the playground code panel. */
export const flutterUsage: GeneratorInterface = {
  id: "flutter",
  label: "Flutter",
  language: "dart",
  dependencies: "none — uses the Flutter AnimationController.",
  generate: generateFlutterCode,
};

/* -------------------------------------------------------------------------- */
/* Full-source generator (CLI)                                                */
/* -------------------------------------------------------------------------- */

/** lowerCamel field name for a step, e.g. ("minuteHand","rotate") → minuteHandRotate. */
function fieldName(elementKey: string, property: string): string {
  const el = elementKey.replace(/[^a-zA-Z0-9]/g, "");
  return `${el}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
}

/** Build the TweenSequence + CurvedAnimation init for one step. */
function buildAnimationInit(
  field: string,
  step: AnimationStep,
  totalDuration: number,
): string {
  const values = stepValues(step);
  const items =
    values.length === 2
      ? `      TweenSequenceItem(tween: Tween(begin: ${num(values[0])}, end: ${num(values[1])}), weight: 1),`
      : values
          .slice(1)
          .map(
            (v, i) =>
              `      TweenSequenceItem(tween: Tween(begin: ${num(values[i])}, end: ${num(v)}), weight: 1),`,
          )
          .join("\n");

  const delay = step.delay ?? 0;
  const start = totalDuration > 0 ? delay / totalDuration : 0;
  const end = totalDuration > 0 ? (delay + step.duration) / totalDuration : 1;
  const curve =
    start <= 0 && end >= 1
      ? flutterCurve(step.ease)
      : `Interval(${round4(start)}, ${round4(end)}, curve: ${flutterCurve(step.ease)})`;

  return `    _${field} = TweenSequence<double>([
${items}
    ]).animate(CurvedAnimation(parent: _controller, curve: ${curve}));`;
}

function round4(n: number): string {
  return String(Math.round(n * 10000) / 10000);
}

/** Drawing statements for a single element inside the painter. */
function buildPainterElement(
  elementKey: string,
  data: PathData,
  spec: AnimationSpec,
): string {
  const steps = [
    ...(spec.sequences.trigger ?? []),
    ...(spec.sequences.continuous ?? []),
  ].filter((s) => s.element === elementKey);

  const transforms = steps.filter((s) =>
    ["rotate", "scale", "translateX", "translateY"].includes(s.property),
  );
  const opacityStep = steps.find((s) => s.property === "opacity");
  const drawStep = steps.find((s) => s.property === "pathLength");
  const origin = transforms.find((s) => s.origin)?.origin ?? DEFAULT_ORIGIN;

  // Choose the paint (a faded copy when this element animates opacity).
  let paintVar = "paint";
  const lines: string[] = [];
  if (opacityStep) {
    paintVar = `${elementKey}Paint`;
    const field = fieldName(elementKey, "opacity");
    lines.push(
      `    final ${paintVar} = Paint()
      ..color = color.withOpacity(${field})
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;`,
    );
  }

  const hasTransform = transforms.length > 0;
  if (hasTransform) {
    lines.push("    canvas.save();");
    lines.push(`    canvas.translate(${num(origin.x)}, ${num(origin.y)});`);
    for (const t of transforms) {
      const field = fieldName(elementKey, t.property);
      if (t.property === "rotate") {
        lines.push(`    canvas.rotate(${field} * math.pi / 180);`);
      } else if (t.property === "scale") {
        lines.push(`    canvas.scale(${field});`);
      }
    }
    lines.push(`    canvas.translate(${num(-origin.x)}, ${num(-origin.y)});`);
    for (const t of transforms) {
      const field = fieldName(elementKey, t.property);
      if (t.property === "translateX") {
        lines.push(`    canvas.translate(${field}, 0);`);
      } else if (t.property === "translateY") {
        lines.push(`    canvas.translate(0, ${field});`);
      }
    }
  }

  lines.push(...drawShape(elementKey, data, paintVar, drawStep));

  if (hasTransform) lines.push("    canvas.restore();");
  return lines.join("\n");
}

/** Canvas draw calls for a shape, honoring an optional pathLength draw-on. */
function drawShape(
  elementKey: string,
  data: PathData,
  paintVar: string,
  drawStep: AnimationStep | undefined,
): string[] {
  if (data.type === "path") {
    const pathVar = `${elementKey}Path`;
    const stmts = svgPathToFlutter(data.d, pathVar).map((s) => `    ${s}`);
    const decl = [`    final ${pathVar} = Path();`, ...stmts];
    if (drawStep) {
      const field = fieldName(elementKey, "pathLength");
      decl.push(
        `    for (final metric in ${pathVar}.computeMetrics()) {`,
        `      canvas.drawPath(metric.extractPath(0, metric.length * ${field}), ${paintVar});`,
        "    }",
      );
    } else {
      decl.push(`    canvas.drawPath(${pathVar}, ${paintVar});`);
    }
    return decl;
  }
  if (data.type === "circle") {
    return [
      `    canvas.drawCircle(Offset(${num(data.cx)}, ${num(data.cy)}), ${num(data.r)}, ${paintVar});`,
    ];
  }
  if (data.type === "line") {
    return [
      `    canvas.drawLine(Offset(${num(data.x1)}, ${num(data.y1)}), Offset(${num(data.x2)}, ${num(data.y2)}), ${paintVar});`,
    ];
  }
  // polyline
  const pathVar = `${elementKey}Path`;
  const pts = data.points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number));
  const stmts = pts.map(([x, y], i) =>
    i === 0
      ? `    ${pathVar}.moveTo(${num(x)}, ${num(y)});`
      : `    ${pathVar}.lineTo(${num(x)}, ${num(y)});`,
  );
  return [
    `    final ${pathVar} = Path();`,
    ...stmts,
    `    canvas.drawPath(${pathVar}, ${paintVar});`,
  ];
}

/** Full Flutter widget generator: declarative spec → AnimationController. */
export const flutterGenerator: IconGenerator = {
  framework: "flutter",
  displayName: "Flutter",
  fileExtension: "dart",

  generate(
    spec: AnimationSpec,
    paths: IconPaths,
    meta: IconMetadata,
    config?: GeneratorConfig,
  ): GeneratedFile {
    const name = `${componentName(meta.slug)}Icon`;
    const state = `_${name}State`;
    const painter = `_${componentName(meta.slug)}Painter`;
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const colorLiteral =
      p.color && p.color !== "currentColor" ? flutterColor(p.color) : "Colors.black";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const continuous = isContinuous(spec);

    const animSteps = [
      ...(spec.sequences.trigger ?? []),
      ...(spec.sequences.continuous ?? []),
    ];
    const totalDuration = Math.max(
      0.0001,
      ...animSteps.map((s) => (s.delay ?? 0) + s.duration),
    );
    const totalMs = Math.round(totalDuration * 1000);

    // Per-step animation fields.
    const fields = animSteps.map((s) => fieldName(s.element, s.property));
    const fieldDecls = fields
      .map((fld) => `  late Animation<double> _${fld};`)
      .join("\n");
    const inits = animSteps
      .map((s) => buildAnimationInit(fieldName(s.element, s.property), s, totalDuration))
      .join("\n");

    const repeatOrIdle = continuous
      ? "    _controller.repeat();"
      : "    // Call _play() (e.g. on tap) to run the animation.";

    // Painter construction args.
    const painterFieldDecls = fields
      .map((fld) => `  final double ${fld};`)
      .join("\n");
    const painterCtorArgs = ["color", "strokeWidth", ...fields]
      .map((a) => `    required this.${a},`)
      .join("\n");
    const painterCallArgs = [
      "              color: widget.color,",
      "              strokeWidth: widget.strokeWidth,",
      ...fields.map((fld) => `              ${fld}: _${fld}.value,`),
    ].join("\n");
    const shouldRepaint = ["color", "strokeWidth", ...fields]
      .map((a) => `old.${a} != ${a}`)
      .join(" ||\n      ");

    const painterBody = Object.keys(paths)
      .map((key) => buildPainterElement(key, paths[key], spec))
      .join("\n\n");

    const code = `import 'package:flutter/material.dart';
import 'dart:math' as math;

/// ${meta.name} — ${meta.animationDescription}
class ${name} extends StatefulWidget {
  final double size;
  final Color color;
  final double strokeWidth;
  final double speed;

  const ${name}({
    super.key,
    this.size = ${num(size)},
    this.color = ${colorLiteral},
    this.strokeWidth = ${num(strokeWidth)},
    this.speed = 1.0,
  });

  @override
  State<${name}> createState() => ${state}();
}

class ${state} extends State<${name}> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
${fieldDecls}

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: (${totalMs} / widget.speed).round()),
    );
${inits}
${repeatOrIdle}
  }

  void _play() => _controller.forward(from: 0);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _play,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            size: Size(widget.size, widget.size),
            painter: ${painter}(
${painterCallArgs}
            ),
          );
        },
      ),
    );
  }
}

class ${painter} extends CustomPainter {
  final Color color;
  final double strokeWidth;
${painterFieldDecls}

  ${painter}({
${painterCtorArgs}
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.scale(size.width / 24.0);

${painterBody}
  }

  @override
  bool shouldRepaint(${painter} old) =>
      ${shouldRepaint};
}
`;

    const file = snakeCase(meta.slug);
    return {
      code,
      fileExtension: "dart",
      importStatement: `import 'icons/${file}_icon.dart';`,
      usageSnippet: `${name}()`,
      dependencies: "none — uses Flutter AnimationController",
    };
  },
};
