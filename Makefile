# Local release tooling. Not shipped in the published tarball
# (package.json `files` is `["src"]`).
#
# Usage:
#   make deploy    # logs in if needed, prompts for 2FA OTP, runs npm publish
#
# Run AFTER bumping version + updating CHANGELOG.md + committing + tagging
# + pushing — see the release notes in README.md / CLAUDE.md.

.PHONY: deploy login publish

deploy: login publish

login:
	@if ! npm whoami >/dev/null 2>&1; then \
	  echo "Not logged in to npm — running npm login..."; \
	  npm login; \
	fi
	@echo "npm user: $$(npm whoami)"

publish:
	@read -s -p "npm 2FA OTP (6 digits): " otp; echo; \
	npm publish --otp=$$otp
