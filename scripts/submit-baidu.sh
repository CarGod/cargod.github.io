#!/bin/sh
set -eu

# 手动运行：BAIDU_SITE_TOKEN='...' sh scripts/submit-baidu.sh
# Token 只从环境变量读取，禁止写入仓库或提交到 Git。

SITE_URL="${SITE_URL:-https://luffyliu.com}"
BAIDU_ENDPOINT="${BAIDU_ENDPOINT:-https://data.zz.baidu.com/urls}"

if [ -z "${BAIDU_SITE_TOKEN:-}" ]; then
  echo "BAIDU_SITE_TOKEN is required. Create the token in Baidu Search Resource Platform and pass it as an environment secret." >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  URLS="$*"
else
  URLS="${SITE_URL}/ ${SITE_URL}/tutorials/ ${SITE_URL}/tutorials/prompt-engineering/ ${SITE_URL}/blog/ ${SITE_URL}/blog/enterprise-ai-four-stages/ ${SITE_URL}/fanfan-cards/"
fi

for url in $URLS; do
  case "$url" in
    "${SITE_URL}"/*|"${SITE_URL}/") ;;
    *)
      echo "Refusing to submit URL outside ${SITE_URL}: ${url}" >&2
      exit 1
      ;;
  esac
done

echo "Submitting URLs to Baidu for ${SITE_URL}"
printf '%s\n' $URLS | curl --fail-with-body --silent --show-error \
  -H 'Content-Type: text/plain' \
  --data-binary @- \
  "${BAIDU_ENDPOINT}?site=${SITE_URL}&token=${BAIDU_SITE_TOKEN}"
echo
