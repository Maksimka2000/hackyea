#!/usr/bin/env sh
# Downloads the local models used by matching into <dir> (default HubMi.Api/models) and verifies pinned checksums.
# Used by the Docker build and for running the API locally with `dotnet run`. The files are never committed.
#   bge-m3-int8.onnx             Xenova/bge-m3                       (MIT; int8 ONNX export of BAAI/bge-m3, dense embeddings)
#   bge-reranker-v2-m3-int8.onnx onnx-community/bge-reranker-v2-m3-ONNX (int8 ONNX export of BAAI/bge-reranker-v2-m3)
#   sentencepiece.bpe.model      BAAI/bge-m3                         (the XLM-R vocabulary both models share)
set -eu

DIR="${1:-$(dirname "$0")/../HubMi.Api/models}"
EMBED_REV="4de13258303883538bd53b696b452bf8099f0858"
EMBED_SHA="a206e10e995aa2a833924bcd725ba5dd6c3425cd34bac3cf2b5677cd2a1c51d6"
RERANK_REV="6f5ff65298512715a1e669753bc754d2bc8f367b"
RERANK_SHA="912fc1215c2dbff6499700534bd8d31253af01573861abbfc43afd1fab6cce5d"
VOCAB_REV="5617a9f61b028005a4858fdac845db406aefb181"
VOCAB_SHA="cfc8146abe2a0488e9e2a0c56de7952f7c11ab059eca145a0a727afce0db2865"

sha256() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }

fetch() { # url target expected-sha
  if [ -f "$2" ] && [ "$(sha256 "$2")" = "$3" ]; then echo "ok   $2"; return; fi
  echo "get  $2"
  curl -fsSL --retry 3 -o "$2" "$1"
  [ "$(sha256 "$2")" = "$3" ] || { echo "checksum mismatch for $2" >&2; rm -f "$2"; exit 1; }
}

mkdir -p "$DIR"
fetch "https://huggingface.co/BAAI/bge-m3/resolve/$VOCAB_REV/onnx/sentencepiece.bpe.model" "$DIR/sentencepiece.bpe.model" "$VOCAB_SHA"
fetch "https://huggingface.co/Xenova/bge-m3/resolve/$EMBED_REV/onnx/model_int8.onnx" "$DIR/bge-m3-int8.onnx" "$EMBED_SHA"
fetch "https://huggingface.co/onnx-community/bge-reranker-v2-m3-ONNX/resolve/$RERANK_REV/onnx/model_int8.onnx" "$DIR/bge-reranker-v2-m3-int8.onnx" "$RERANK_SHA"
