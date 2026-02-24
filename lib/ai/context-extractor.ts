/**
 * Context Extraction for AI
 * Extracts meaningful context from Monaco editor
 */

export interface CodeContext {
  // Current file
  filename: string;
  language: string;
  fullCode: string;
  
  // Cursor position
  cursorLine: number;
  cursorColumn: number;
  
  // Extracted context
  currentFunction?: FunctionInfo;
  currentClass?: ClassInfo;
  
  // Surrounding context
  linesBefore: string[];
  linesAfter: string[];
  
  // Imports
  imports: string[];
  
  // Selected text
  selectedText?: string;
  selectionStart?: { line: number; column: number };
  selectionEnd?: { line: number; column: number };
}

export interface FunctionInfo {
  name: string;
  code: string;
  startLine: number;
  endLine: number;
  params: string[];
  returnType?: string;
}

export interface ClassInfo {
  name: string;
  code: string;
  startLine: number;
  endLine: number;
  methods: string[];
}

export interface RelatedFile {
  filename: string;
  language: string;
  relevantCode: string;
  reason: string;
}

/**
 * Extract context from code
 */
export function extractContext(
  code: string,
  cursorLine: number,
  cursorColumn: number,
  language: string = 'javascript',
  filename: string = 'index.js',
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } }
): CodeContext {
  const lines = code.split('\n');
  
  return {
    filename,
    language,
    fullCode: code,
    cursorLine,
    cursorColumn,
    currentFunction: extractFunctionAtCursor(code, cursorLine, language),
    currentClass: extractClassAtCursor(code, cursorLine, language),
    linesBefore: getLinesBefore(lines, cursorLine, 20),
    linesAfter: getLinesAfter(lines, cursorLine, 20),
    imports: extractImports(code, language),
    selectedText: selection ? extractSelection(code, selection) : undefined,
    selectionStart: selection?.start,
    selectionEnd: selection?.end,
  };
}

/**
 * Extract function at cursor position
 */
export function extractFunctionAtCursor(
  code: string,
  cursorLine: number,
  language: string
): FunctionInfo | undefined {
  const patterns = getFunctionPatterns(language);
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of patterns) {
      const match = line.match(pattern.regex);
      if (match) {
        const funcStart = i;
        const funcEnd = findFunctionEnd(lines, i, language);
        
        // Check if cursor is within this function
        if (cursorLine >= funcStart && cursorLine <= funcEnd) {
          const funcCode = lines.slice(funcStart, funcEnd + 1).join('\n');
          
          return {
            name: match.groups?.name || match[1] || 'anonymous',
            code: funcCode,
            startLine: funcStart + 1, // 1-indexed
            endLine: funcEnd + 1,
            params: extractParams(funcCode, language),
            returnType: extractReturnType(funcCode, language),
          };
        }
      }
    }
  }
  
  return undefined;
}

/**
 * Extract class at cursor position
 */
export function extractClassAtCursor(
  code: string,
  cursorLine: number,
  language: string
): ClassInfo | undefined {
  if (!['javascript', 'typescript', 'python', 'java'].includes(language)) {
    return undefined;
  }
  
  const lines = code.split('\n');
  const classPattern = language === 'python' 
    ? /^class\s+(\w+)/ 
    : /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/;
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(classPattern);
    if (match) {
      const classStart = i;
      const classEnd = findBlockEnd(lines, i, language);
      
      if (cursorLine >= classStart && cursorLine <= classEnd) {
        const classCode = lines.slice(classStart, classEnd + 1).join('\n');
        
        return {
          name: match[1],
          code: classCode,
          startLine: classStart + 1,
          endLine: classEnd + 1,
          methods: extractMethodNames(classCode, language),
        };
      }
    }
  }
  
  return undefined;
}

/**
 * Get lines before cursor
 */
function getLinesBefore(lines: string[], cursorLine: number, count: number): string[] {
  const start = Math.max(0, cursorLine - count);
  return lines.slice(start, cursorLine);
}

/**
 * Get lines after cursor
 */
function getLinesAfter(lines: string[], cursorLine: number, count: number): string[] {
  const start = cursorLine + 1;
  const end = Math.min(lines.length, start + count);
  return lines.slice(start, end);
}

/**
 * Extract imports from code
 */
function extractImports(code: string, language: string): string[] {
  const imports: string[] = [];
  const lines = code.split('\n');
  
  const patterns = {
    javascript: /^(?:import|export|require)/,
    typescript: /^(?:import|export|require)/,
    python: /^(?:import|from)/,
    java: /^import/,
  };
  
  const pattern = patterns[language] || patterns.javascript;
  
  for (const line of lines) {
    if (pattern.test(line.trim())) {
      imports.push(line.trim());
    }
  }
  
  return imports;
}

