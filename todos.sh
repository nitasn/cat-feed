# showing occurrences of "TODO" (in capital letters).
# to ignore case, pass the flag "-all".

if [[ " $@ " =~ " -all " ]]; then
  case="-i"
fi

find . -type d \( -name 'node_modules' -o -name '.git' -o -name 'build' \) \
  -prune -o -type f ! -name "$(basename $0)" -print | xargs grep $case -n 'TODO' --color=always
