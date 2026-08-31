import AppKit
import Foundation

guard CommandLine.arguments.count == 5 else {
  fputs("Usage: render-svg <input.svg> <output.png> <width> <height>\n", stderr)
  exit(64)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard
  let width = Int(CommandLine.arguments[3]),
  let height = Int(CommandLine.arguments[4]),
  width > 0,
  height > 0
else {
  fputs("Width and height must be positive integers.\n", stderr)
  exit(64)
}

var renderURL = inputURL
var temporarySVG: URL?

if
  var svg = try? String(contentsOf: inputURL, encoding: .utf8),
  svg.contains("mascot-yunzhou-avatar-v4.png")
{
  let avatarURL = inputURL.deletingLastPathComponent().appendingPathComponent("mascot-yunzhou-avatar-v4.png")
  guard let avatar = try? Data(contentsOf: avatarURL) else {
    fputs("Unable to load SVG image dependency: \(avatarURL.path)\n", stderr)
    exit(66)
  }
  let dataURL = "data:image/png;base64,\(avatar.base64EncodedString())"
  svg = svg.replacingOccurrences(of: "mascot-yunzhou-avatar-v4.png", with: dataURL)
  let temporaryURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("render-svg-\(UUID().uuidString).svg")
  do {
    try svg.write(to: temporaryURL, atomically: true, encoding: .utf8)
  } catch {
    fputs("Unable to prepare SVG for rendering: \(error)\n", stderr)
    exit(74)
  }
  temporarySVG = temporaryURL
  renderURL = temporaryURL
}

defer {
  if let temporarySVG {
    try? FileManager.default.removeItem(at: temporarySVG)
  }
}

guard let source = NSImage(contentsOf: renderURL) else {
  fputs("Unable to load SVG: \(inputURL.path)\n", stderr)
  exit(65)
}

guard let bitmap = NSBitmapImageRep(
  bitmapDataPlanes: nil,
  pixelsWide: width,
  pixelsHigh: height,
  bitsPerSample: 8,
  samplesPerPixel: 4,
  hasAlpha: true,
  isPlanar: false,
  colorSpaceName: .deviceRGB,
  bytesPerRow: 0,
  bitsPerPixel: 0
) else {
  fputs("Unable to allocate bitmap.\n", stderr)
  exit(70)
}

bitmap.size = NSSize(width: width, height: height)
NSGraphicsContext.saveGraphicsState()
guard let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
  fputs("Unable to create graphics context.\n", stderr)
  exit(70)
}
NSGraphicsContext.current = context
context.imageInterpolation = .high
source.draw(
  in: NSRect(x: 0, y: 0, width: width, height: height),
  from: .zero,
  operation: .copy,
  fraction: 1.0,
  respectFlipped: true,
  hints: [.interpolation: NSImageInterpolation.high]
)
context.flushGraphics()
NSGraphicsContext.restoreGraphicsState()

guard let png = bitmap.representation(using: .png, properties: [:]) else {
  fputs("Unable to encode PNG.\n", stderr)
  exit(70)
}

try png.write(to: outputURL, options: .atomic)