/**
 * Extract selected text
 */
function extractSelection(
  code: string,
  selection: { start: { line: number; column: number }; end: { line: number; column: number } }
): string {
  const lines = code.split('\n');
  const { start, end } = selection;
  
  if (start.line === end.line) {
    return lines[start.line].substring(start.column, end.column);
  }
  
  const selectedLines: string[] = [];
  selectedLines.push(lines[start.line].substring(start.column));
  
  for (let i = start.line + 1; i < end.line; i++) {
    selectedLines.push(lines[i]);
  }
  
  selectedLines.push(lines[end.line].substring(0, end.column));
  
  return selectedLines.join('\n');
}

/**
 * Get function patterns for language
 */
function getFunctionPatterns(language: string): { regex: RegExp; type: string }[] {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return [
        { regex: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/, type: 'function' },
        { regex: /^(?:export\s+)?(?:async\s+)?(\w+)\s*\(.*\)\s*(?::\s*\w+)?\s*\{/, type: 'method' },
        { regex: /^(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[^=])\s*=>/, type: 'arrow' },
        { regex: /^\s*(\w+)\s*\(.*\)\s*\{/, type: 'method' },
      ];
    case 'python':
      return [
        { regex: /^def\s+(\w+)/, type: 'function' },
        { regex: /^async\s+def\s+(\w+)/, type: 'async_function' },
      ];
    default:
      return [
        { regex: /^function\s+(\w+)/, type: 'function' },
      ];
  }
}

/**
 * Find function end line
 */
function findFunctionEnd(lines: string[], startLine: number, language: string): number {
  if (language === 'python') {
    // Python uses indentation
    const baseIndent = lines[startLine].search(/\S/);
    for (let i = startLine + 1; i < lines.length; i++) {
      const currentIndent = lines[i].search(/\S/);
      if (currentIndent <= baseIndent && lines[i].trim()) {
        return i - 1;
      }
    }
    return lines.length - 1;
  }
  
  // Brace-based languages
  return findBlockEnd(lines, startLine, language);
}

/**
 * Find block end (for brace-based languages)
 */
function findBlockEnd(lines: string[], startLine: number, language: string): number {
  let braceCount = 0;
  let foundOpen = false;
  
  for (let i = startLine; i < lines.length; i++) {
    for (const char of lines[i]) {
      if (char === '{') {
        braceCount++;
        foundOpen = true;
      } else if (char === '}') {
        braceCount--;
        if (foundOpen && braceCount === 0) {
          return i;
        }
      }
    }
  }
  
  return lines.length - 1;
}

/**
 * Extract function parameters
 */
function extractParams(funcCode: string, language: string): string[] {
  const patterns = {
    javascript: /\(([^)]*)\)/,
    typescript: /\(([^)]*)\)/,
    python: /\(([^)]*)\)/,
  };
  
  const match = funcCode.match(patterns[language] || patterns.javascript);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(p => p.trim().split(':')[0].split('=')[0].trim())
    .filter(p => p && p !== 'self' && p !== 'this');
}

/**
 * Extract return type (TypeScript)
 */
function extractReturnType(funcCode: string, language: string): string | undefined {
  if (language !== 'typescript') return undefined;
  
  const match = funcCode.match(/\)\s*:\s*(\w+)/);
  return match ? match[1] : undefined;
}

/**
 * Extract method names from class code
 */
function extractMethodNames(classCode: string, language: string): string[] {
  const methods: string[] = [];
  const patterns = getFunctionPatterns(language);
  
  const lines = classCode.split('\n');
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern.regex);
      if (match) {
        methods.push(match[1]);
        break;
      }
    }
  }
  
  return methods;
}

/**
 * Build AI prompt context from CodeContext
 */
export function buildPromptContext(context: CodeContext): string {
  const parts: string[] = [];
  
  // Add file info
  parts.push(`File: ${context.filename}`);
  parts.push(`Language: ${context.language}`);
  
  // Add current function if available
  if (context.currentFunction) {
    parts.push(`\nCurrent function: ${context.currentFunction.name}`);
    parts.push(`Lines ${context.currentFunction.startLine}-${context.currentFunction.endLine}`);
    parts.push('```');
    parts.push(context.currentFunction.code);
    parts.push('```');
  }
  
  // Add surrounding context
  if (context.linesBefore.length > 0) {
    parts.push(`\nContext before cursor (last ${context.linesBefore.length} lines):`);
    parts.push('```');
    parts.push(context.linesBefore.join('\n'));
    parts.push('```');
  }
  
  // Add selected text if available
  if (context.selectedText) {
    parts.push(`\nSelected text:`);
    parts.push('```');
    parts.push(context.selectedText);
    parts.push('```');
  }
  
  return parts.join('\n');
}