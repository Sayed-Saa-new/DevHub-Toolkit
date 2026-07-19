import type { ComponentType } from "react";

import { JsonFormatter, Base64Tool, UrlCodec, JwtDecoder, TimestampConverter } from "./converters";
import { UuidGenerator, HashGenerator, QrCodeTool } from "./generators";
import { ColorTool, GradientTool, BoxShadowTool, BorderRadiusTool } from "./design";
import { RegexTester, MarkdownEditor, Playground, SvgOptimizer } from "./editors";
import { HttpStatus, GitCheatsheet, LinuxCheatsheet, VscodeShortcuts } from "./reference";
import {
  PasswordGenerator, LoremIpsum, CaseConverter, YamlJsonConverter, CsvJsonConverter,
  NumberBase, TextDiff, TextStats, HtmlEntities, CronExplainer, MetaTagGenerator,
  Slugify, FaviconGenerator, ImageBase64, TimezoneConverter, StringEscape,
} from "./extras";
import {
  AiExplainer, AiOptimizer, AiCommit,
  AiSql, AiConvert, AiErrorExplainer, AiRegex, AiTests,
} from "./ai";
import { SchemaValidator } from "./schema-validator";
import { JsonToTs } from "./json-to-ts";
import { MockData } from "./mock-data";
import { CurlConverter } from "./curl-converter";
import { SqlFormatter } from "./sql-formatter";
import { JsonDiff } from "./json-diff";
import { ClampCalculator } from "./clamp-calculator";
import { ImageCompressor } from "./image-compressor";

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
  "password": PasswordGenerator,
  "lorem": LoremIpsum,
  "case-converter": CaseConverter,
  "yaml-json": YamlJsonConverter,
  "csv-json": CsvJsonConverter,
  "number-base": NumberBase,
  "text-diff": TextDiff,
  "text-stats": TextStats,
  "html-entities": HtmlEntities,
  "cron": CronExplainer,
  "meta-tags": MetaTagGenerator,
  "slugify": Slugify,
  "favicon": FaviconGenerator,
  "image-base64": ImageBase64,
  "timezone": TimezoneConverter,
  "string-escape": StringEscape,
  "schema-validator": SchemaValidator,
  "json-to-ts": JsonToTs,
  "mock-data": MockData,
  "curl-converter": CurlConverter,
  "sql-formatter": SqlFormatter,
  "json-diff": JsonDiff,
  "clamp-calculator": ClampCalculator,
  "image-compressor": ImageCompressor,
  "ai-explainer": AiExplainer,
  "ai-optimizer": AiOptimizer,
  "ai-commit": AiCommit,
  "ai-sql": AiSql,
  "ai-convert": AiConvert,
  "ai-error": AiErrorExplainer,
  "ai-regex": AiRegex,
  "ai-tests": AiTests,
};