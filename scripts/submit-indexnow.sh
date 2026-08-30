#!/bin/sh
set -eu

# 手动运行：sh scripts/submit-indexnow.sh
# 也可以在命令后传入一个或多个站内绝对 URL。脚本不会在部署时自动执行。

SITE_URL="${SITE_URL:-https://luffyliu.com}"
INDEXNOW_KEY="${INDEXNOW_KEY:-f12ccf366cb74427b4136826edc61235}"
KEY_LOCATION="${KEY_LOCATION:-${SITE_URL}/${INDEXNOW_KEY}.txt}"
INDEXNOW_ENDPOINT="${INDEXNOW_ENDPOINT:-https://api.indexnow.org/indexnow}"

if [ "$#" -gt 0 ]; then
  URLS="$*"
else
  URLS="${SITE_URL}/ ${SITE_URL}/tutorials/ ${SITE_URL}/tutorials/prompt-engineering/ ${SITE_URL}/blog/ ${SITE_URL}/blog/enterprise-ai-four-stages/ \
${SITE_URL}/zh-tw/ ${SITE_URL}/zh-tw/tutorials/ ${SITE_URL}/zh-tw/tutorials/prompt-engineering/ ${SITE_URL}/zh-tw/blog/ ${SITE_URL}/zh-tw/blog/enterprise-ai-four-stages/ \
${SITE_URL}/en/ ${SITE_URL}/en/tutorials/ ${SITE_URL}/en/tutorials/prompt-engineering/ ${SITE_URL}/en/blog/ ${SITE_URL}/en/blog/enterprise-ai-four-stages/ \
${SITE_URL}/ja/ ${SITE_URL}/ja/tutorials/ ${SITE_URL}/ja/tutorials/prompt-engineering/ ${SITE_URL}/ja/blog/ ${SITE_URL}/ja/blog/enterprise-ai-four-stages/ \
${SITE_URL}/ko/ ${SITE_URL}/ko/tutorials/ ${SITE_URL}/ko/tutorials/prompt-engineering/ ${SITE_URL}/ko/blog/ ${SITE_URL}/ko/blog/enterprise-ai-four-stages/ \
${SITE_URL}/es/ ${SITE_URL}/es/tutorials/ ${SITE_URL}/es/tutorials/prompt-engineering/ ${SITE_URL}/es/blog/ ${SITE_URL}/es/blog/enterprise-ai-four-stages/ \
${SITE_URL}/fanfan-cards/ ${SITE_URL}/en/fanfan-cards/"
fi

for url in $URLS; do
  case "$url" in
    "${SITE_URL}"/*|"${SITE_URL}/") ;;
    *)
      echo "Refusing to submit URL outside ${SITE_URL}: ${url}" >&2
      exit 1
      ;;
  esac

  echo "Submitting ${url} to IndexNow"
  curl --fail-with-body --silent --show-error --get "$INDEXNOW_ENDPOINT" \
    --data-urlencode "url=${url}" \
    --data-urlencode "key=${INDEXNOW_KEY}" \
    --data-urlencode "keyLocation=${KEY_LOCATION}"
  echo
done
