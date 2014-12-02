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

test-karma:
	@printf "==> [Test :: Karma (PhantomJS)]\n"
	@NODE_ENV=test ./node/node_modules/karma/bin/karma start node/karma.conf.js 

.PHONY: test-karma