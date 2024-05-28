find . -type d \( -name 'node_modules' -o -name '.git' -o -name 'build' \) \
  -prune -o -type f ! -name "$(basename $0)" -print | xargs grep -i -n 'todo' --color=always
