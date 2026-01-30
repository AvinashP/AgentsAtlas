#!/usr/bin/env python3
"""
Secret Scanner - Find hardcoded secrets in source code.

Usage:
    python check_secrets.py [directory]
    python check_secrets.py --help

This script scans source files for patterns that might indicate
hardcoded secrets, API keys, passwords, or sensitive data.
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple, Set

# Patterns that might indicate secrets
SECRET_PATTERNS = [
    # Generic secrets
    (r'(?i)(password|passwd|pwd)\s*[=:]\s*["\'][^"\']{4,}["\']', 'Possible password'),
    (r'(?i)(secret|api_?key|apikey|auth_?token)\s*[=:]\s*["\'][^"\']{8,}["\']', 'Possible secret/API key'),
    (r'(?i)bearer\s+[a-zA-Z0-9_\-\.]+', 'Possible bearer token'),

    # AWS
    (r'AKIA[0-9A-Z]{16}', 'AWS Access Key ID'),
    (r'(?i)aws_?secret_?access_?key\s*[=:]\s*["\'][^"\']{40}["\']', 'AWS Secret Access Key'),

    # Google
    (r'AIza[0-9A-Za-z_-]{35}', 'Google API Key'),

    # GitHub
    (r'ghp_[0-9A-Za-z]{36}', 'GitHub Personal Access Token'),
    (r'gho_[0-9A-Za-z]{36}', 'GitHub OAuth Token'),
    (r'ghu_[0-9A-Za-z]{36}', 'GitHub User Token'),
    (r'ghs_[0-9A-Za-z]{36}', 'GitHub Server Token'),
    (r'ghr_[0-9A-Za-z]{36}', 'GitHub Refresh Token'),

    # Stripe
    (r'sk_live_[0-9a-zA-Z]{24}', 'Stripe Live Secret Key'),
    (r'sk_test_[0-9a-zA-Z]{24}', 'Stripe Test Secret Key'),
    (r'pk_live_[0-9a-zA-Z]{24}', 'Stripe Live Publishable Key'),

    # Slack
    (r'xox[baprs]-[0-9a-zA-Z-]+', 'Slack Token'),

    # Private keys
    (r'-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----', 'Private Key'),
    (r'-----BEGIN PGP PRIVATE KEY BLOCK-----', 'PGP Private Key'),

    # Database URLs
    (r'(?i)(mongodb|postgres|mysql|redis)://[^"\'\s]+:[^"\'\s]+@', 'Database URL with credentials'),

    # JWT
    (r'eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*', 'Possible JWT token'),

    # Generic high entropy strings (Base64-like)
    (r'(?i)(key|token|secret|password|credential)["\'\s:=]+[a-zA-Z0-9+/]{32,}[=]{0,2}', 'High entropy secret'),
]

# File extensions to scan
SCANNABLE_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
    '.py', '.pyw',
    '.java', '.kt', '.scala',
    '.go',
    '.rb',
    '.php',
    '.cs',
    '.swift',
    '.rs',
    '.c', '.cpp', '.h', '.hpp',
    '.sh', '.bash', '.zsh',
    '.yaml', '.yml',
    '.json',
    '.xml',
    '.toml',
    '.ini', '.cfg', '.conf',
    '.env', '.env.local', '.env.development', '.env.production',
    '.properties',
    '.sql',
    '.tf', '.tfvars',
}

# Directories to skip
SKIP_DIRS = {
    'node_modules', 'vendor', 'venv', '.venv', 'env',
    '.git', '.svn', '.hg',
    'dist', 'build', 'out', 'target',
    '__pycache__', '.pytest_cache',
    'coverage', '.nyc_output',
    '.idea', '.vscode',
}

# Files to skip
SKIP_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'poetry.lock', 'Pipfile.lock', 'composer.lock',
    'Gemfile.lock', 'go.sum', 'Cargo.lock',
}


def should_scan_file(path: Path) -> bool:
    """Determine if a file should be scanned."""
    if path.name in SKIP_FILES:
        return False

    # Check extension
    if path.suffix.lower() in SCANNABLE_EXTENSIONS:
        return True

    # Check for dotfiles that might contain secrets
    if path.name.startswith('.env'):
        return True

    return False


def scan_file(file_path: Path) -> List[Tuple[int, str, str]]:
    """Scan a file for secrets. Returns list of (line_num, pattern_name, line)."""
    findings = []

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}", file=sys.stderr)
        return findings

    for line_num, line in enumerate(lines, 1):
        # Skip comments (basic detection)
        stripped = line.strip()
        if stripped.startswith(('#', '//', '/*', '*', '<!--')):
            continue

        for pattern, name in SECRET_PATTERNS:
            if re.search(pattern, line):
                # Clean up line for display
                display_line = line.strip()[:100]
                if len(line.strip()) > 100:
                    display_line += '...'
                findings.append((line_num, name, display_line))
                break  # One finding per line

    return findings


def scan_directory(directory: Path, verbose: bool = False) -> dict:
    """Scan a directory recursively for secrets."""
    results = {}
    files_scanned = 0

    for root, dirs, files in os.walk(directory):
        # Skip certain directories
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for file in files:
            file_path = Path(root) / file

            if not should_scan_file(file_path):
                continue

            if verbose:
                print(f"Scanning: {file_path}", file=sys.stderr)

            files_scanned += 1
            findings = scan_file(file_path)

            if findings:
                results[str(file_path)] = findings

    return results, files_scanned


def print_results(results: dict, files_scanned: int) -> None:
    """Print scan results."""
    if not results:
        print(f"\n✅ No secrets found in {files_scanned} files scanned.")
        return

    print(f"\n⚠️  Potential secrets found in {len(results)} file(s) ({files_scanned} files scanned):\n")

    total_findings = 0
    for file_path, findings in sorted(results.items()):
        print(f"📄 {file_path}")
        for line_num, pattern_name, line in findings:
            print(f"   Line {line_num}: [{pattern_name}]")
            print(f"   {line}")
            print()
            total_findings += 1

    print(f"\nTotal: {total_findings} potential secret(s) found.")
    print("\nPlease verify each finding. Some may be false positives (e.g., example keys, documentation).")
    print("If real secrets are found, rotate them immediately!")


def main():
    parser = argparse.ArgumentParser(
        description='Scan source code for hardcoded secrets.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python check_secrets.py .              # Scan current directory
    python check_secrets.py src/           # Scan src directory
    python check_secrets.py -v .           # Verbose output
    python check_secrets.py --json .       # JSON output
        """
    )
    parser.add_argument('directory', nargs='?', default='.',
                        help='Directory to scan (default: current directory)')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='Show files being scanned')
    parser.add_argument('--json', action='store_true',
                        help='Output results as JSON')

    args = parser.parse_args()

    directory = Path(args.directory)
    if not directory.exists():
        print(f"Error: Directory '{directory}' does not exist.", file=sys.stderr)
        sys.exit(1)

    print(f"🔍 Scanning {directory.absolute()} for secrets...\n")

    results, files_scanned = scan_directory(directory, args.verbose)

    if args.json:
        import json
        output = {
            'files_scanned': files_scanned,
            'findings': {
                path: [{'line': ln, 'type': t, 'content': c}
                       for ln, t, c in findings]
                for path, findings in results.items()
            }
        }
        print(json.dumps(output, indent=2))
    else:
        print_results(results, files_scanned)

    # Exit with error code if secrets found
    sys.exit(1 if results else 0)


if __name__ == '__main__':
    main()
