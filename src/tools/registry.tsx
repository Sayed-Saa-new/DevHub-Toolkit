import type { ComponentType } from "react";

import { JsonFormatter, Base64Tool, UrlCodec, JwtDecoder, TimestampConverter } from "./converters";
import { UuidGenerator, HashGenerator, QrCodeTool } from "./generators";
import { ColorTool, GradientTool, BoxShadowTool, BorderRadiusTool } from "./design";
import { RegexTester, MarkdownEditor, Playground, SvgOptimizer } from "./editors";
import { HttpStatus, GitCheatsheet, LinuxCheatsheet, VscodeShortcuts } from "./reference";

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-codec": UrlCodec,
  "jwt-decoder": JwtDecoder,
  "timestamp": TimestampConverter,
  "uuid": UuidGenerator,
  "hash": HashGenerator,
  "qrcode": QrCodeTool,
  "color": ColorTool,
  "gradient": GradientTool,
  "box-shadow": BoxShadowTool,
  "border-radius": BorderRadiusTool,
  "regex": RegexTester,
  "markdown": MarkdownEditor,
  "playground": Playground,
  "svg-optimizer": SvgOptimizer,
  "http-status": HttpStatus,
  "git-cheatsheet": GitCheatsheet,
  "linux-cheatsheet": LinuxCheatsheet,
  "vscode-shortcuts": VscodeShortcuts,
};