TESTS = node/test/*.js

test:
	@NODE_ENV=test ./node/node_modules/.bin/mocha \
			--require chai \
			--reporter spec \
			--ui bdd \
			--timeout 300000 \
			--slow 20 \
			--growl \
			$(TESTS)
.PHONY: test