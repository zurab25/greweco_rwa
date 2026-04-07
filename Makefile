# Ensures the program keypair matches `declare_id!` before `anchor build` (avoids a
# regenerated `target/deploy/*` keypair after a clean `target/`).
.PHONY: build
build:
	mkdir -p target/deploy
	cp programs/greweco_rwa/greweco_rwa-keypair.json target/deploy/greweco_rwa-keypair.json
	anchor build
