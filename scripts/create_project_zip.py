import zipfile
import os
import sys

def make_zip(output_zip_path, root_dir):
    exclude_dirs = {
        'node_modules', '.git', 'dist', '__pycache__', '.vite', '.cache', '.turbo', '.next'
    }
    exclude_files = {
        '.env', '.env.local', 'package-lock.json', '.DS_Store'
    }

    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for current_root, dirs, files in os.walk(root_dir):
            # prune excluded dirs
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for f in files:
                if f in exclude_files or f.endswith('.log') or f.endswith('.pyc') or f.endswith('.zip'):
                    continue
                full_path = os.path.join(current_root, f)
                rel_path = os.path.relpath(full_path, root_dir)
                try:
                    zipf.write(full_path, rel_path)
                except Exception as e:
                    print(f"Skipping {rel_path}: {e}", file=sys.stderr)

    print(f"DONE: {output_zip_path} ({os.path.getsize(output_zip_path)} bytes)")

if __name__ == '__main__':
    out_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/project.zip'
    src_dir = sys.argv[2] if len(sys.argv) > 2 else '.'
    make_zip(out_path, src_dir)
