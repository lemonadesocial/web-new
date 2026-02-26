# Changelog

## [10.8.0](https://github.com/lemonadesocial/web-new/compare/v10.7.3...v10.8.0) (2026-02-26)


### Features

* **api:** add AI GraphQL proxy endpoint ([ffdd49f](https://github.com/lemonadesocial/web-new/commit/ffdd49f0580448479edbf8240081825175d8e74d))


### Bug Fixes

* **ai:** route browser AI GraphQL via same-origin proxy ([9211c08](https://github.com/lemonadesocial/web-new/commit/9211c08b97550db0dfc6e7f35ec0282c60e939a2))
* lower gas limit to respect chain cap ([cb2a7ab](https://github.com/lemonadesocial/web-new/commit/cb2a7abc010a00ecfd81609d5628f53520dfe84c))
* merge conflict ([173a76f](https://github.com/lemonadesocial/web-new/commit/173a76f05063904775cecfd3c0d585ecb5c76fb7))
* resolve ai chat url ([5950f43](https://github.com/lemonadesocial/web-new/commit/5950f43ed8859fda7273d0e809aa5dbeb7bc26b1))
* self form ([c93b1df](https://github.com/lemonadesocial/web-new/commit/c93b1df1c33c870573312401f13cc281aec2ba4b))
* set gas limits by chain ([2d52b79](https://github.com/lemonadesocial/web-new/commit/2d52b795338e65ed4b99dd382996923f4b8b6ba5))

## [10.7.3](https://github.com/lemonadesocial/web-new/compare/v10.7.2...v10.7.3) (2026-02-24)


### Bug Fixes

* blast email ([6dc072b](https://github.com/lemonadesocial/web-new/commit/6dc072b59fc2adc06b3d687b175141358f61a2f4))

## [10.7.2](https://github.com/lemonadesocial/web-new/compare/v10.7.1...v10.7.2) (2026-02-23)


### Bug Fixes

* build ([4f5e210](https://github.com/lemonadesocial/web-new/commit/4f5e210bb541a0a9daa001bb940b470aaee0c90e))
* merge conflict ([5344c59](https://github.com/lemonadesocial/web-new/commit/5344c59467a3ba4da143f15e0e4ef987a198f7fd))

## [10.7.1](https://github.com/lemonadesocial/web-new/compare/v10.7.0...v10.7.1) (2026-02-23)


### Bug Fixes

* **audit:** CRIT-004 — add error boundaries to 5 key route segments ([92b7f03](https://github.com/lemonadesocial/web-new/commit/92b7f03a938098ddee0eedee48997882a7a8bb48))
* **audit:** CRIT-006 — add try/catch error handling to 5 unprotected API routes ([3b40590](https://github.com/lemonadesocial/web-new/commit/3b4059095564dd1a18f0c495bec850970c78a018))
* **audit:** CRIT-007 — remove stack trace exposure from error UI and API responses ([9a9f598](https://github.com/lemonadesocial/web-new/commit/9a9f5980fd71e25c6f086ae5b43a98693d486f72))
* **audit:** CRIT-008 — add alt attributes to 30 images across 14 files ([5823ce7](https://github.com/lemonadesocial/web-new/commit/5823ce70a8e22d0ed7004126f33d10ab483d60f1))
* **audit:** CRIT-009 — add aria-labels to 22 icon-only buttons across 14 files ([24809c1](https://github.com/lemonadesocial/web-new/commit/24809c1111d2b9f2d727e00a026b9a5916f31d39))
* **audit:** CRIT-010 — add dialog accessibility to modal, drawer, and bottomsheet ([ab48ad2](https://github.com/lemonadesocial/web-new/commit/ab48ad21c79e79b05284be3b00a16bf6e17400e0))
* **audit:** HIGH-001 — sanitize marked() output with DOMPurify in markdown utility ([321eacd](https://github.com/lemonadesocial/web-new/commit/321eacd756d1d48ba5ffe7ed114176a9db6f9977))
* **audit:** HIGH-004 — add SSRF protection to /api/og/extractor ([6f5abfe](https://github.com/lemonadesocial/web-new/commit/6f5abfeeb7d85dc6cc04f8710348610da6271312))
* **audit:** HIGH-005 — remove hardcoded Thirdweb client ID fallback ([68fecda](https://github.com/lemonadesocial/web-new/commit/68fecda10fbf01b05728febbe8f643ad99865d38))
* **audit:** HIGH-007 — add 'use client' directive to 25 hook files ([c2059f2](https://github.com/lemonadesocial/web-new/commit/c2059f283656e69459a77208c940113bf31dbc96))
* **audit:** HIGH-008 — push 'use client' down from payments layout ([177ecce](https://github.com/lemonadesocial/web-new/commit/177eccede2ba83c132f81b2a64c7bff674ce4775))
* **audit:** HIGH-013 — add global focus-visible styles for keyboard accessibility ([5099e90](https://github.com/lemonadesocial/web-new/commit/5099e9024934371c8d4106c6b97af71cc3eb3ced))
* **audit:** HIGH-014 — replace non-semantic onClick elements with buttons ([f3c3c2a](https://github.com/lemonadesocial/web-new/commit/f3c3c2a96eaa0765ad407c61f4248229fde2f7e4))
* **audit:** HIGH-015 — fix label/input associations for accessibility ([bb9a5e7](https://github.com/lemonadesocial/web-new/commit/bb9a5e75da6cbe0727e777cf1bd287d5269ad751))
* **audit:** HIGH-016 — add role="alert" and aria-live to ErrorText component ([583f4b8](https://github.com/lemonadesocial/web-new/commit/583f4b8bfd64162d2b20fa54be22c6b9e6b82437))
* **audit:** HIGH-020, HIGH-022 — remove unused deps, move lodash to dependencies ([0442710](https://github.com/lemonadesocial/web-new/commit/04427100f4d0b6c2d4df82a2782af961e30a2746))
* **audit:** HIGH-021 — delete legacy directories (15 dead files) ([1aee1f8](https://github.com/lemonadesocial/web-new/commit/1aee1f87c75b217223d78287af13f8366d5c0919))
* eliminate double-assertion patterns across 17 files ([727a4a0](https://github.com/lemonadesocial/web-new/commit/727a4a0b0d683195fc157e09c8df10a1eb7d0ae1))

## [10.7.0](https://github.com/lemonadesocial/web-new/compare/v10.6.0...v10.7.0) (2026-02-18)


### Features

* open check-in page in new tab ([b330f5e](https://github.com/lemonadesocial/web-new/commit/b330f5ed8b208685958968c0bfafe2bdbec7f976))
* reduce guest list page size ([4430622](https://github.com/lemonadesocial/web-new/commit/443062277281cdb42df70c5f5c19b2b5f1073843))

## [10.6.0](https://github.com/lemonadesocial/web-new/compare/v10.5.1...v10.6.0) (2026-02-13)


### Features

* improve claim username flow ([9fae9d9](https://github.com/lemonadesocial/web-new/commit/9fae9d99752db30d0018c362936c3f705bb8255b))
* update gas limit ([0ca238e](https://github.com/lemonadesocial/web-new/commit/0ca238e4d16fff8a65e7edc02955c720ee6880ce))


### Bug Fixes

* mint username button ([48b5fbd](https://github.com/lemonadesocial/web-new/commit/48b5fbdcdd85be8b028af71e017328d4592cac41))

## [10.5.1](https://github.com/lemonadesocial/web-new/compare/v10.5.0...v10.5.1) (2026-02-13)


### Bug Fixes

* send ui buttons responsiveness ([8d57153](https://github.com/lemonadesocial/web-new/commit/8d57153100576be7e1e6002f79ab2a76a99e9c4b))

## [10.5.0](https://github.com/lemonadesocial/web-new/compare/v10.4.1...v10.5.0) (2026-02-12)


### Features

* add mint data log ([3f1f557](https://github.com/lemonadesocial/web-new/commit/3f1f557d45880c4f496f5ada6f1736eb8a187db0))

## [10.4.1](https://github.com/lemonadesocial/web-new/compare/v10.4.0...v10.4.1) (2026-02-12)


### Bug Fixes

* copy ([c870c1b](https://github.com/lemonadesocial/web-new/commit/c870c1b92de8d9dddce24fcc63e72d7acb4d84e7))
* fluffle id ([f57b5ab](https://github.com/lemonadesocial/web-new/commit/f57b5ab8735ed7248744e5dbf8efcc2a9b990276))
* send ui mobile ([23e5bbd](https://github.com/lemonadesocial/web-new/commit/23e5bbdcb0c287f16598c4d59bbbef8f38e5029c))

## [10.4.0](https://github.com/lemonadesocial/web-new/compare/v10.3.1...v10.4.0) (2026-02-12)


### Features

* update price and currency validation ([a5d121f](https://github.com/lemonadesocial/web-new/commit/a5d121f998f0c191775cf634c077ec22897edbc7))

## [10.3.1](https://github.com/lemonadesocial/web-new/compare/v10.3.0...v10.3.1) (2026-02-11)


### Bug Fixes

* check balance ([2c9e13c](https://github.com/lemonadesocial/web-new/commit/2c9e13cf9f70c09ad5bbc1d43e2cc5ba59803fe6))

## [10.3.0](https://github.com/lemonadesocial/web-new/compare/v10.2.0...v10.3.0) (2026-02-11)


### Features

* optimize red envelopes ([caa97f7](https://github.com/lemonadesocial/web-new/commit/caa97f711ce3dbce29991ae2ae514ca814dafc3e))

## [10.2.0](https://github.com/lemonadesocial/web-new/compare/v10.1.0...v10.2.0) (2026-02-11)


### Features

* add buy envelopes modal ([217f064](https://github.com/lemonadesocial/web-new/commit/217f064809e22c47057a621a7debd3ff9d80aeb4))
* add sent modal details ([56e8a27](https://github.com/lemonadesocial/web-new/commit/56e8a275671e67b8502eef8dc9432b2f488960f6))
* update claim ui ([431af70](https://github.com/lemonadesocial/web-new/commit/431af70057b254ef5346a8a5fa77e2bb79f78f20))
* update guest list filter ([364fffb](https://github.com/lemonadesocial/web-new/commit/364fffbb6dd848b27e5912a6a3e35a7014c2a360))
* update layout ([ca41297](https://github.com/lemonadesocial/web-new/commit/ca4129715421a0f7287c6db98531cebb29c04c2e))

## [10.1.0](https://github.com/lemonadesocial/web-new/compare/v10.0.0...v10.1.0) (2026-02-10)


### Features

* seal ui ([8547a0a](https://github.com/lemonadesocial/web-new/commit/8547a0a0c916c324d7794ccb7bfdfc8fd964ccb7))


### Bug Fixes

* passport chain ([0028022](https://github.com/lemonadesocial/web-new/commit/00280229055435bbbed97742d2f81fa6254f7f9c))

## [10.0.0](https://github.com/lemonadesocial/web-new/compare/v9.26.0...v10.0.0) (2026-02-10)


### ⚠ BREAKING CHANGES

* event promoter
* check-in event

### Features

* add agents tab manage community ([d0a14eb](https://github.com/lemonadesocial/web-new/commit/d0a14eb259e7ece3110c8881535a132b9ec2df97))
* add alzena world theme ([d06a520](https://github.com/lemonadesocial/web-new/commit/d06a520ec36603aacf7495613b45125e4534b515))
* add count changes ([cb52e93](https://github.com/lemonadesocial/web-new/commit/cb52e93fc7f56fdd2eccfa3fce7da05b015bfc83))
* add deployment cost ([484f567](https://github.com/lemonadesocial/web-new/commit/484f567d214684ff34d61bc18a9d5b71b7e778dc))
* add event tracker ([07a9cf0](https://github.com/lemonadesocial/web-new/commit/07a9cf0ae17f5532ce986412fdc5d1c48eba572f))
* add hook for getting group coin ([0caf342](https://github.com/lemonadesocial/web-new/commit/0caf342af90048621199620fb6c4fd32f0e00d4d))
* add knowledge page ([27c90b3](https://github.com/lemonadesocial/web-new/commit/27c90b3c7df0d0ec47fe0ace8c68b49d7437c21e))
* add lemonheads error boundary ([c1d2096](https://github.com/lemonadesocial/web-new/commit/c1d20960c57042cff8beb54fb17fc8ce2f5a2295))
* add main coin stats ([eae0117](https://github.com/lemonadesocial/web-new/commit/eae01173a55e437384df88bca68d01186bbc4d11))
* add page views stats ([8149952](https://github.com/lemonadesocial/web-new/commit/81499525a50a4248c082603aee75338503303743))
* add quick buy ([60702f3](https://github.com/lemonadesocial/web-new/commit/60702f34bd0af43b8d573da200eaac45a17518f0))
* add share and should white list alzena world ([b97a1f6](https://github.com/lemonadesocial/web-new/commit/b97a1f63dd8497808696ffa37fb5ec5fd4eaa1c5))
* add slippage select ([57d1c9c](https://github.com/lemonadesocial/web-new/commit/57d1c9cb6f908110764680f30261ffd3c41beca0))
* advanded theme builder ([bd8e85b](https://github.com/lemonadesocial/web-new/commit/bd8e85b1a81413d484ad2b3a7ca1d1871ea77157))
* batch update event cache ([fff7398](https://github.com/lemonadesocial/web-new/commit/fff739870ef9f38ae31a286ae5d7984e9ea4da98))
* bg color blur dropdown ([a2ad389](https://github.com/lemonadesocial/web-new/commit/a2ad389b9b085b9c95a7950d8d8e93aea9af4565))
* block scan ([71ab4f7](https://github.com/lemonadesocial/web-new/commit/71ab4f7af24607595419251213aa06cfb35856ae))
* cancel tickets ([2cc05ab](https://github.com/lemonadesocial/web-new/commit/2cc05ab4915a2c48b550dc9391416e1196908944))
* change pat ([d7e2239](https://github.com/lemonadesocial/web-new/commit/d7e22392d075fba5877e8f7b0835755e5e727db9))
* change path ai to agent ([3043c80](https://github.com/lemonadesocial/web-new/commit/3043c802caea49fb7f2a433be2e4859c85f61b0a))
* check can mint for go next ([f5870ad](https://github.com/lemonadesocial/web-new/commit/f5870ad1a691c4bda1d50538207c1188f2b08c88))
* check in flaunch before load chart widget ([4e370ef](https://github.com/lemonadesocial/web-new/commit/4e370ef5bcba7944112d8c88baea7bf8310b81f7))
* check infinity call ([459b09a](https://github.com/lemonadesocial/web-new/commit/459b09a309b4f388a0782e8d7f0168927bcdf1e1))
* check layout ([fde42cf](https://github.com/lemonadesocial/web-new/commit/fde42cf70803056359e0f38c8207d362914a8946))
* check mint passport zugrama flow ([1142742](https://github.com/lemonadesocial/web-new/commit/1142742d89744085500b68052bbbc1a11669c9fd))
* check mint vinyl - festival - drip passport ([2312558](https://github.com/lemonadesocial/web-new/commit/231255844b1233c70d904b58accba7b3a162f24b))
* check right window ([e6d18f2](https://github.com/lemonadesocial/web-new/commit/e6d18f26541eeff824cb6e64013fe6a0cb286ce1))
* check whitelist ([1921c4e](https://github.com/lemonadesocial/web-new/commit/1921c4e76a905d6263c4d5d1ed5afa359d61c884))
* check-in access ([fc22001](https://github.com/lemonadesocial/web-new/commit/fc2200124d02367dc6cac5a8975800868dc51393))
* check-in event ([f6d4533](https://github.com/lemonadesocial/web-new/commit/f6d453354eb0c175114f3b5bf107643c30620f75))
* checking agent path ([30f6be5](https://github.com/lemonadesocial/web-new/commit/30f6be5e01fc13b1341a0412182bf5a2d60b8039))
* checking cache ([44bdadb](https://github.com/lemonadesocial/web-new/commit/44bdadb8c98ce560e71a19df337866d8125d5783))
* checking file path ([bd33f42](https://github.com/lemonadesocial/web-new/commit/bd33f42a005a2ff79885c9607a85bfc99d41b843))
* checking generate canvas vinyl nation ([809ae65](https://github.com/lemonadesocial/web-new/commit/809ae657de26edb531cf7c14300aa2bc78a0c384))
* checking layout ([4d8a639](https://github.com/lemonadesocial/web-new/commit/4d8a639826f152e5a834840fb1c0da269b257c38))
* checking mobile view ([f88b5f4](https://github.com/lemonadesocial/web-new/commit/f88b5f41be6c019094064293bc0a00d642846d12))
* checking right pane ([8a61fa9](https://github.com/lemonadesocial/web-new/commit/8a61fa97f813fec29cda6845de3a6ce0d6b98a6d))
* checking trpc call ([53ac854](https://github.com/lemonadesocial/web-new/commit/53ac85430cec7072ff9934d4d359c17d8c2bdc6f))
* claim revenue ([9c97e53](https://github.com/lemonadesocial/web-new/commit/9c97e53c538da240ff39052746600ba72a2b8618))
* claim username with erc20 ([6669c83](https://github.com/lemonadesocial/web-new/commit/6669c8343a69b0f920d90dcbe797327d6cc04736))
* clickable token item ([91c68de](https://github.com/lemonadesocial/web-new/commit/91c68deb55fb4ed69c3d67e46b46c8bf842492ed))
* commpleted passport widget ui ([4f94208](https://github.com/lemonadesocial/web-new/commit/4f94208589155caf121b16208545d73c9c246207))
* community coin ([de15d9c](https://github.com/lemonadesocial/web-new/commit/de15d9cae72676d0e2ce99f07c077a1e22523182))
* community subcoins ([11a5b8b](https://github.com/lemonadesocial/web-new/commit/11a5b8b0cbd22d0e79b104ac3d90c652886b07fb))
* complete share passport og ([1632ccd](https://github.com/lemonadesocial/web-new/commit/1632ccd43549120a9f14ca4bde1f7c8eee84ef47))
* completed layout for drip-nation ([3b22f52](https://github.com/lemonadesocial/web-new/commit/3b22f524b45f815877a53b566fd6c1a498d9fa31))
* correct check provider ([1df81c8](https://github.com/lemonadesocial/web-new/commit/1df81c8b642e3c003b9c791d95a818744c6562cc))
* create agent ([d99a0b4](https://github.com/lemonadesocial/web-new/commit/d99a0b4df6eb1e860be000c9474fa603c98d8060))
* create window pane ([3c8ebd7](https://github.com/lemonadesocial/web-new/commit/3c8ebd78932374b4ab3b8f146db1a822ad34e195))
* custom domain ([6b57261](https://github.com/lemonadesocial/web-new/commit/6b572611cc75faab31d7dd6210eae0cecdab6d20))
* custom gas limit ([ad6e68f](https://github.com/lemonadesocial/web-new/commit/ad6e68fc2648bf931d2d7468698f837dec9fc83e))
* custom price hook ([2317893](https://github.com/lemonadesocial/web-new/commit/2317893509a64f694f35514a2914f356472527e9))
* debounce guest list search ([ddb1ec0](https://github.com/lemonadesocial/web-new/commit/ddb1ec0255e0760cdfa61d183cc871ebafe18de7))
* deposit coin ([92ffc4e](https://github.com/lemonadesocial/web-new/commit/92ffc4e8e40ea7a4c685c2f710386bb5032be08f))
* deposit in group ([218462b](https://github.com/lemonadesocial/web-new/commit/218462beaf04aac0ad60f4dc2a346f1a61e94b1c))
* disbable overlay color change ([f5ee86a](https://github.com/lemonadesocial/web-new/commit/f5ee86adf8e989d3ae7c1126738be4db78d9401c))
* display canncelled tickets ([e7d4459](https://github.com/lemonadesocial/web-new/commit/e7d4459599c059b8e28b03af42920d589f0e106e))
* display wrong passport minted ([73754cc](https://github.com/lemonadesocial/web-new/commit/73754cc2998350bcd10a4960cfa56bccacad1aa7))
* enable check white list ([35bdf5a](https://github.com/lemonadesocial/web-new/commit/35bdf5a5f48ebed94edb9cf873cd45169e18d2ae))
* enable coins ui ([df34461](https://github.com/lemonadesocial/web-new/commit/df34461404f14ebc30a41e2fded67d08b4cd99c7))
* enable explore and tokens page ([4887500](https://github.com/lemonadesocial/web-new/commit/4887500d53a28c2493189a5fb53720a4cff7216f))
* enable whitelist ([6a2a1ed](https://github.com/lemonadesocial/web-new/commit/6a2a1ed2bd31590b47b2c7091421b293eec6a550))
* event promoter ([1627dd8](https://github.com/lemonadesocial/web-new/commit/1627dd848bb1ba5046c8b80063c6fac19a68c913))
* fallback username chain ([741c4db](https://github.com/lemonadesocial/web-new/commit/741c4db12432df7b664b9f899c5b093da3bff9c2))
* fix insights on mobile ([3642f7e](https://github.com/lemonadesocial/web-new/commit/3642f7e61148f30f03abe944dbb5259927ef0239))
* format wallet ([2a7e4ec](https://github.com/lemonadesocial/web-new/commit/2a7e4ec4a047102bffa73f8d8834514fb9478fd9))
* guest launchpad ([8991cd5](https://github.com/lemonadesocial/web-new/commit/8991cd591b53755d4b6d2ca39d4b64293dbf7a4f))
* **guest-list:** remove name and email sort ([25ebde5](https://github.com/lemonadesocial/web-new/commit/25ebde56b4d06f75663eba73c20cc6872da3b909))
* hide create coin ([7b2e900](https://github.com/lemonadesocial/web-new/commit/7b2e900b0890598712cca4d88ed9195caa9f64c3))
* hide ui on header instead of force null ([a27164d](https://github.com/lemonadesocial/web-new/commit/a27164de4429c6b39e250c00636636426f295b99))
* hide video bg after minted ([180097f](https://github.com/lemonadesocial/web-new/commit/180097fcd14761512142148039569a22a5271aeb))
* holders stat ([a4c6536](https://github.com/lemonadesocial/web-new/commit/a4c6536aa62c0a271d97f1f97073345577ce9c20))
* implement chat ([8bd6f9f](https://github.com/lemonadesocial/web-new/commit/8bd6f9f499b1483401ec8a63c93b7862a62ab5c9))
* implement token page ([e49fba5](https://github.com/lemonadesocial/web-new/commit/e49fba53c2b133d183365924936cdb821b2dda33))
* improve network cache ([f566ef7](https://github.com/lemonadesocial/web-new/commit/f566ef7f62076d80232e0ef911e90598f564974b))
* improve ux ([a6dcd75](https://github.com/lemonadesocial/web-new/commit/a6dcd752baef107fda03530414ddacd59117a527))
* init theme with passport template ([854c84c](https://github.com/lemonadesocial/web-new/commit/854c84ccdee5add4af7215d1363d86c8fcf97937))
* integrate coin widgets ([f6fc150](https://github.com/lemonadesocial/web-new/commit/f6fc15086d400847a48381a3a0b4fcb4b009ea38))
* launch date ([7ade634](https://github.com/lemonadesocial/web-new/commit/7ade6343be1dcfc8354afadd068ba5942629b71d))
* launchpad settings view ([3a46844](https://github.com/lemonadesocial/web-new/commit/3a46844c7d43f7c12cf364420094302a3056a030))
* **lemonade-username:** add endpoint to retrieve metadata ([9d1c7ee](https://github.com/lemonadesocial/web-new/commit/9d1c7ee1f1f56364ae4268a639bc57fd4f1186b7))
* map data coin ([a0625d1](https://github.com/lemonadesocial/web-new/commit/a0625d1a332795e627d555bf15657f3eebb95ee7))
* minimal colors ([10b59d9](https://github.com/lemonadesocial/web-new/commit/10b59d9db2209ca28461a1e71b1bc0616d651b26))
* missing boiler plate image ([9d18ee0](https://github.com/lemonadesocial/web-new/commit/9d18ee00ea775c9b9ca8bbd5b42b2ad7efa7debb))
* missing minted lemonhead step ([dbcd411](https://github.com/lemonadesocial/web-new/commit/dbcd411b012bd0158b7594dbe2d9645dac73de1f))
* modify tickets ([2cdb159](https://github.com/lemonadesocial/web-new/commit/2cdb1599b390d4d184939a8f3acc22dccf199687))
* modify tickets ([50599a8](https://github.com/lemonadesocial/web-new/commit/50599a8ecf5f91f081c43b4c14736a332907fc99))
* move utils file ([1bdad24](https://github.com/lemonadesocial/web-new/commit/1bdad246e6f6c7e7a6cd058d20f69b057e20402f))
* optimize launchpad ([dabf153](https://github.com/lemonadesocial/web-new/commit/dabf153bb086592bf84c790cc2ce8fa085620df4))
* pin version and fix auth cookie persisting ([48ae40b](https://github.com/lemonadesocial/web-new/commit/48ae40bd26fe7e8b568300faf21894bcd1270957))
* price chart ([5f6a139](https://github.com/lemonadesocial/web-new/commit/5f6a139ecbce6e2f1855c8e8ac93517466d8c4f1))
* red envelopes ([db08742](https://github.com/lemonadesocial/web-new/commit/db0874258a504373852f904621bb3513318b6bb1))
* refactor generate image - mint contract flow ([fb406d1](https://github.com/lemonadesocial/web-new/commit/fb406d1820aea5a7e89051ce1efbacbf3dfbd40b))
* remove cookie check ([83b3c4e](https://github.com/lemonadesocial/web-new/commit/83b3c4ea50dfbc878abf59d9287d989b5303d59b))
* remove old files ([91c13ad](https://github.com/lemonadesocial/web-new/commit/91c13ad776717748d58a347a9063e27c40e01d7d))
* remove test ([3041588](https://github.com/lemonadesocial/web-new/commit/3041588682a6a1b026a85e90051dfea8e09d89af))
* remove testing ([28cc7a2](https://github.com/lemonadesocial/web-new/commit/28cc7a2e00139e9eef75160bd1b599aba59dd464))
* remove unused ([956ec63](https://github.com/lemonadesocial/web-new/commit/956ec6346b2323316c1806c7198b81f4522cae0d))
* replace passport image cache ([bf4966f](https://github.com/lemonadesocial/web-new/commit/bf4966fe27f10f5aa4b2e14e279f5fb01d964dd1))
* revert ([3d62875](https://github.com/lemonadesocial/web-new/commit/3d62875c9017b084b78f5860cc3284651dc066e8))
* revert testing ([0d1fbfd](https://github.com/lemonadesocial/web-new/commit/0d1fbfdaafc876e6b497aa965b7186261513f4fd))
* rm unused ([f61ecd6](https://github.com/lemonadesocial/web-new/commit/f61ecd600b7f5594adaeb41c164a335f26dd50bf))
* rm unused - update colors state ([b9b52bd](https://github.com/lemonadesocial/web-new/commit/b9b52bd7cf3df84a079154a258588f065489b040))
* share create form event ([ceacf79](https://github.com/lemonadesocial/web-new/commit/ceacf79b0ae4ef0fff59ab39d7e6e308f7459d62))
* sort import ([066d866](https://github.com/lemonadesocial/web-new/commit/066d866fc61577c89b17d30e1fbc8d1da8e0e600))
* subcoins ([099c4b1](https://github.com/lemonadesocial/web-new/commit/099c4b1952c9ace33c5af61a1b4cd435b4d5547b))
* support mint erc20 for minting passport ([e4ca1be](https://github.com/lemonadesocial/web-new/commit/e4ca1be002ca1b44cc63cb7926b4296b3837c02a))
* **temp:** hide all coins ([a509b27](https://github.com/lemonadesocial/web-new/commit/a509b27f7d25154412a9274a7add9bd2dffa41e0))
* **temp:** hide coin features ([886f053](https://github.com/lemonadesocial/web-new/commit/886f0539bf7d6a63b2c1560810374556c0bced58))
* testing zugrama generate og ([b3c4cee](https://github.com/lemonadesocial/web-new/commit/b3c4ceebec3db45dd9c874ee1cd7a85237703074))
* ticket sold ([ed1ed17](https://github.com/lemonadesocial/web-new/commit/ed1ed17539eb4dd965cfae4337e2b60c454ab450))
* truncate ticket title ([c3bb639](https://github.com/lemonadesocial/web-new/commit/c3bb639b82994bea94866b4a1db9dee0c4520d27))
* udpate config - ui mobile view ([b73852a](https://github.com/lemonadesocial/web-new/commit/b73852a1bfac402d92fcde68a361e76f7614baae))
* udpate vinyl nation passport ([3f4bf79](https://github.com/lemonadesocial/web-new/commit/3f4bf79852190b83b37a47ce08a7cc796e2d16c5))
* udpate widgets content ([3fef546](https://github.com/lemonadesocial/web-new/commit/3fef546dbcf03380087caa7cf4a1268608ca31be))
* update agent ([c8cab4e](https://github.com/lemonadesocial/web-new/commit/c8cab4eee2f1ba1a3e1f847138a904ea9771abd3))
* update agent ([c9a16ab](https://github.com/lemonadesocial/web-new/commit/c9a16ab5b39431fd8fb8d433f5ad10b1f03ae386))
* update alzena world passport ([c90e1d1](https://github.com/lemonadesocial/web-new/commit/c90e1d19037900e45d6ac34459f743a0a5a0b4d8))
* update alzena-world nft description ([df38d7a](https://github.com/lemonadesocial/web-new/commit/df38d7aa0c24eaabae1963b4fd2bbac60f3af506))
* update animate ([1550202](https://github.com/lemonadesocial/web-new/commit/15502024b5fccdc1fc567293e4446a8077bf1a82))
* update assets config for festival passport ([fd197b5](https://github.com/lemonadesocial/web-new/commit/fd197b5efef2be8c90576975f19c8b2ab32f19f6))
* update bg after mean ([72d691d](https://github.com/lemonadesocial/web-new/commit/72d691dbda5cf8be973de155cc89b0f55dac0214))
* update bg and font for shared passport ([862b2b6](https://github.com/lemonadesocial/web-new/commit/862b2b6ef1b7f5f803b605c89713620d04db5080))
* update bg image theme build with new template community hub ([dd4f5f0](https://github.com/lemonadesocial/web-new/commit/dd4f5f0443b91f15760666e8ccf1a8c5c2a6b648))
* update bg share ([84b6686](https://github.com/lemonadesocial/web-new/commit/84b66864bd8a9e8275d1dba59a8fe1e1c7b501bf))
* update block explore url from chain ([aee7a82](https://github.com/lemonadesocial/web-new/commit/aee7a8299dae425169b54b9672f44f150247a80e))
* update bottom bar ([8b50bf8](https://github.com/lemonadesocial/web-new/commit/8b50bf8c2aacab98b92443ca8fcb435e63b6c88a))
* update chart community coin widget ([52fa452](https://github.com/lemonadesocial/web-new/commit/52fa452cf0ef175e918e847dfcb1ecfed47a7aad))
* update chart ui ([5230672](https://github.com/lemonadesocial/web-new/commit/523067243aed64cbfb57c35049c4623f5ec35338))
* update chat community ([69a6f53](https://github.com/lemonadesocial/web-new/commit/69a6f53bf74b4744cd41e2664064f4948ae5112e))
* update chat community ([166f2d7](https://github.com/lemonadesocial/web-new/commit/166f2d78ed32f26bd84d649f833614b54e684b31))
* update chat component ([dfd47f7](https://github.com/lemonadesocial/web-new/commit/dfd47f7c1d3828f11138abd2d110aad3d2b44e6a))
* update codegen ([28b7041](https://github.com/lemonadesocial/web-new/commit/28b704101cbbf6e53a82aa495426517f341a4bca))
* update coins home page ([caffde2](https://github.com/lemonadesocial/web-new/commit/caffde2a7285321ae7c908f43ba5c15ce1defcab))
* update coins in home page ([507fc5d](https://github.com/lemonadesocial/web-new/commit/507fc5db79cdb9c26640c98b6c66adbd6928104d))
* update community favicon ([40fa333](https://github.com/lemonadesocial/web-new/commit/40fa3334f1ecf7659072b4bd6a2238229fc79203))
* update community form ([f76fb3a](https://github.com/lemonadesocial/web-new/commit/f76fb3acb8d525e64237fc4e27fe531a552f7739))
* update community template sidebar ([b32dd35](https://github.com/lemonadesocial/web-new/commit/b32dd352011deaba287aca6c1b2e1819f7a37b61))
* update config fonts ([6a431ce](https://github.com/lemonadesocial/web-new/commit/6a431ce6aec8ce949b9bd4aa224ec8b0667f9be1))
* update contract ([a0acce8](https://github.com/lemonadesocial/web-new/commit/a0acce84503307dc160d442682ec83b0d77ca2aa))
* update contract address alzena world ([9595bb1](https://github.com/lemonadesocial/web-new/commit/9595bb1fe4860de4b988c0cde99d0867aa12ff8d))
* update create group params ([9bcf8c9](https://github.com/lemonadesocial/web-new/commit/9bcf8c981df4e37641999988a9a9a8991364365b))
* update create pane community ([20475d7](https://github.com/lemonadesocial/web-new/commit/20475d7c4676d81f9c65e419146e0649759fe5c6))
* update creator ([6f402e4](https://github.com/lemonadesocial/web-new/commit/6f402e4fc3a0e23f792a1beb440e5fff78a48457))
* update custom passport image for template ([f4a9782](https://github.com/lemonadesocial/web-new/commit/f4a978249976aa84553726bc089a12f8ed612a34))
* update description intro screen. ([85be871](https://github.com/lemonadesocial/web-new/commit/85be871005e13080a479af66b024c30b30d2b44f))
* update dns config ([0bf9f2b](https://github.com/lemonadesocial/web-new/commit/0bf9f2b6bb0c8ccd3902a9ca3b931997d60b5599))
* update dns record values ([22b5573](https://github.com/lemonadesocial/web-new/commit/22b5573fbdca4a291350d63b615ce0a159af060f))
* update drawer ([eca430b](https://github.com/lemonadesocial/web-new/commit/eca430ba6f9e9e5d5e7182ca7f6957f6544b409c))
* update drawer fixed layout ([e5be783](https://github.com/lemonadesocial/web-new/commit/e5be783070e3ae6fbe9599dd3c116aaccbc7ce0b))
* update empty chart data ([37b93fd](https://github.com/lemonadesocial/web-new/commit/37b93fd0c7db15067b2cc61ffee16af11aa6a5f7))
* update empty upcoming events widget ([9acbf18](https://github.com/lemonadesocial/web-new/commit/9acbf185b4efe6e60cb0dbfab634e62c9282ec51))
* update err msg ([588d7fe](https://github.com/lemonadesocial/web-new/commit/588d7fec66433689eb738b203de5cabc09338fd7))
* update error message ([a9c3e9a](https://github.com/lemonadesocial/web-new/commit/a9c3e9a82a02ffcdc5ef5134698108f5ef2f94b3))
* update explore page ([2e9c9ce](https://github.com/lemonadesocial/web-new/commit/2e9c9ce55c47f42620606378d88cca3ebce1db73))
* update festival passport ([e0b3bc0](https://github.com/lemonadesocial/web-new/commit/e0b3bc05fdfe3f09b5dc8c8b3dfbdeb29d02a03c))
* update figtree black font ([f3d42b2](https://github.com/lemonadesocial/web-new/commit/f3d42b249b5d665937d1ed37d67f0849be659741))
* update fluffle ([49b6695](https://github.com/lemonadesocial/web-new/commit/49b6695e853825fb16d4d6006b8fb796b39a2c8d))
* update fluffle use ([28e4ffc](https://github.com/lemonadesocial/web-new/commit/28e4ffc58de70437b6a85a82696bd9e1f2fc050c))
* update fonts ([230c3aa](https://github.com/lemonadesocial/web-new/commit/230c3aa45f77dc7bc3e15ce2800d5c22fb85bec6))
* update get mint data ([cc42960](https://github.com/lemonadesocial/web-new/commit/cc4296081e16a9d8053ea2a63427f31b69c247bd))
* update get mint data alzena world passport api ([ff4be7a](https://github.com/lemonadesocial/web-new/commit/ff4be7a2967a439b918ac7ce003052262d022839))
* update get mint data api ([ed954e7](https://github.com/lemonadesocial/web-new/commit/ed954e76d064d0f382528418323c0b80ab741fbc))
* update grid cols ([2e4e537](https://github.com/lemonadesocial/web-new/commit/2e4e5375a454bc51486d0b4270f9cb0c3c1dacd4))
* update holder count ([403cf41](https://github.com/lemonadesocial/web-new/commit/403cf41f0b6d1e08a48581c152a88997b7a9d20d))
* update home page ([df4b926](https://github.com/lemonadesocial/web-new/commit/df4b9267ee4835ce0023d86f0764e50a77a4ba87))
* update indexer ([7ceca88](https://github.com/lemonadesocial/web-new/commit/7ceca8803a185350edd12494b30e3e5c9ee4951a))
* update ipfs env ([2192a44](https://github.com/lemonadesocial/web-new/commit/2192a44feee1b0f7c4f4f382ef0784c08e7cea14))
* update keyboard avoid sheet mobile view ([d3ddb02](https://github.com/lemonadesocial/web-new/commit/d3ddb020ef26eb19b1871af5fe0906bd853ec79f))
* update layout ([7b2846f](https://github.com/lemonadesocial/web-new/commit/7b2846f9899a24d2342e04dfeb6462ea018e7796))
* update layout non login state ([dfe1453](https://github.com/lemonadesocial/web-new/commit/dfe14530e6d7c3bfc6988097b7175b8439c4481a))
* update layout template ([d8d4641](https://github.com/lemonadesocial/web-new/commit/d8d46413da87c317863ce2b0e1878cb4fa239fc6))
* update layout token page ([a0f1d54](https://github.com/lemonadesocial/web-new/commit/a0f1d547178779562d751e04ecd59709ccaf3b7b))
* update layout with sidebar mobile view ([fc97adf](https://github.com/lemonadesocial/web-new/commit/fc97adfbd08637a5d0bad1b79aadaf787f0330f1))
* update lemonade username metadata desc ([7d82047](https://github.com/lemonadesocial/web-new/commit/7d82047465004a0a678b885ac632200805a6dec4))
* update loading state minting ([cffbc23](https://github.com/lemonadesocial/web-new/commit/cffbc232e919ef4b61bbce146d5952474879d72d))
* update lock ([2956487](https://github.com/lemonadesocial/web-new/commit/295648756734cfdb833c5810fb55cd0e4d5733e1))
* update megaeth chain id on prod ([efa9ea5](https://github.com/lemonadesocial/web-new/commit/efa9ea5f4ed3c79bf9e459afceb23ef1f903044c))
* update menu ([0b46343](https://github.com/lemonadesocial/web-new/commit/0b463435920082bcad4bb4f20fdb2ce7146f5461))
* update mint data ([6b9c16f](https://github.com/lemonadesocial/web-new/commit/6b9c16f78be9f49cbbde1be905055c97e31fc0d0))
* update mobile view ([678d680](https://github.com/lemonadesocial/web-new/commit/678d68051e575c191c673eafd0baaef5990beb10))
* update modal ([0d74cb2](https://github.com/lemonadesocial/web-new/commit/0d74cb278f0879acfa3709381233791a0424a000))
* update new flow username - contract adress ([a2aa379](https://github.com/lemonadesocial/web-new/commit/a2aa379f4273ac701f8980e83dfcb708228685e2))
* update new tokens ([260d054](https://github.com/lemonadesocial/web-new/commit/260d05434160f85300ff6577cb3f6780c7b613d0))
* update og festival nation ([54704fd](https://github.com/lemonadesocial/web-new/commit/54704fd13f8ecd911417d37b2a87b45192fb9757))
* update page events community ([4e92557](https://github.com/lemonadesocial/web-new/commit/4e92557e538313297a94d13c72152b080c79a73c))
* update page title - rm unused ([b71a0f3](https://github.com/lemonadesocial/web-new/commit/b71a0f36ec071c257e6e1153b705d561b75fec39))
* update passport - community coin widgets ([084fac9](https://github.com/lemonadesocial/web-new/commit/084fac97ff32d544eb0b902af1f31b9bef86f57e))
* update passport api ([e07350a](https://github.com/lemonadesocial/web-new/commit/e07350ad176b625ec01d261f03eca783b43175c8))
* update path ([b0297d6](https://github.com/lemonadesocial/web-new/commit/b0297d6474f0887a15059114de088282b6395be8))
* update path og ([cdd5ee6](https://github.com/lemonadesocial/web-new/commit/cdd5ee68bae093c1d2d90b084db3d5df033dd472))
* update provider generate passport ([28ee7f3](https://github.com/lemonadesocial/web-new/commit/28ee7f3371fb51728b79976c36d61b763e969b41))
* update query mint data ([39a4327](https://github.com/lemonadesocial/web-new/commit/39a4327d05803aa865c9ccd111dac5f0dcd6637f))
* update query params ([ba971f9](https://github.com/lemonadesocial/web-new/commit/ba971f9bfebbb27940bf91763a76db111eeb730a))
* update reflect data from ai ([6a61f98](https://github.com/lemonadesocial/web-new/commit/6a61f98bb977f0a2fb812abd30a43050ff681ca1))
* update render markdown ([10f320b](https://github.com/lemonadesocial/web-new/commit/10f320be651035c611d7aad272c504becd4c22d5))
* update social links ([63e0aec](https://github.com/lemonadesocial/web-new/commit/63e0aec047ba7a2bb03db81bd608d3c5e2f7ae39))
* update social size ([1485aae](https://github.com/lemonadesocial/web-new/commit/1485aaee0b3a6356a2a26bca24cf87aaf668baa5))
* update space on coin page ([641351e](https://github.com/lemonadesocial/web-new/commit/641351e0b395af09b48c9824e4df54807d37448a))
* update staked value wallet widgets ([909b3a1](https://github.com/lemonadesocial/web-new/commit/909b3a1082f02b2c50a119952a8600bfede5bdca))
* update style sidebar ([2e145f9](https://github.com/lemonadesocial/web-new/commit/2e145f948d62ec3da44259d2b94128adeca69196))
* update subtitle passport card template community alzena world ([4f45f6f](https://github.com/lemonadesocial/web-new/commit/4f45f6f6a042d8c896448951ed189c9003bb6247))
* update text ([ac85286](https://github.com/lemonadesocial/web-new/commit/ac85286aefd9eda6317a833759d71a6a8317a798))
* update text intro ([06e7569](https://github.com/lemonadesocial/web-new/commit/06e7569f4de6a35425c3a79655f582b1cc2a80af))
* update text widget upcoming event ([c890f77](https://github.com/lemonadesocial/web-new/commit/c890f7793294145a7a03329dd2555eb2b81dfb36))
* update ticket filter ([f8858fd](https://github.com/lemonadesocial/web-new/commit/f8858fd7ed347d337cf0f5a6900ea4b86f1f90a6))
* update ticket symbol ([2a03824](https://github.com/lemonadesocial/web-new/commit/2a03824ac5f60b50ffd35810dd7680bc8c658ffa))
* update time format ([c57c007](https://github.com/lemonadesocial/web-new/commit/c57c0070d1349d1f8b4ed4fe25ea797073517a12))
* update title passport ([13360e2](https://github.com/lemonadesocial/web-new/commit/13360e22f2741e560c4d3530e146f43d4203627b))
* update tokens fair launch ([da0a2d1](https://github.com/lemonadesocial/web-new/commit/da0a2d1a113bed933b857c527d79b786d837ac24))
* update usdc format ([60caf1d](https://github.com/lemonadesocial/web-new/commit/60caf1de4125f5320b0a1e331a6545c7cb28546c))
* update username ([e2e7677](https://github.com/lemonadesocial/web-new/commit/e2e767718661407d0856433831963b23683f2614))
* update username indexer ([ece734b](https://github.com/lemonadesocial/web-new/commit/ece734b3a2892c799833889df887079b42f7838e))
* update vinyl icon ([ce62707](https://github.com/lemonadesocial/web-new/commit/ce62707c6ecdcf725079aaf9f75d6bf4095d4f44))
* update wallet check ([f6fb348](https://github.com/lemonadesocial/web-new/commit/f6fb34811de8a083cf20f3b94d11458f2bcd1a10))
* update widget layout ([386a4ff](https://github.com/lemonadesocial/web-new/commit/386a4ff744762e1f6bd833d761887bb9d0e6b0ec))
* update zugrama mint flow ([633a3ed](https://github.com/lemonadesocial/web-new/commit/633a3ed538edc0972f9246551bdd03d73340e229))
* update zugrama passport ([1017771](https://github.com/lemonadesocial/web-new/commit/10177713c257822bbb8504f6f122d0005c154856))
* update zugrama template ([ce734fc](https://github.com/lemonadesocial/web-new/commit/ce734fc261155e63282b739f34df153a1804684a))
* update zugrama template ([61b8808](https://github.com/lemonadesocial/web-new/commit/61b8808195fa20b1b4936435aa35b8ab0447b231))
* updated generate drip nation ([4026c0c](https://github.com/lemonadesocial/web-new/commit/4026c0c9e81b9a6a3972d80dc41e73a3da9b2619))
* upgrade next.js due to CVE-2025-66478 ([3ace23d](https://github.com/lemonadesocial/web-new/commit/3ace23ddff6954e8fdbfc6aee7ddd406334e2fe7))
* upgrade react security patches ([08c25e8](https://github.com/lemonadesocial/web-new/commit/08c25e86b3526b463ea189162fb8b9213d4b435b))
* use abstract abi ([17285c4](https://github.com/lemonadesocial/web-new/commit/17285c477a718c40ea9979fb48fa5020afedea6c))
* use real-time megaeth api ([d1f2fa5](https://github.com/lemonadesocial/web-new/commit/d1f2fa522af060cc5de5fcbed33adcf47d05e297))
* utm tracker ([e2408e8](https://github.com/lemonadesocial/web-new/commit/e2408e8c45a2e462733b32254f3a787379a3d459))
* withdraw coin ([06a0f0b](https://github.com/lemonadesocial/web-new/commit/06a0f0b25e02d90b00e9443acf2c07ebe25a2a1d))


### Bug Fixes

* add default native token ([636e79f](https://github.com/lemonadesocial/web-new/commit/636e79f9744b6347b4e5f84d43c4c0eeb28d895d))
* check env build time ([b4194e6](https://github.com/lemonadesocial/web-new/commit/b4194e6a72788a6e058a468086ebef3d70fc7cab))
* check initial data ([12adb73](https://github.com/lemonadesocial/web-new/commit/12adb73a10b814760a7861abc6863d9533fe83de))
* check passport provider as search params ([7275ce6](https://github.com/lemonadesocial/web-new/commit/7275ce60f6730a8dc00abb8258fba4ae17b3cb3f))
* check private ip ([9ca3d25](https://github.com/lemonadesocial/web-new/commit/9ca3d25c5b1d19e5219f4dee74a6873267c2dc49))
* check upload image dimension for scale ([94f6aaf](https://github.com/lemonadesocial/web-new/commit/94f6aaf3fbd48b0c0d201ea2f3cccad2251b59da))
* checking image cache ([c500b25](https://github.com/lemonadesocial/web-new/commit/c500b25715e08f6f08350abcbae1c1d18a7c306e))
* coin info card ([41ce2b8](https://github.com/lemonadesocial/web-new/commit/41ce2b8927845f8a5c483b75823ac2b3ae48c2dc))
* correct lookup func ([fda08c5](https://github.com/lemonadesocial/web-new/commit/fda08c5fa4d51cbe683cd665200887f913a0694e))
* correct provider ([a5b7410](https://github.com/lemonadesocial/web-new/commit/a5b7410d9f7899c42f79f2f25196a62af6376d2a))
* correct provider ([c8e64d8](https://github.com/lemonadesocial/web-new/commit/c8e64d8da83ca5460ba965d16a637a4ef6c6a34a))
* default theme ([a94cd76](https://github.com/lemonadesocial/web-new/commit/a94cd76d53fbe51a395aed3ff433853cfe5b976b))
* disable the openGraph endpoint ([5f191b4](https://github.com/lemonadesocial/web-new/commit/5f191b4ecfb8cdce299ca6874d0bef0c0d129246))
* display correct datetime ([8ef6f35](https://github.com/lemonadesocial/web-new/commit/8ef6f359eeb5d4442aff98d9501b689dbd7349c6))
* drawer witdh ([ff035c2](https://github.com/lemonadesocial/web-new/commit/ff035c20f03696729e2a15ca791083733d6fb48b))
* ens name ([73e81d3](https://github.com/lemonadesocial/web-new/commit/73e81d30d3f2212c190b2c9777c5d065285991fe))
* explore padding ([ae05fd1](https://github.com/lemonadesocial/web-new/commit/ae05fd16a8a0f16ec3339a14cc0762fe58a2130e))
* feature hub issue ([8308afc](https://github.com/lemonadesocial/web-new/commit/8308afc4b73e85780f5c4af99218d8aba9751993))
* filter default domain ([bf00328](https://github.com/lemonadesocial/web-new/commit/bf003285a9697d95ad839fcf91f890c7b5e541c4))
* group date events list community ([3759599](https://github.com/lemonadesocial/web-new/commit/3759599b9e50b74266c4f3d72145e4bb3f93d8d4))
* import path ([15a5d83](https://github.com/lemonadesocial/web-new/commit/15a5d8325f8308a15816b379a1110853bfc4ee3e))
* map form fields ([34c17b5](https://github.com/lemonadesocial/web-new/commit/34c17b591450416c9b12392249d0fd7298f077de))
* merge data respone instead of replace ([b6fbd19](https://github.com/lemonadesocial/web-new/commit/b6fbd19e0b683cb2e4a28b7da4941bcc57158fa9))
* missing chainmap ([6af2364](https://github.com/lemonadesocial/web-new/commit/6af2364226e2dced9268496ec2d9c2fdbe4f4a79))
* missing check empty space ([f41ee35](https://github.com/lemonadesocial/web-new/commit/f41ee353b6f4a05eabaa67290b570e949cba6152))
* missing check id ([393ac71](https://github.com/lemonadesocial/web-new/commit/393ac71c513a4812dd4717b8ec4b1c5d478c3edf))
* missing deploy vars ([97e5256](https://github.com/lemonadesocial/web-new/commit/97e525622ecef9d25e0476e4130ba52a2edbd701))
* missing link ([c14297a](https://github.com/lemonadesocial/web-new/commit/c14297ae2e4f48fcf97d75c32eb66c5e09817452))
* missing space id in launchpad group ([b01890c](https://github.com/lemonadesocial/web-new/commit/b01890c5a8b034475ca22ab8f125fe59fea201af))
* pane footer ([1bcce41](https://github.com/lemonadesocial/web-new/commit/1bcce411c00de3ff1ed50a889e396367b0ed84e5))
* provider ([02c11c9](https://github.com/lemonadesocial/web-new/commit/02c11c95a52c6d5979cfb68bdd522cbe2cf8dd6b))
* remove console ([f8489f3](https://github.com/lemonadesocial/web-new/commit/f8489f35c26f10c216b052792d7653990dfd3bbb))
* remove dollar sign ([97f61d2](https://github.com/lemonadesocial/web-new/commit/97f61d26ca836142417a62bfbac18d686cf33dd0))
* remove lens connect in settings ([c5178dd](https://github.com/lemonadesocial/web-new/commit/c5178dd3a0ae78e544e94c8f2aad86d9af72d6fe))
* remove lens profile connect after signing up ([b1a813a](https://github.com/lemonadesocial/web-new/commit/b1a813a9bdc8f7d20be1d2c40f4ab272bc0ae925))
* remove lens profile from user menu ([07f1cc2](https://github.com/lemonadesocial/web-new/commit/07f1cc2aa3c0e93b00bdcc5680e016875f6d15d9))
* remove lens profile in settings ([cc93f84](https://github.com/lemonadesocial/web-new/commit/cc93f8432011a5bb08b897a85f57fb0e68c218b5))
* remove self ([755904d](https://github.com/lemonadesocial/web-new/commit/755904d9db3987ad84fd337b12ce091e494227c8))
* resolve conflicts ([b608568](https://github.com/lemonadesocial/web-new/commit/b608568e90e69e364b13165f21db048c84191f02))
* rm view all - open new tab community hub ([f704f73](https://github.com/lemonadesocial/web-new/commit/f704f7329ef759f00d05342c5329a829a2e545d5))
* table coin overlap ([3cd9790](https://github.com/lemonadesocial/web-new/commit/3cd979010d28410a86c1c2dc4b7edaaa27eb6bb7))
* template menu ([c89533c](https://github.com/lemonadesocial/web-new/commit/c89533c386a214afd33ff9f3c88af468b7ad06b0))
* textarea max height ([443ee63](https://github.com/lemonadesocial/web-new/commit/443ee632ac7bb6039a1dea3669e9b27241e60998))
* theme flow ([03a7e3b](https://github.com/lemonadesocial/web-new/commit/03a7e3b00dce89f20136a6aadd05729a38b4ddaa))
* theme override widgets ([fe14c93](https://github.com/lemonadesocial/web-new/commit/fe14c932ef0927ef97191c500ac756ddf60bdbcb))
* update delete ticket type action ([b4d25c4](https://github.com/lemonadesocial/web-new/commit/b4d25c43741e3fdda361a926344b9911294fbffb))
* update next check ([fc36a72](https://github.com/lemonadesocial/web-new/commit/fc36a72761ff88d7fd65cc48526095b5ab56bf0c))
* update passport api ([aab9120](https://github.com/lemonadesocial/web-new/commit/aab9120ed247451da056ee6a19979f0aa8690c3e))
* update username store ([0887f91](https://github.com/lemonadesocial/web-new/commit/0887f918d30d6fb6670de780adf0baa8bf0569ef))
* upgrade alpine ([22dacd9](https://github.com/lemonadesocial/web-new/commit/22dacd902dbbd7ca6f117b95644fac2c862ac9a3))
* username check debounce ([8b36bb8](https://github.com/lemonadesocial/web-new/commit/8b36bb83b66db0d6002f8e207c622b9976250d67))
* valid url before extract info ([adf28df](https://github.com/lemonadesocial/web-new/commit/adf28df7754bfcb0e76556d2ceb0557813b54d93))
* wrong generate passport ([a26462a](https://github.com/lemonadesocial/web-new/commit/a26462ad26c2249636db1e21e730070bb82ad49e))
* wrong path ([69f3f67](https://github.com/lemonadesocial/web-new/commit/69f3f67b19af05125a9eb0d933a30a5b46a0c04e))
* wrong path placeholder ([ccd23e8](https://github.com/lemonadesocial/web-new/commit/ccd23e8d724edf1bf22b7dd2446d23f9097e9277))

## [9.26.0](https://github.com/lemonadesocial/web-new/compare/v9.25.0...v9.26.0) (2026-02-10)


### Features

* red envelopes ([db08742](https://github.com/lemonadesocial/web-new/commit/db0874258a504373852f904621bb3513318b6bb1))

## [9.26.0](https://github.com/lemonadesocial/web-new/compare/v9.25.0...v9.26.0) (2026-02-10)


### Features

* red envelopes ([db08742](https://github.com/lemonadesocial/web-new/commit/db0874258a504373852f904621bb3513318b6bb1))

## [9.25.0](https://github.com/lemonadesocial/web-new/compare/v9.24.0...v9.25.0) (2026-02-10)


### Features

* update description intro screen. ([85be871](https://github.com/lemonadesocial/web-new/commit/85be871005e13080a479af66b024c30b30d2b44f))

## [9.24.0](https://github.com/lemonadesocial/web-new/compare/v9.23.0...v9.24.0) (2026-02-10)


### Features

* support mint erc20 for minting passport ([e4ca1be](https://github.com/lemonadesocial/web-new/commit/e4ca1be002ca1b44cc63cb7926b4296b3837c02a))

## [9.23.0](https://github.com/lemonadesocial/web-new/compare/v9.22.0...v9.23.0) (2026-02-09)


### Features

* update block explore url from chain ([aee7a82](https://github.com/lemonadesocial/web-new/commit/aee7a8299dae425169b54b9672f44f150247a80e))

## [9.22.0](https://github.com/lemonadesocial/web-new/compare/v9.21.0...v9.22.0) (2026-02-09)


### Features

* display wrong passport minted ([73754cc](https://github.com/lemonadesocial/web-new/commit/73754cc2998350bcd10a4960cfa56bccacad1aa7))

## [9.21.0](https://github.com/lemonadesocial/web-new/compare/v9.20.0...v9.21.0) (2026-02-09)


### Features

* update alzena-world nft description ([df38d7a](https://github.com/lemonadesocial/web-new/commit/df38d7aa0c24eaabae1963b4fd2bbac60f3af506))

## [9.20.0](https://github.com/lemonadesocial/web-new/compare/v9.19.0...v9.20.0) (2026-02-09)


### Features

* update keyboard avoid sheet mobile view ([d3ddb02](https://github.com/lemonadesocial/web-new/commit/d3ddb020ef26eb19b1871af5fe0906bd853ec79f))
* update style sidebar ([2e145f9](https://github.com/lemonadesocial/web-new/commit/2e145f948d62ec3da44259d2b94128adeca69196))

## [9.19.0](https://github.com/lemonadesocial/web-new/compare/v9.18.1...v9.19.0) (2026-02-07)


### Features

* add agents tab manage community ([d0a14eb](https://github.com/lemonadesocial/web-new/commit/d0a14eb259e7ece3110c8881535a132b9ec2df97))


### Bug Fixes

* table coin overlap ([3cd9790](https://github.com/lemonadesocial/web-new/commit/3cd979010d28410a86c1c2dc4b7edaaa27eb6bb7))

## [9.18.1](https://github.com/lemonadesocial/web-new/compare/v9.18.0...v9.18.1) (2026-02-05)


### Bug Fixes

* textarea max height ([443ee63](https://github.com/lemonadesocial/web-new/commit/443ee632ac7bb6039a1dea3669e9b27241e60998))

## [9.18.0](https://github.com/lemonadesocial/web-new/compare/v9.17.1...v9.18.0) (2026-02-04)


### Features

* add knowledge page ([27c90b3](https://github.com/lemonadesocial/web-new/commit/27c90b3c7df0d0ec47fe0ace8c68b49d7437c21e))
* update agent ([c8cab4e](https://github.com/lemonadesocial/web-new/commit/c8cab4eee2f1ba1a3e1f847138a904ea9771abd3))
* update agent ([c9a16ab](https://github.com/lemonadesocial/web-new/commit/c9a16ab5b39431fd8fb8d433f5ad10b1f03ae386))

## [9.17.1](https://github.com/lemonadesocial/web-new/compare/v9.17.0...v9.17.1) (2026-02-02)


### Bug Fixes

* missing check id ([393ac71](https://github.com/lemonadesocial/web-new/commit/393ac71c513a4812dd4717b8ec4b1c5d478c3edf))

## [9.17.0](https://github.com/lemonadesocial/web-new/compare/v9.16.0...v9.17.0) (2026-02-02)


### Features

* batch update event cache ([fff7398](https://github.com/lemonadesocial/web-new/commit/fff739870ef9f38ae31a286ae5d7984e9ea4da98))
* remove unused ([956ec63](https://github.com/lemonadesocial/web-new/commit/956ec6346b2323316c1806c7198b81f4522cae0d))
* revert testing ([0d1fbfd](https://github.com/lemonadesocial/web-new/commit/0d1fbfdaafc876e6b497aa965b7186261513f4fd))
* update chat community ([69a6f53](https://github.com/lemonadesocial/web-new/commit/69a6f53bf74b4744cd41e2664064f4948ae5112e))
* update chat community ([166f2d7](https://github.com/lemonadesocial/web-new/commit/166f2d78ed32f26bd84d649f833614b54e684b31))
* update layout non login state ([dfe1453](https://github.com/lemonadesocial/web-new/commit/dfe14530e6d7c3bfc6988097b7175b8439c4481a))
* update reflect data from ai ([6a61f98](https://github.com/lemonadesocial/web-new/commit/6a61f98bb977f0a2fb812abd30a43050ff681ca1))

## [9.16.0](https://github.com/lemonadesocial/web-new/compare/v9.15.0...v9.16.0) (2026-01-30)


### Features

* missing boiler plate image ([9d18ee0](https://github.com/lemonadesocial/web-new/commit/9d18ee00ea775c9b9ca8bbd5b42b2ad7efa7debb))
* missing minted lemonhead step ([dbcd411](https://github.com/lemonadesocial/web-new/commit/dbcd411b012bd0158b7594dbe2d9645dac73de1f))


### Bug Fixes

* missing deploy vars ([97e5256](https://github.com/lemonadesocial/web-new/commit/97e525622ecef9d25e0476e4130ba52a2edbd701))
* wrong generate passport ([a26462a](https://github.com/lemonadesocial/web-new/commit/a26462ad26c2249636db1e21e730070bb82ad49e))

## [9.15.0](https://github.com/lemonadesocial/web-new/compare/v9.14.0...v9.15.0) (2026-01-28)


### Features

* disbable overlay color change ([f5ee86a](https://github.com/lemonadesocial/web-new/commit/f5ee86adf8e989d3ae7c1126738be4db78d9401c))
* minimal colors ([10b59d9](https://github.com/lemonadesocial/web-new/commit/10b59d9db2209ca28461a1e71b1bc0616d651b26))
* update community favicon ([40fa333](https://github.com/lemonadesocial/web-new/commit/40fa3334f1ecf7659072b4bd6a2238229fc79203))


### Bug Fixes

* default theme ([a94cd76](https://github.com/lemonadesocial/web-new/commit/a94cd76d53fbe51a395aed3ff433853cfe5b976b))
* drawer witdh ([ff035c2](https://github.com/lemonadesocial/web-new/commit/ff035c20f03696729e2a15ca791083733d6fb48b))
* template menu ([c89533c](https://github.com/lemonadesocial/web-new/commit/c89533c386a214afd33ff9f3c88af468b7ad06b0))
* theme flow ([03a7e3b](https://github.com/lemonadesocial/web-new/commit/03a7e3b00dce89f20136a6aadd05729a38b4ddaa))

## [9.14.0](https://github.com/lemonadesocial/web-new/compare/v9.13.0...v9.14.0) (2026-01-26)


### Features

* checking file path ([bd33f42](https://github.com/lemonadesocial/web-new/commit/bd33f42a005a2ff79885c9607a85bfc99d41b843))
* replace passport image cache ([bf4966f](https://github.com/lemonadesocial/web-new/commit/bf4966fe27f10f5aa4b2e14e279f5fb01d964dd1))

## [9.13.0](https://github.com/lemonadesocial/web-new/compare/v9.12.0...v9.13.0) (2026-01-26)


### Features

* check can mint for go next ([f5870ad](https://github.com/lemonadesocial/web-new/commit/f5870ad1a691c4bda1d50538207c1188f2b08c88))
* checking cache ([44bdadb](https://github.com/lemonadesocial/web-new/commit/44bdadb8c98ce560e71a19df337866d8125d5783))


### Bug Fixes

* checking image cache ([c500b25](https://github.com/lemonadesocial/web-new/commit/c500b25715e08f6f08350abcbae1c1d18a7c306e))
* theme override widgets ([fe14c93](https://github.com/lemonadesocial/web-new/commit/fe14c932ef0927ef97191c500ac756ddf60bdbcb))

## [9.12.0](https://github.com/lemonadesocial/web-new/compare/v9.11.0...v9.12.0) (2026-01-26)


### Features

* check whitelist ([1921c4e](https://github.com/lemonadesocial/web-new/commit/1921c4e76a905d6263c4d5d1ed5afa359d61c884))
* update custom passport image for template ([f4a9782](https://github.com/lemonadesocial/web-new/commit/f4a978249976aa84553726bc089a12f8ed612a34))
* update get mint data ([cc42960](https://github.com/lemonadesocial/web-new/commit/cc4296081e16a9d8053ea2a63427f31b69c247bd))
* update query mint data ([39a4327](https://github.com/lemonadesocial/web-new/commit/39a4327d05803aa865c9ccd111dac5f0dcd6637f))

## [9.11.0](https://github.com/lemonadesocial/web-new/compare/v9.10.0...v9.11.0) (2026-01-26)


### Features

* update dns record values ([22b5573](https://github.com/lemonadesocial/web-new/commit/22b5573fbdca4a291350d63b615ce0a159af060f))


### Bug Fixes

* remove dollar sign ([97f61d2](https://github.com/lemonadesocial/web-new/commit/97f61d26ca836142417a62bfbac18d686cf33dd0))

## [9.10.0](https://github.com/lemonadesocial/web-new/compare/v9.9.1...v9.10.0) (2026-01-26)


### Features

* update dns config ([0bf9f2b](https://github.com/lemonadesocial/web-new/commit/0bf9f2b6bb0c8ccd3902a9ca3b931997d60b5599))

## [9.9.1](https://github.com/lemonadesocial/web-new/compare/v9.9.0...v9.9.1) (2026-01-21)


### Bug Fixes

* filter default domain ([bf00328](https://github.com/lemonadesocial/web-new/commit/bf003285a9697d95ad839fcf91f890c7b5e541c4))

## [9.9.0](https://github.com/lemonadesocial/web-new/compare/v9.8.0...v9.9.0) (2026-01-20)


### Features

* custom domain ([6b57261](https://github.com/lemonadesocial/web-new/commit/6b572611cc75faab31d7dd6210eae0cecdab6d20))

## [9.8.0](https://github.com/lemonadesocial/web-new/compare/v9.7.0...v9.8.0) (2026-01-20)


### Features

* check-in access ([fc22001](https://github.com/lemonadesocial/web-new/commit/fc2200124d02367dc6cac5a8975800868dc51393))

## [9.7.0](https://github.com/lemonadesocial/web-new/compare/v9.6.0...v9.7.0) (2026-01-16)


### Features

* enable explore and tokens page ([4887500](https://github.com/lemonadesocial/web-new/commit/4887500d53a28c2493189a5fb53720a4cff7216f))

## [9.6.0](https://github.com/lemonadesocial/web-new/compare/v9.5.0...v9.6.0) (2026-01-16)


### Features

* update grid cols ([2e4e537](https://github.com/lemonadesocial/web-new/commit/2e4e5375a454bc51486d0b4270f9cb0c3c1dacd4))

## [9.5.0](https://github.com/lemonadesocial/web-new/compare/v9.4.0...v9.5.0) (2026-01-16)


### Features

* **lemonade-username:** add endpoint to retrieve metadata ([9d1c7ee](https://github.com/lemonadesocial/web-new/commit/9d1c7ee1f1f56364ae4268a639bc57fd4f1186b7))


### Bug Fixes

* rm view all - open new tab community hub ([f704f73](https://github.com/lemonadesocial/web-new/commit/f704f7329ef759f00d05342c5329a829a2e545d5))

## [9.4.0](https://github.com/lemonadesocial/web-new/compare/v9.3.2...v9.4.0) (2026-01-15)


### Features

* update page title - rm unused ([b71a0f3](https://github.com/lemonadesocial/web-new/commit/b71a0f36ec071c257e6e1153b705d561b75fec39))

## [9.3.2](https://github.com/lemonadesocial/web-new/compare/v9.3.1...v9.3.2) (2026-01-15)


### Bug Fixes

* add default native token ([636e79f](https://github.com/lemonadesocial/web-new/commit/636e79f9744b6347b4e5f84d43c4c0eeb28d895d))

## [9.3.1](https://github.com/lemonadesocial/web-new/compare/v9.3.0...v9.3.1) (2026-01-15)


### Bug Fixes

* username check debounce ([8b36bb8](https://github.com/lemonadesocial/web-new/commit/8b36bb83b66db0d6002f8e207c622b9976250d67))

## [9.3.0](https://github.com/lemonadesocial/web-new/compare/v9.2.0...v9.3.0) (2026-01-15)


### Features

* update ipfs env ([2192a44](https://github.com/lemonadesocial/web-new/commit/2192a44feee1b0f7c4f4f382ef0784c08e7cea14))
* update megaeth chain id on prod ([efa9ea5](https://github.com/lemonadesocial/web-new/commit/efa9ea5f4ed3c79bf9e459afceb23ef1f903044c))

## [9.2.0](https://github.com/lemonadesocial/web-new/compare/v9.1.1...v9.2.0) (2026-01-14)


### Features

* update lemonade username metadata desc ([7d82047](https://github.com/lemonadesocial/web-new/commit/7d82047465004a0a678b885ac632200805a6dec4))

## [9.1.1](https://github.com/lemonadesocial/web-new/compare/v9.1.0...v9.1.1) (2026-01-14)


### Bug Fixes

* check upload image dimension for scale ([94f6aaf](https://github.com/lemonadesocial/web-new/commit/94f6aaf3fbd48b0c0d201ea2f3cccad2251b59da))
* pane footer ([1bcce41](https://github.com/lemonadesocial/web-new/commit/1bcce411c00de3ff1ed50a889e396367b0ed84e5))

## [9.1.0](https://github.com/lemonadesocial/web-new/compare/v9.0.1...v9.1.0) (2026-01-13)


### Features

* update figtree black font ([f3d42b2](https://github.com/lemonadesocial/web-new/commit/f3d42b249b5d665937d1ed37d67f0849be659741))

## [9.0.1](https://github.com/lemonadesocial/web-new/compare/v9.0.0...v9.0.1) (2026-01-13)


### Bug Fixes

* display correct datetime ([8ef6f35](https://github.com/lemonadesocial/web-new/commit/8ef6f359eeb5d4442aff98d9501b689dbd7349c6))

## [9.0.0](https://github.com/lemonadesocial/web-new/compare/v8.47.1...v9.0.0) (2026-01-13)


### ⚠ BREAKING CHANGES

* check-in event

### Features

* check-in event ([f6d4533](https://github.com/lemonadesocial/web-new/commit/f6d453354eb0c175114f3b5bf107643c30620f75))

## [8.47.1](https://github.com/lemonadesocial/web-new/compare/v8.47.0...v8.47.1) (2026-01-10)


### Bug Fixes

* group date events list community ([3759599](https://github.com/lemonadesocial/web-new/commit/3759599b9e50b74266c4f3d72145e4bb3f93d8d4))

## [8.47.0](https://github.com/lemonadesocial/web-new/compare/v8.46.0...v8.47.0) (2026-01-09)


### Features

* custom gas limit ([ad6e68f](https://github.com/lemonadesocial/web-new/commit/ad6e68fc2648bf931d2d7468698f837dec9fc83e))

## [8.46.0](https://github.com/lemonadesocial/web-new/compare/v8.45.0...v8.46.0) (2026-01-08)


### Features

* update text widget upcoming event ([c890f77](https://github.com/lemonadesocial/web-new/commit/c890f7793294145a7a03329dd2555eb2b81dfb36))

## [8.45.0](https://github.com/lemonadesocial/web-new/compare/v8.44.1...v8.45.0) (2026-01-08)


### Features

* add alzena world theme ([d06a520](https://github.com/lemonadesocial/web-new/commit/d06a520ec36603aacf7495613b45125e4534b515))

## [8.44.1](https://github.com/lemonadesocial/web-new/compare/v8.44.0...v8.44.1) (2026-01-07)


### Bug Fixes

* check env build time ([b4194e6](https://github.com/lemonadesocial/web-new/commit/b4194e6a72788a6e058a468086ebef3d70fc7cab))

## [8.44.0](https://github.com/lemonadesocial/web-new/compare/v8.43.0...v8.44.0) (2026-01-07)


### Features

* init theme with passport template ([854c84c](https://github.com/lemonadesocial/web-new/commit/854c84ccdee5add4af7215d1363d86c8fcf97937))
* update community template sidebar ([b32dd35](https://github.com/lemonadesocial/web-new/commit/b32dd352011deaba287aca6c1b2e1819f7a37b61))
* update empty upcoming events widget ([9acbf18](https://github.com/lemonadesocial/web-new/commit/9acbf185b4efe6e60cb0dbfab634e62c9282ec51))
* update page events community ([4e92557](https://github.com/lemonadesocial/web-new/commit/4e92557e538313297a94d13c72152b080c79a73c))


### Bug Fixes

* remove console ([f8489f3](https://github.com/lemonadesocial/web-new/commit/f8489f35c26f10c216b052792d7653990dfd3bbb))

## [8.43.0](https://github.com/lemonadesocial/web-new/compare/v8.42.0...v8.43.0) (2026-01-07)


### Features

* hide create coin ([7b2e900](https://github.com/lemonadesocial/web-new/commit/7b2e900b0890598712cca4d88ed9195caa9f64c3))

## [8.42.0](https://github.com/lemonadesocial/web-new/compare/v8.41.0...v8.42.0) (2026-01-06)


### Features

* claim revenue ([9c97e53](https://github.com/lemonadesocial/web-new/commit/9c97e53c538da240ff39052746600ba72a2b8618))
* deposit coin ([92ffc4e](https://github.com/lemonadesocial/web-new/commit/92ffc4e8e40ea7a4c685c2f710386bb5032be08f))
* deposit in group ([218462b](https://github.com/lemonadesocial/web-new/commit/218462beaf04aac0ad60f4dc2a346f1a61e94b1c))
* optimize launchpad ([dabf153](https://github.com/lemonadesocial/web-new/commit/dabf153bb086592bf84c790cc2ce8fa085620df4))
* remove test ([3041588](https://github.com/lemonadesocial/web-new/commit/3041588682a6a1b026a85e90051dfea8e09d89af))
* update config fonts ([6a431ce](https://github.com/lemonadesocial/web-new/commit/6a431ce6aec8ce949b9bd4aa224ec8b0667f9be1))
* update fonts ([230c3aa](https://github.com/lemonadesocial/web-new/commit/230c3aa45f77dc7bc3e15ce2800d5c22fb85bec6))
* update zugrama template ([61b8808](https://github.com/lemonadesocial/web-new/commit/61b8808195fa20b1b4936435aa35b8ab0447b231))
* withdraw coin ([06a0f0b](https://github.com/lemonadesocial/web-new/commit/06a0f0b25e02d90b00e9443acf2c07ebe25a2a1d))


### Bug Fixes

* wrong path ([69f3f67](https://github.com/lemonadesocial/web-new/commit/69f3f67b19af05125a9eb0d933a30a5b46a0c04e))

## [8.41.0](https://github.com/lemonadesocial/web-new/compare/v8.40.2...v8.41.0) (2026-01-05)


### Features

* pin version and fix auth cookie persisting ([48ae40b](https://github.com/lemonadesocial/web-new/commit/48ae40bd26fe7e8b568300faf21894bcd1270957))
* remove testing ([28cc7a2](https://github.com/lemonadesocial/web-new/commit/28cc7a2e00139e9eef75160bd1b599aba59dd464))
* testing zugrama generate og ([b3c4cee](https://github.com/lemonadesocial/web-new/commit/b3c4ceebec3db45dd9c874ee1cd7a85237703074))
* update bg image theme build with new template community hub ([dd4f5f0](https://github.com/lemonadesocial/web-new/commit/dd4f5f0443b91f15760666e8ccf1a8c5c2a6b648))
* update zugrama passport ([1017771](https://github.com/lemonadesocial/web-new/commit/10177713c257822bbb8504f6f122d0005c154856))

## [8.40.2](https://github.com/lemonadesocial/web-new/compare/v8.40.1...v8.40.2) (2026-01-03)


### Bug Fixes

* missing check empty space ([f41ee35](https://github.com/lemonadesocial/web-new/commit/f41ee353b6f4a05eabaa67290b570e949cba6152))

## [8.40.1](https://github.com/lemonadesocial/web-new/compare/v8.40.0...v8.40.1) (2026-01-03)


### Bug Fixes

* feature hub issue ([8308afc](https://github.com/lemonadesocial/web-new/commit/8308afc4b73e85780f5c4af99218d8aba9751993))

## [8.40.0](https://github.com/lemonadesocial/web-new/compare/v8.39.0...v8.40.0) (2025-12-31)


### Features

* fix insights on mobile ([3642f7e](https://github.com/lemonadesocial/web-new/commit/3642f7e61148f30f03abe944dbb5259927ef0239))

## [8.39.0](https://github.com/lemonadesocial/web-new/compare/v8.38.0...v8.39.0) (2025-12-31)


### Features

* add count changes ([cb52e93](https://github.com/lemonadesocial/web-new/commit/cb52e93fc7f56fdd2eccfa3fce7da05b015bfc83))
* add page views stats ([8149952](https://github.com/lemonadesocial/web-new/commit/81499525a50a4248c082603aee75338503303743))
* ticket sold ([ed1ed17](https://github.com/lemonadesocial/web-new/commit/ed1ed17539eb4dd965cfae4337e2b60c454ab450))
* update ticket filter ([f8858fd](https://github.com/lemonadesocial/web-new/commit/f8858fd7ed347d337cf0f5a6900ea4b86f1f90a6))
* utm tracker ([e2408e8](https://github.com/lemonadesocial/web-new/commit/e2408e8c45a2e462733b32254f3a787379a3d459))

## [8.38.0](https://github.com/lemonadesocial/web-new/compare/v8.37.2...v8.38.0) (2025-12-29)


### Features

* add event tracker ([07a9cf0](https://github.com/lemonadesocial/web-new/commit/07a9cf0ae17f5532ce986412fdc5d1c48eba572f))
* add hook for getting group coin ([0caf342](https://github.com/lemonadesocial/web-new/commit/0caf342af90048621199620fb6c4fd32f0e00d4d))
* add main coin stats ([eae0117](https://github.com/lemonadesocial/web-new/commit/eae01173a55e437384df88bca68d01186bbc4d11))
* community coin ([de15d9c](https://github.com/lemonadesocial/web-new/commit/de15d9cae72676d0e2ce99f07c077a1e22523182))
* community subcoins ([11a5b8b](https://github.com/lemonadesocial/web-new/commit/11a5b8b0cbd22d0e79b104ac3d90c652886b07fb))
* custom price hook ([2317893](https://github.com/lemonadesocial/web-new/commit/2317893509a64f694f35514a2914f356472527e9))
* guest launchpad ([8991cd5](https://github.com/lemonadesocial/web-new/commit/8991cd591b53755d4b6d2ca39d4b64293dbf7a4f))
* launchpad settings view ([3a46844](https://github.com/lemonadesocial/web-new/commit/3a46844c7d43f7c12cf364420094302a3056a030))
* subcoins ([099c4b1](https://github.com/lemonadesocial/web-new/commit/099c4b1952c9ace33c5af61a1b4cd435b4d5547b))

## [8.37.2](https://github.com/lemonadesocial/web-new/compare/v8.37.1...v8.37.2) (2025-12-23)


### Bug Fixes

* check private ip ([9ca3d25](https://github.com/lemonadesocial/web-new/commit/9ca3d25c5b1d19e5219f4dee74a6873267c2dc49))
* correct lookup func ([fda08c5](https://github.com/lemonadesocial/web-new/commit/fda08c5fa4d51cbe683cd665200887f913a0694e))

## [8.37.1](https://github.com/lemonadesocial/web-new/compare/v8.37.0...v8.37.1) (2025-12-23)


### Bug Fixes

* valid url before extract info ([adf28df](https://github.com/lemonadesocial/web-new/commit/adf28df7754bfcb0e76556d2ceb0557813b54d93))

## [8.37.0](https://github.com/lemonadesocial/web-new/compare/v8.36.0...v8.37.0) (2025-12-22)


### Features

* cancel tickets ([2cc05ab](https://github.com/lemonadesocial/web-new/commit/2cc05ab4915a2c48b550dc9391416e1196908944))
* display canncelled tickets ([e7d4459](https://github.com/lemonadesocial/web-new/commit/e7d4459599c059b8e28b03af42920d589f0e106e))
* improve ux ([a6dcd75](https://github.com/lemonadesocial/web-new/commit/a6dcd752baef107fda03530414ddacd59117a527))
* modify tickets ([2cdb159](https://github.com/lemonadesocial/web-new/commit/2cdb1599b390d4d184939a8f3acc22dccf199687))
* modify tickets ([50599a8](https://github.com/lemonadesocial/web-new/commit/50599a8ecf5f91f081c43b4c14736a332907fc99))
* **temp:** hide all coins ([a509b27](https://github.com/lemonadesocial/web-new/commit/a509b27f7d25154412a9274a7add9bd2dffa41e0))
* truncate ticket title ([c3bb639](https://github.com/lemonadesocial/web-new/commit/c3bb639b82994bea94866b4a1db9dee0c4520d27))


### Bug Fixes

* disable the openGraph endpoint ([5f191b4](https://github.com/lemonadesocial/web-new/commit/5f191b4ecfb8cdce299ca6874d0bef0c0d129246))
* explore padding ([ae05fd1](https://github.com/lemonadesocial/web-new/commit/ae05fd16a8a0f16ec3339a14cc0762fe58a2130e))

## [8.36.0](https://github.com/lemonadesocial/web-new/compare/v8.35.0...v8.36.0) (2025-12-22)


### Features

* add quick buy ([60702f3](https://github.com/lemonadesocial/web-new/commit/60702f34bd0af43b8d573da200eaac45a17518f0))
* change pat ([d7e2239](https://github.com/lemonadesocial/web-new/commit/d7e22392d075fba5877e8f7b0835755e5e727db9))
* check mint vinyl - festival - drip passport ([2312558](https://github.com/lemonadesocial/web-new/commit/231255844b1233c70d904b58accba7b3a162f24b))
* checking generate canvas vinyl nation ([809ae65](https://github.com/lemonadesocial/web-new/commit/809ae657de26edb531cf7c14300aa2bc78a0c384))
* checking trpc call ([53ac854](https://github.com/lemonadesocial/web-new/commit/53ac85430cec7072ff9934d4d359c17d8c2bdc6f))
* complete share passport og ([1632ccd](https://github.com/lemonadesocial/web-new/commit/1632ccd43549120a9f14ca4bde1f7c8eee84ef47))
* correct check provider ([1df81c8](https://github.com/lemonadesocial/web-new/commit/1df81c8b642e3c003b9c791d95a818744c6562cc))
* debounce guest list search ([ddb1ec0](https://github.com/lemonadesocial/web-new/commit/ddb1ec0255e0760cdfa61d183cc871ebafe18de7))
* enable check white list ([35bdf5a](https://github.com/lemonadesocial/web-new/commit/35bdf5a5f48ebed94edb9cf873cd45169e18d2ae))
* fallback username chain ([741c4db](https://github.com/lemonadesocial/web-new/commit/741c4db12432df7b664b9f899c5b093da3bff9c2))
* move utils file ([1bdad24](https://github.com/lemonadesocial/web-new/commit/1bdad246e6f6c7e7a6cd058d20f69b057e20402f))
* remove cookie check ([83b3c4e](https://github.com/lemonadesocial/web-new/commit/83b3c4ea50dfbc878abf59d9287d989b5303d59b))
* remove old files ([91c13ad](https://github.com/lemonadesocial/web-new/commit/91c13ad776717748d58a347a9063e27c40e01d7d))
* udpate vinyl nation passport ([3f4bf79](https://github.com/lemonadesocial/web-new/commit/3f4bf79852190b83b37a47ce08a7cc796e2d16c5))
* update bg after mean ([72d691d](https://github.com/lemonadesocial/web-new/commit/72d691dbda5cf8be973de155cc89b0f55dac0214))
* update bg and font for shared passport ([862b2b6](https://github.com/lemonadesocial/web-new/commit/862b2b6ef1b7f5f803b605c89713620d04db5080))
* update bg share ([84b6686](https://github.com/lemonadesocial/web-new/commit/84b66864bd8a9e8275d1dba59a8fe1e1c7b501bf))
* update contract ([a0acce8](https://github.com/lemonadesocial/web-new/commit/a0acce84503307dc160d442682ec83b0d77ca2aa))
* update create group params ([9bcf8c9](https://github.com/lemonadesocial/web-new/commit/9bcf8c981df4e37641999988a9a9a8991364365b))
* update empty chart data ([37b93fd](https://github.com/lemonadesocial/web-new/commit/37b93fd0c7db15067b2cc61ffee16af11aa6a5f7))
* update err msg ([588d7fe](https://github.com/lemonadesocial/web-new/commit/588d7fec66433689eb738b203de5cabc09338fd7))
* update error message ([a9c3e9a](https://github.com/lemonadesocial/web-new/commit/a9c3e9a82a02ffcdc5ef5134698108f5ef2f94b3))
* update festival passport ([e0b3bc0](https://github.com/lemonadesocial/web-new/commit/e0b3bc05fdfe3f09b5dc8c8b3dfbdeb29d02a03c))
* update fluffle ([49b6695](https://github.com/lemonadesocial/web-new/commit/49b6695e853825fb16d4d6006b8fb796b39a2c8d))
* update fluffle use ([28e4ffc](https://github.com/lemonadesocial/web-new/commit/28e4ffc58de70437b6a85a82696bd9e1f2fc050c))
* update get mint data api ([ed954e7](https://github.com/lemonadesocial/web-new/commit/ed954e76d064d0f382528418323c0b80ab741fbc))
* update mint data ([6b9c16f](https://github.com/lemonadesocial/web-new/commit/6b9c16f78be9f49cbbde1be905055c97e31fc0d0))
* update modal ([0d74cb2](https://github.com/lemonadesocial/web-new/commit/0d74cb278f0879acfa3709381233791a0424a000))
* update new flow username - contract adress ([a2aa379](https://github.com/lemonadesocial/web-new/commit/a2aa379f4273ac701f8980e83dfcb708228685e2))
* update og festival nation ([54704fd](https://github.com/lemonadesocial/web-new/commit/54704fd13f8ecd911417d37b2a87b45192fb9757))
* update path ([b0297d6](https://github.com/lemonadesocial/web-new/commit/b0297d6474f0887a15059114de088282b6395be8))
* update path og ([cdd5ee6](https://github.com/lemonadesocial/web-new/commit/cdd5ee68bae093c1d2d90b084db3d5df033dd472))
* update provider generate passport ([28ee7f3](https://github.com/lemonadesocial/web-new/commit/28ee7f3371fb51728b79976c36d61b763e969b41))
* update text intro ([06e7569](https://github.com/lemonadesocial/web-new/commit/06e7569f4de6a35425c3a79655f582b1cc2a80af))
* update title passport ([13360e2](https://github.com/lemonadesocial/web-new/commit/13360e22f2741e560c4d3530e146f43d4203627b))
* update username ([e2e7677](https://github.com/lemonadesocial/web-new/commit/e2e767718661407d0856433831963b23683f2614))
* update username indexer ([ece734b](https://github.com/lemonadesocial/web-new/commit/ece734b3a2892c799833889df887079b42f7838e))
* updated generate drip nation ([4026c0c](https://github.com/lemonadesocial/web-new/commit/4026c0c9e81b9a6a3972d80dc41e73a3da9b2619))
* use abstract abi ([17285c4](https://github.com/lemonadesocial/web-new/commit/17285c477a718c40ea9979fb48fa5020afedea6c))


### Bug Fixes

* correct provider ([a5b7410](https://github.com/lemonadesocial/web-new/commit/a5b7410d9f7899c42f79f2f25196a62af6376d2a))
* correct provider ([c8e64d8](https://github.com/lemonadesocial/web-new/commit/c8e64d8da83ca5460ba965d16a637a4ef6c6a34a))
* ens name ([73e81d3](https://github.com/lemonadesocial/web-new/commit/73e81d30d3f2212c190b2c9777c5d065285991fe))
* import path ([15a5d83](https://github.com/lemonadesocial/web-new/commit/15a5d8325f8308a15816b379a1110853bfc4ee3e))
* missing chainmap ([6af2364](https://github.com/lemonadesocial/web-new/commit/6af2364226e2dced9268496ec2d9c2fdbe4f4a79))
* missing space id in launchpad group ([b01890c](https://github.com/lemonadesocial/web-new/commit/b01890c5a8b034475ca22ab8f125fe59fea201af))
* provider ([02c11c9](https://github.com/lemonadesocial/web-new/commit/02c11c95a52c6d5979cfb68bdd522cbe2cf8dd6b))
* remove lens connect in settings ([c5178dd](https://github.com/lemonadesocial/web-new/commit/c5178dd3a0ae78e544e94c8f2aad86d9af72d6fe))
* remove lens profile connect after signing up ([b1a813a](https://github.com/lemonadesocial/web-new/commit/b1a813a9bdc8f7d20be1d2c40f4ab272bc0ae925))
* remove lens profile from user menu ([07f1cc2](https://github.com/lemonadesocial/web-new/commit/07f1cc2aa3c0e93b00bdcc5680e016875f6d15d9))
* remove lens profile in settings ([cc93f84](https://github.com/lemonadesocial/web-new/commit/cc93f8432011a5bb08b897a85f57fb0e68c218b5))
* remove self ([755904d](https://github.com/lemonadesocial/web-new/commit/755904d9db3987ad84fd337b12ce091e494227c8))
* resolve conflicts ([b608568](https://github.com/lemonadesocial/web-new/commit/b608568e90e69e364b13165f21db048c84191f02))
* update next check ([fc36a72](https://github.com/lemonadesocial/web-new/commit/fc36a72761ff88d7fd65cc48526095b5ab56bf0c))
* update passport api ([aab9120](https://github.com/lemonadesocial/web-new/commit/aab9120ed247451da056ee6a19979f0aa8690c3e))
* update username store ([0887f91](https://github.com/lemonadesocial/web-new/commit/0887f918d30d6fb6670de780adf0baa8bf0569ef))

## [8.35.0](https://github.com/lemonadesocial/web-new/compare/v8.34.2...v8.35.0) (2025-12-12)


### Features

* upgrade react security patches ([08c25e8](https://github.com/lemonadesocial/web-new/commit/08c25e86b3526b463ea189162fb8b9213d4b435b))

## [8.34.2](https://github.com/lemonadesocial/web-new/compare/v8.34.1...v8.34.2) (2025-12-10)


### Bug Fixes

* check initial data ([12adb73](https://github.com/lemonadesocial/web-new/commit/12adb73a10b814760a7861abc6863d9533fe83de))

## [8.34.1](https://github.com/lemonadesocial/web-new/compare/v8.34.0...v8.34.1) (2025-12-10)


### Bug Fixes

* update delete ticket type action ([b4d25c4](https://github.com/lemonadesocial/web-new/commit/b4d25c43741e3fdda361a926344b9911294fbffb))

## [8.34.0](https://github.com/lemonadesocial/web-new/compare/v8.33.1...v8.34.0) (2025-12-07)


### Features

* upgrade next.js due to CVE-2025-66478 ([3ace23d](https://github.com/lemonadesocial/web-new/commit/3ace23ddff6954e8fdbfc6aee7ddd406334e2fe7))


### Bug Fixes

* upgrade alpine ([22dacd9](https://github.com/lemonadesocial/web-new/commit/22dacd902dbbd7ca6f117b95644fac2c862ac9a3))

## [8.33.1](https://github.com/lemonadesocial/web-new/compare/v8.33.0...v8.33.1) (2025-12-05)


### Bug Fixes

* map form fields ([34c17b5](https://github.com/lemonadesocial/web-new/commit/34c17b591450416c9b12392249d0fd7298f077de))

## [8.33.0](https://github.com/lemonadesocial/web-new/compare/v8.32.1...v8.33.0) (2025-12-04)


### Features

* update social size ([1485aae](https://github.com/lemonadesocial/web-new/commit/1485aaee0b3a6356a2a26bca24cf87aaf668baa5))


### Bug Fixes

* merge data respone instead of replace ([b6fbd19](https://github.com/lemonadesocial/web-new/commit/b6fbd19e0b683cb2e4a28b7da4941bcc57158fa9))

## [8.32.1](https://github.com/lemonadesocial/web-new/compare/v8.32.0...v8.32.1) (2025-11-27)


### Bug Fixes

* filter roles space members ([f58742b](https://github.com/lemonadesocial/web-new/commit/f58742bfb597440a15fcf1291bb11ab648680153))

## [8.32.0](https://github.com/lemonadesocial/web-new/compare/v8.31.1...v8.32.0) (2025-11-26)


### Features

* enable eoa wallets for coin base ([f5d2517](https://github.com/lemonadesocial/web-new/commit/f5d2517ce0a9fed890398fed4e8bc2662cb16342))


### Bug Fixes

* fail to check balance after connectting wallet ([0cdae4c](https://github.com/lemonadesocial/web-new/commit/0cdae4cac0ca3cfd83d5952e2d9cb7613037090a))

## [8.31.1](https://github.com/lemonadesocial/web-new/compare/v8.31.0...v8.31.1) (2025-11-20)


### Bug Fixes

* **auth-modal:** fix email casing ([a4c5bc3](https://github.com/lemonadesocial/web-new/commit/a4c5bc3af52b60b500e3030f02d1d727e4bc5796))

## [8.31.0](https://github.com/lemonadesocial/web-new/compare/v8.30.1...v8.31.0) (2025-11-19)


### Features

* add extra info to Sentry log ([b7a3f11](https://github.com/lemonadesocial/web-new/commit/b7a3f11b5adf71c3106709a21e16489cef848259))
* fallback if txhash not found ([da64311](https://github.com/lemonadesocial/web-new/commit/da64311c0236df5744057d6d9415b9ee82c54c90))


### Bug Fixes

* await confirm ([4b837fd](https://github.com/lemonadesocial/web-new/commit/4b837fd32c3535fc312cb9477c0beaed9b28f4fc))
* better truncate text ([389fe08](https://github.com/lemonadesocial/web-new/commit/389fe0887c2aff75300ea67f17ebd114875ae99e))
* long text ([8a2c54f](https://github.com/lemonadesocial/web-new/commit/8a2c54f7c03cb4c3bedef6911ce1a196ce68c012))
* truncate copoun long text ([06aa714](https://github.com/lemonadesocial/web-new/commit/06aa714309acf5ce592c146e47f1624c8adcd9d8))
* truncate name guest table ([d1e5511](https://github.com/lemonadesocial/web-new/commit/d1e5511c081d4aa821c0cb091463a36633a434b1))
* **unicorn:** sync unicorn even if session exists ([56bb7cc](https://github.com/lemonadesocial/web-new/commit/56bb7cc2ddae0dfe0df3d9dd939d97d1806d6a66))

## [8.30.1](https://github.com/lemonadesocial/web-new/compare/v8.30.0...v8.30.1) (2025-11-18)


### Bug Fixes

* cannot read _id of undefined ([849ce28](https://github.com/lemonadesocial/web-new/commit/849ce28bd4e1dadab7c40e838f1671e80bc58b80))
* **lint:** fix linting ([b5970e9](https://github.com/lemonadesocial/web-new/commit/b5970e934b063dbe8f685ce2265b982714627517))
* missing useQuery ([d235328](https://github.com/lemonadesocial/web-new/commit/d23532858270bca154662082cbdb9ef757075ce4))

## [8.30.0](https://github.com/lemonadesocial/web-new/compare/v8.29.0...v8.30.0) (2025-11-18)


### Features

* trigger release-please ([3dfd692](https://github.com/lemonadesocial/web-new/commit/3dfd692f83078b06503c62fa5c892e9899cb4f30))

## [8.29.0](https://github.com/lemonadesocial/web-new/compare/v8.28.0...v8.29.0) (2025-11-18)


### Features

* click address to open google maps ([808f2a6](https://github.com/lemonadesocial/web-new/commit/808f2a604803d5ac4067866a726ce4583073093a))
* update get ticket text ([e52c362](https://github.com/lemonadesocial/web-new/commit/e52c3629c130b91ec0b308360139c3d1f0b23167))
* update welcome text ([4d11c8f](https://github.com/lemonadesocial/web-new/commit/4d11c8f18fa85e88687be2ba95f618b8937db12f))

## [8.28.0](https://github.com/lemonadesocial/web-new/compare/v8.27.4...v8.28.0) (2025-11-17)


### Features

* update ethdenver modal copy ([1587fce](https://github.com/lemonadesocial/web-new/commit/1587fcee494a9b74458b6aaa3878591ef4e2af32))

## [8.27.4](https://github.com/lemonadesocial/web-new/compare/v8.27.3...v8.27.4) (2025-11-17)


### Bug Fixes

* add prefix link and edit profile ([24d625d](https://github.com/lemonadesocial/web-new/commit/24d625ddfee1898ef55af0b343be5e19caff1685))
* not found after create community ([3bfd249](https://github.com/lemonadesocial/web-new/commit/3bfd249246d5a8782687f48a0a7d7c4f9e973984))
* zero ticket limit ([63d1362](https://github.com/lemonadesocial/web-new/commit/63d13623bdd33808dd1370cd2006797411e45650))
* zero ticket limit ([bf005f5](https://github.com/lemonadesocial/web-new/commit/bf005f584a494ed6763653260f0cbeccc0fc34ba))

## [8.27.3](https://github.com/lemonadesocial/web-new/compare/v8.27.2...v8.27.3) (2025-11-17)


### Bug Fixes

* application profile not showing in guest ([415fcad](https://github.com/lemonadesocial/web-new/commit/415fcadafe4296e4388f9cf5b23a4d50b85dd088))

## [8.27.2](https://github.com/lemonadesocial/web-new/compare/v8.27.1...v8.27.2) (2025-11-15)


### Bug Fixes

* optimize query ssr ([c6281cd](https://github.com/lemonadesocial/web-new/commit/c6281cdcd4f5e1f9c814d4d2bab99c0a5a03929f))

## [8.27.1](https://github.com/lemonadesocial/web-new/compare/v8.27.0...v8.27.1) (2025-11-14)


### Bug Fixes

* event ticket limit per guest ([d707cbc](https://github.com/lemonadesocial/web-new/commit/d707cbc0813bd04c30dfd6e866e012a090c391ef))

## [8.27.0](https://github.com/lemonadesocial/web-new/compare/v8.26.0...v8.27.0) (2025-11-13)


### Features

* refactor ([131e605](https://github.com/lemonadesocial/web-new/commit/131e6051ae16af2df0c22e3345ff45a4af321142))
* update currencies list when not token gate ([8c7b58b](https://github.com/lemonadesocial/web-new/commit/8c7b58bfaca9f1310c2b8a54e07ab3472441921e))


### Bug Fixes

* center checkbox term form ([7d5697e](https://github.com/lemonadesocial/web-new/commit/7d5697e0ac391a97badfc65d01bddc0b16447efe))
* missing currencies ([da80413](https://github.com/lemonadesocial/web-new/commit/da804136fd1f46dc10b283d2a5c7c5e59878f963))

## [8.26.0](https://github.com/lemonadesocial/web-new/compare/v8.25.0...v8.26.0) (2025-11-13)


### Features

* add download pass option ([f93e36f](https://github.com/lemonadesocial/web-new/commit/f93e36fa124182f6c17f19df96f30cc575b6133c))
* add rsvp success modal ([6f04142](https://github.com/lemonadesocial/web-new/commit/6f041420d968a7bb60262d48bf646180b5dc529b))
* check attempedDecimals ([490a7d7](https://github.com/lemonadesocial/web-new/commit/490a7d7552a0a820901d42a79eb40e36466276b2))
* missing price when not token gate ([c277d38](https://github.com/lemonadesocial/web-new/commit/c277d389ba11380f5eac734d25a0ec2f45218f20))
* remove decimal when zero ([3601013](https://github.com/lemonadesocial/web-new/commit/3601013096db029dfabadba4d2b8e67c7fba3f8d))
* remove toolbar actions ([87e04f5](https://github.com/lemonadesocial/web-new/commit/87e04f5c353f07eef70d1e61e1ab216378037c45))
* revert testing ([a82e0ec](https://github.com/lemonadesocial/web-new/commit/a82e0ec25855ad09b5b0d811475c8c6797f70c19))
* update featured wallet list ([6a1c5e0](https://github.com/lemonadesocial/web-new/commit/6a1c5e0307f8c67e42fa935cd9d3f095277386bc))
* use display name ([bbd54d0](https://github.com/lemonadesocial/web-new/commit/bbd54d0d7666da1b4c1250bbdaa5830b1115bb0b))


### Bug Fixes

* add unicorn wallet to verification ([8e46482](https://github.com/lemonadesocial/web-new/commit/8e464820a7238f5235dc3568bb035d959ef5be31))
* check photos ticket type before update ([0b9a096](https://github.com/lemonadesocial/web-new/commit/0b9a09620e37606e048b05aa7ccc3247e30822a4))
* check upgrade ticket and style term form ([bdb5e06](https://github.com/lemonadesocial/web-new/commit/bdb5e060b7be36701b7d1ff6dbae46c0fbb390fc))
* type check ([4824e2b](https://github.com/lemonadesocial/web-new/commit/4824e2bb8f6e8bb84bb10b04ecb766769cef9983))
* update formatTokenGateRange ([4c8a311](https://github.com/lemonadesocial/web-new/commit/4c8a3111763a67a24da25d3f2f00ec27d595df63))

## [8.25.0](https://github.com/lemonadesocial/web-new/compare/v8.24.0...v8.25.0) (2025-11-12)


### Features

* remove token range from erc721 gate ([c837af0](https://github.com/lemonadesocial/web-new/commit/c837af0ed92544b03390457eac17c730d1a30c91))

## [8.24.0](https://github.com/lemonadesocial/web-new/compare/v8.23.0...v8.24.0) (2025-11-12)


### Features

* hide invite friend when limit eq zero ([b5e1a3e](https://github.com/lemonadesocial/web-new/commit/b5e1a3e5a6252264114a879c300d2019fdea653d))

## [8.23.0](https://github.com/lemonadesocial/web-new/compare/v8.22.0...v8.23.0) (2025-11-12)


### Features

* erc721 token gate check ([223de52](https://github.com/lemonadesocial/web-new/commit/223de52ee535d62dccb59b9bdf68e21d8bdc5649))
* hide claim username ([7053cdf](https://github.com/lemonadesocial/web-new/commit/7053cdfb0b16e2a2b001681c434f68b802750eb3))
* update time label to have month ([1d89b5d](https://github.com/lemonadesocial/web-new/commit/1d89b5d41ad9dce6d6b7062adef223dba4d8a821))


### Bug Fixes

* event address display ([de8e846](https://github.com/lemonadesocial/web-new/commit/de8e846a24c4cefa787a16f8e1ad7df7902ef831))

## [8.22.0](https://github.com/lemonadesocial/web-new/compare/v8.21.0...v8.22.0) (2025-11-12)


### Features

* add upgrade modal ([6d18384](https://github.com/lemonadesocial/web-new/commit/6d1838424d9fba426766720eee3aa53d42192c29))
* check token gate ticket ([e46151a](https://github.com/lemonadesocial/web-new/commit/e46151a9407de3b613d387dd2e9c3e05c048781e))
* enable passport ([57078b0](https://github.com/lemonadesocial/web-new/commit/57078b0317e080ade8c7df0290e2badc75672e17))
* filter empty data ([6fa6716](https://github.com/lemonadesocial/web-new/commit/6fa67162b9daa25454ab0dec6d263a91fe80d70c))
* hide passport ([8a3f3b0](https://github.com/lemonadesocial/web-new/commit/8a3f3b00db2747feeb42104dc843d6c1a786651b))
* hide passport ([1c99b21](https://github.com/lemonadesocial/web-new/commit/1c99b21b48c13410b2e4fdb2747e785ed7b258b0))
* hide upgrade modal when open registration modal ([7067b1a](https://github.com/lemonadesocial/web-new/commit/7067b1ac0d4d47a1f2297d0b9efb832f375597c8))
* implement upgrade ticket types ([deadde8](https://github.com/lemonadesocial/web-new/commit/deadde848b48b0ea9f1cbeb57c0b2b1a66c9448a))
* update ui mint passport inside lemonheads hub and zone ([e8dc538](https://github.com/lemonadesocial/web-new/commit/e8dc53874db31807d7434b932c905e4fc73d204c))


### Bug Fixes

* missing rsvp status ([6c8c990](https://github.com/lemonadesocial/web-new/commit/6c8c9909702f0102cb34d0e3c95f1557c72d5237))

## [8.21.0](https://github.com/lemonadesocial/web-new/compare/v8.20.0...v8.21.0) (2025-11-05)


### Features

* add error ([a4e33ac](https://github.com/lemonadesocial/web-new/commit/a4e33acf61f151d95354823703f0eddfd37f6e7d))
* enable passport card ([9180fdc](https://github.com/lemonadesocial/web-new/commit/9180fdcbb9eeb49869fbdf59369beb6766058f94))
* hide passport card ([443f112](https://github.com/lemonadesocial/web-new/commit/443f11261ed1045feeb9a46cd823725b79ec8f15))
* update content mint passport ([6040f9d](https://github.com/lemonadesocial/web-new/commit/6040f9d7f203793badeec7b9f665562f68eed0c7))
* update error msg ([9ef0c03](https://github.com/lemonadesocial/web-new/commit/9ef0c0374e06b115f34d478229d108dc1a7f2db5))
* update error msg ([ded81d3](https://github.com/lemonadesocial/web-new/commit/ded81d3c3e054475076a7e49d076e991c2e6c0b0))
* update people tags ui ([b817d02](https://github.com/lemonadesocial/web-new/commit/b817d0267baf44ec62df68fd34b4be57174f98c6))
* update share community modal ([d867cd0](https://github.com/lemonadesocial/web-new/commit/d867cd020d56fb07f2d47d00ad650f69af421414))
* update share facebook and email ([2256366](https://github.com/lemonadesocial/web-new/commit/2256366c73b79d26ced2f40e027ce88ac991caae))
* update space image ticket type ([e4009d9](https://github.com/lemonadesocial/web-new/commit/e4009d940deb085faf1e0b7eb32ff69832391b6d))
* update title - desc mint flow ([05b3662](https://github.com/lemonadesocial/web-new/commit/05b366264bdf3c34f8d587fd103676473816d017))


### Bug Fixes

* correct mint params ([923635c](https://github.com/lemonadesocial/web-new/commit/923635c699abbce9c5b089a2c3be15cf54c8f10f))
* ens display ([b036ffc](https://github.com/lemonadesocial/web-new/commit/b036ffcbe52f6191d44d53a28186a95de5245573))
* get ens name ([6b3da42](https://github.com/lemonadesocial/web-new/commit/6b3da4223a78f28dea19a54532e2dcfbec527e24))
* passport link ([521abf4](https://github.com/lemonadesocial/web-new/commit/521abf44f45b477574d98470efdcac3673f60810))
* remove video bg in zugrama ([da13eef](https://github.com/lemonadesocial/web-new/commit/da13eef207c24c7d4b8cec4d372263a28259dc72))
* update ui mobile view ([8eddd2e](https://github.com/lemonadesocial/web-new/commit/8eddd2e7cdc2aed193bc89bd9706d038ceecef66))

## [8.20.0](https://github.com/lemonadesocial/web-new/compare/v8.19.0...v8.20.0) (2025-11-04)


### Features

* fix image size ([0ff9080](https://github.com/lemonadesocial/web-new/commit/0ff90800dbc432c911ee2220d6d28dc9514e0e85))

## [8.19.0](https://github.com/lemonadesocial/web-new/compare/v8.18.0...v8.19.0) (2025-11-04)


### Features

* add reorder sub hubs ([0635670](https://github.com/lemonadesocial/web-new/commit/0635670794f41cdff5634ce13313df8d2fcb34ef))
* resolve feedback ([f52a6dc](https://github.com/lemonadesocial/web-new/commit/f52a6dc341c4a5a424a8ddd544d7bef1f0ac948d))
* update avatar size mobile ([596b1ee](https://github.com/lemonadesocial/web-new/commit/596b1eef247d216a8fd7253835f7ebdb8b7766c2))
* update icon empty state ([9cbd391](https://github.com/lemonadesocial/web-new/commit/9cbd3918944c41931b052145138f7c35d3514cd1))
* update message error ([a16377c](https://github.com/lemonadesocial/web-new/commit/a16377c3a23b3e5c0555e0ae820088127537695a))


### Bug Fixes

* layout sticky ([65868ec](https://github.com/lemonadesocial/web-new/commit/65868ec320c791e36f781200c9976df4c1ae5e06))
* menu layout sticky layer ([6863a49](https://github.com/lemonadesocial/web-new/commit/6863a49f4bcb6cb11d3078fc8818283ef1a8ea55))

## [8.18.0](https://github.com/lemonadesocial/web-new/compare/v8.17.0...v8.18.0) (2025-10-30)


### Features

* update name from ethdenver ([bf2b77b](https://github.com/lemonadesocial/web-new/commit/bf2b77b4552af453d71bff579c79ab20611ba206))

## [8.17.0](https://github.com/lemonadesocial/web-new/compare/v8.16.0...v8.17.0) (2025-10-28)


### Features

* update unicorn copy ([35cbe59](https://github.com/lemonadesocial/web-new/commit/35cbe595543bffaf11a19a86e881e31e9113717d))

## [8.16.0](https://github.com/lemonadesocial/web-new/compare/v8.15.0...v8.16.0) (2025-10-28)


### Features

* remove unicorn from eth requirements ([18c2e39](https://github.com/lemonadesocial/web-new/commit/18c2e39a9eb084e0fd6d5a7b832296b6b5730eef))


### Bug Fixes

* allow unicorn wallet in event application form ([bd5fc3c](https://github.com/lemonadesocial/web-new/commit/bd5fc3c6bb3910cd9e2e9134ed8e0c09634cf7bc))
* buyer wallet not subbmitted ([7f4ac39](https://github.com/lemonadesocial/web-new/commit/7f4ac391968e12462d10c725a72eba11645ac35f))
* format date in timzone issue (date-fns-tz) ([7087303](https://github.com/lemonadesocial/web-new/commit/7087303367481efdd0a96d1c7cfbe00ddba5e2d0))
* update format timezone datetime picker ([aaa43c7](https://github.com/lemonadesocial/web-new/commit/aaa43c75e90acb3873315bba47040674cb8c5b63))
* update time when change timezone ([bda0e1b](https://github.com/lemonadesocial/web-new/commit/bda0e1b55bd567cb294f537c3681f3e8632e45cb))
* user atom source ([8ca81db](https://github.com/lemonadesocial/web-new/commit/8ca81db4e4250f1f32d769ff17725b7cbaa66583))

## [8.15.0](https://github.com/lemonadesocial/web-new/compare/v8.14.0...v8.15.0) (2025-10-25)


### Features

* **self-xyz:** add default config values ([395358e](https://github.com/lemonadesocial/web-new/commit/395358e8f71bd376e8924a624822465381476c77))

## [8.14.0](https://github.com/lemonadesocial/web-new/compare/v8.13.1...v8.14.0) (2025-10-24)


### Features

* check token balance ([3001beb](https://github.com/lemonadesocial/web-new/commit/3001bebc40e3ad99e8d17cbb8d6059828098d975))

## [8.13.1](https://github.com/lemonadesocial/web-new/compare/v8.13.0...v8.13.1) (2025-10-23)


### Bug Fixes

* **unicorn:** perform logout before registration ([1351096](https://github.com/lemonadesocial/web-new/commit/1351096dd14addc988f53a5c11af141d7e5413cb))

## [8.13.0](https://github.com/lemonadesocial/web-new/compare/v8.12.0...v8.13.0) (2025-10-23)


### Features

* display unicorn wallet in settings ([438e1a3](https://github.com/lemonadesocial/web-new/commit/438e1a37f1dc9069b9eefaae6dbad85d38bf0b33))


### Bug Fixes

* verified wallet not displaying ([241ade0](https://github.com/lemonadesocial/web-new/commit/241ade021e39657bf5c06e492d6190c8325a361c))

## [8.12.0](https://github.com/lemonadesocial/web-new/compare/v8.11.0...v8.12.0) (2025-10-23)


### Features

* upgrade appkit ([19bea43](https://github.com/lemonadesocial/web-new/commit/19bea437885ad68f7804240edc96339d460fe80c))


### Bug Fixes

* update single ticket token gating ([35e4786](https://github.com/lemonadesocial/web-new/commit/35e4786ec3e7b89a47344d35458bc62c7a8d52b4))

## [8.11.0](https://github.com/lemonadesocial/web-new/compare/v8.10.1...v8.11.0) (2025-10-22)


### Features

* cleanup & revert package versions ([88a3c6b](https://github.com/lemonadesocial/web-new/commit/88a3c6b521433daf86eb0c44f4bfacd8182db43a))
* config wagmi ([97d0db9](https://github.com/lemonadesocial/web-new/commit/97d0db98d27ae6fd62bc55a251b1d437736640fc))
* revert change to appkit lib ([8989cff](https://github.com/lemonadesocial/web-new/commit/8989cff229688fa4f116376a80b673d19c2a211e))
* sync wallet ([a23f708](https://github.com/lemonadesocial/web-new/commit/a23f7083c3656d5e09b154cec1598bc3fa47168a))
* **unicorn:** handle unicorn siwe ([08143f9](https://github.com/lemonadesocial/web-new/commit/08143f9559f2213fb795dee322369d182f6621c5))
* working wagmi config ([fc0bc04](https://github.com/lemonadesocial/web-new/commit/fc0bc04b5f29fab690e3fb762bc9abc1e08e3fcf))


### Bug Fixes

* fix lint stage ([149f398](https://github.com/lemonadesocial/web-new/commit/149f3988291ff518b3a04c8c204cc755ddd79a29))
* fix package version ([bff230d](https://github.com/lemonadesocial/web-new/commit/bff230d5dc61793334d16eed0e58e47c449eca49))
* fix window is not defined ([340c84b](https://github.com/lemonadesocial/web-new/commit/340c84ba152dd3ad9a6de48233e2bf4a34269011))
* use search params ([9bb5942](https://github.com/lemonadesocial/web-new/commit/9bb594217f737b74e691b5fb6c2a79582ba3b02e))

## [8.10.1](https://github.com/lemonadesocial/web-new/compare/v8.10.0...v8.10.1) (2025-10-22)


### Bug Fixes

* update route profile when not connect wallet or no username ([b0401da](https://github.com/lemonadesocial/web-new/commit/b0401dafa7ed34ef85ad8df3946cee48c5f0d255))

## [8.10.0](https://github.com/lemonadesocial/web-new/compare/v8.9.0...v8.10.0) (2025-10-21)


### Features

* collectible on mobile ([142e978](https://github.com/lemonadesocial/web-new/commit/142e978a24bf6132371101838a3c80519dcc8246))
* display unicorn wallet ([3f055f6](https://github.com/lemonadesocial/web-new/commit/3f055f672e8657a40ae30ec0c931255fbafc078d))
* update mobile manage event ([37918b7](https://github.com/lemonadesocial/web-new/commit/37918b7eb62579d1c9c559577fbf3ee432b84555))


### Bug Fixes

* loading update short id ([775110b](https://github.com/lemonadesocial/web-new/commit/775110bcb827f95609887dda10725222ff112c81))
* overflow issues on modals ([d092544](https://github.com/lemonadesocial/web-new/commit/d092544c20434cdd4f271a383b4e0e251adfe1a7))
* truncate email ([fb5f152](https://github.com/lemonadesocial/web-new/commit/fb5f152cc3c1a17395081643a41272e145154e59))

## [8.9.0](https://github.com/lemonadesocial/web-new/compare/v8.8.3...v8.9.0) (2025-10-20)


### Features

* guest list filter on mobile ([d2a52e8](https://github.com/lemonadesocial/web-new/commit/d2a52e8ae8e6882500960d99b8fdc595410d126a))

## [8.8.3](https://github.com/lemonadesocial/web-new/compare/v8.8.2...v8.8.3) (2025-10-18)


### Bug Fixes

* blast scrolling ([8a86d7a](https://github.com/lemonadesocial/web-new/commit/8a86d7ac9f17fdfc3e59323475dc9c6db17c461e))

## [8.8.2](https://github.com/lemonadesocial/web-new/compare/v8.8.1...v8.8.2) (2025-10-15)


### Bug Fixes

* refactor state to form ([a6ae565](https://github.com/lemonadesocial/web-new/commit/a6ae565fafbdb54587450ff6c8bad0ce566125d7))
* sort lib ([9f8d086](https://github.com/lemonadesocial/web-new/commit/9f8d0865d241a7acc1f2cdabaadb3855c26ad082))

## [8.8.1](https://github.com/lemonadesocial/web-new/compare/v8.8.0...v8.8.1) (2025-10-14)


### Bug Fixes

* missing address user info stats ([193be7e](https://github.com/lemonadesocial/web-new/commit/193be7eb223316ca34ae7542cc87e0d3bc23c765))

## [8.8.0](https://github.com/lemonadesocial/web-new/compare/v8.7.0...v8.8.0) (2025-10-14)


### Features

* resolve conflict ([c461a33](https://github.com/lemonadesocial/web-new/commit/c461a33527e6d68f91e52a4f7681b7dce28f1376))
* update self settings button ([5b37e00](https://github.com/lemonadesocial/web-new/commit/5b37e00478c4d1571d8cf5075082f687f39a8c22))


### Bug Fixes

* missing stats ([2d79cd9](https://github.com/lemonadesocial/web-new/commit/2d79cd926120446f8161b0998eed8bcaef9c58be))

## [8.7.0](https://github.com/lemonadesocial/web-new/compare/v8.6.0...v8.7.0) (2025-10-13)


### Features

* missing / ([d4013f6](https://github.com/lemonadesocial/web-new/commit/d4013f604b3d27aae333ce77caa2b327722c56d6))
* missing path ([bf45bff](https://github.com/lemonadesocial/web-new/commit/bf45bff6e278435afcec5b8968ffc182ffc8334a))

## [8.6.0](https://github.com/lemonadesocial/web-new/compare/v8.5.0...v8.6.0) (2025-10-13)


### Features

* update layout profile owner ([adbd55c](https://github.com/lemonadesocial/web-new/commit/adbd55c4eee5bd56be80371869fea1f078fccc0b))


### Bug Fixes

* update bottom bar ([54219f0](https://github.com/lemonadesocial/web-new/commit/54219f09d2fd6800ce534bd5c10795e06f2ddd8c))

## [8.5.0](https://github.com/lemonadesocial/web-new/compare/v8.4.1...v8.5.0) (2025-10-13)


### Features

* remove unused ([5d7d204](https://github.com/lemonadesocial/web-new/commit/5d7d2044c8983a834ece9650775d37b7aa2c47a8))
* update lens_profile_id ([71d3e82](https://github.com/lemonadesocial/web-new/commit/71d3e8202bdabce9a866948faf395cbe20e51b80))
* update query get user ([c73360e](https://github.com/lemonadesocial/web-new/commit/c73360e7b55a875a9d9cd867b98291d862bbbf2f))

## [8.4.1](https://github.com/lemonadesocial/web-new/compare/v8.4.0...v8.4.1) (2025-10-10)


### Bug Fixes

* check timezone before parse ([1acccf2](https://github.com/lemonadesocial/web-new/commit/1acccf2c3cf2afdd7ad1ee1a9d50444485fbba8c))
* remove farcaster login toast ([935d8be](https://github.com/lemonadesocial/web-new/commit/935d8bea0a4769dedd7940bf2a33a8d970c68d4b))
* update event with timezone ([6e907c4](https://github.com/lemonadesocial/web-new/commit/6e907c4de8db26bec9da52ad98b601e74ea4085a))

## [8.4.0](https://github.com/lemonadesocial/web-new/compare/v8.3.0...v8.4.0) (2025-10-08)


### Features

* lemonhead frame ([56d0275](https://github.com/lemonadesocial/web-new/commit/56d0275a1efabfc782849e31a186f73cd2ec0c0d))


### Bug Fixes

* handle chain error ([afd7249](https://github.com/lemonadesocial/web-new/commit/afd7249ef17761fafa4d363212c5f04e71ace5ef))

## [8.3.0](https://github.com/lemonadesocial/web-new/compare/v8.2.0...v8.3.0) (2025-10-06)


### Features

* add confirmation modal for delete ([30fc90e](https://github.com/lemonadesocial/web-new/commit/30fc90e46ae389e5de6a9ffcbc3308f3ff2299d2))
* delete user ([aa96cd2](https://github.com/lemonadesocial/web-new/commit/aa96cd286a64a0540329753205efdb90ef726f13))

## [8.2.0](https://github.com/lemonadesocial/web-new/compare/v8.1.0...v8.2.0) (2025-10-06)


### Features

* load more pending approvals ([10007dc](https://github.com/lemonadesocial/web-new/commit/10007dc381d2d7dae7c959514f97719a09d324a4))

## [8.1.0](https://github.com/lemonadesocial/web-new/compare/v8.0.1...v8.1.0) (2025-10-03)


### Features

* update network check ([7ccac2a](https://github.com/lemonadesocial/web-new/commit/7ccac2a036c33f9f6472ebb6d1f215b104dd23fd))


### Bug Fixes

* missing user email when logging in with wallet ([87478af](https://github.com/lemonadesocial/web-new/commit/87478af091ca32d73c460b8db002ac1fa134b9c7))
* unable to remove ticket limit ([1269a22](https://github.com/lemonadesocial/web-new/commit/1269a22329b1d4bafa8c812655dfe610a1aec748))

## [8.0.1](https://github.com/lemonadesocial/web-new/compare/v8.0.0...v8.0.1) (2025-10-03)


### Bug Fixes

* unable to remove guest limit ([13e89f3](https://github.com/lemonadesocial/web-new/commit/13e89f352f2616fa5da0a079be0d2476f9a5f27c))
* update tooltip position ([c67dc46](https://github.com/lemonadesocial/web-new/commit/c67dc46951e0d5e63698555b52bf031754ff56e6))

## [8.0.0](https://github.com/lemonadesocial/web-new/compare/v7.11.0...v8.0.0) (2025-10-02)


### ⚠ BREAKING CHANGES

* ticket passcode

### Features

* ticket passcode ([0afc324](https://github.com/lemonadesocial/web-new/commit/0afc32428a762b3d5e4e921b31c1785180c893f7))

## [7.11.0](https://github.com/lemonadesocial/web-new/compare/v7.10.0...v7.11.0) (2025-10-01)


### Features

* update lemonheads invite ([eb2efcf](https://github.com/lemonadesocial/web-new/commit/eb2efcfe33035d3916d6f6b149ca1f1214c9d207))

## [7.10.0](https://github.com/lemonadesocial/web-new/compare/v7.9.0...v7.10.0) (2025-09-30)


### Features

* add fobbiden message for farcaster link ([d3fe88e](https://github.com/lemonadesocial/web-new/commit/d3fe88ebb8bea976b59808752dc5e7aa979d95b8))

## [7.9.0](https://github.com/lemonadesocial/web-new/compare/v7.8.1...v7.9.0) (2025-09-30)


### Features

* ensure proper hex formatting ([f072591](https://github.com/lemonadesocial/web-new/commit/f0725918ba2eddb6e8a86ec6c92dba35e64e68f7))

## [7.8.1](https://github.com/lemonadesocial/web-new/compare/v7.8.0...v7.8.1) (2025-09-29)


### Bug Fixes

* update download image ([8764c6b](https://github.com/lemonadesocial/web-new/commit/8764c6bb1c4d4264d727cdac1e44cccb09bc92c1))

## [7.8.0](https://github.com/lemonadesocial/web-new/compare/v7.7.0...v7.8.0) (2025-09-29)


### Features

* update load more lemonheads gallery ([4e8adae](https://github.com/lemonadesocial/web-new/commit/4e8adae4ca120c153211ee8c80a8280cd3af4dcf))

## [7.7.0](https://github.com/lemonadesocial/web-new/compare/v7.6.0...v7.7.0) (2025-09-29)


### Features

* save post in markdown ([e4ec318](https://github.com/lemonadesocial/web-new/commit/e4ec3181f8ef2fab559a563da5f7a8f45041ef76))

## [7.6.0](https://github.com/lemonadesocial/web-new/compare/v7.5.0...v7.6.0) (2025-09-29)


### Features

* load more tokens in lemonheads gallery ([d0755b6](https://github.com/lemonadesocial/web-new/commit/d0755b67478e51ae01ac82b71fdbc4e945f598a4))
* update content before mint ([0627c64](https://github.com/lemonadesocial/web-new/commit/0627c64c5f8feda9a334bd8967d5ff5a88002db9))
* update progress bar lemonheads mobile ([f15a479](https://github.com/lemonadesocial/web-new/commit/f15a4791fd25fcef388e763f3e07ee27845560aa))
* update timelines with lemonheads feed ([0276168](https://github.com/lemonadesocial/web-new/commit/02761683dc30cc076eefff0c123cc1ed8c8e66e8))


### Bug Fixes

* council cards mobile view ([8ecbf01](https://github.com/lemonadesocial/web-new/commit/8ecbf01be49fa01f7c03d2da03ecade37a9b5c9f))

## [7.5.0](https://github.com/lemonadesocial/web-new/compare/v7.4.0...v7.5.0) (2025-09-28)


### Features

* remove rule top, bottom and outfit ([da1faf4](https://github.com/lemonadesocial/web-new/commit/da1faf48e1e8b87058370f4b69846ee489f3a468))
* remove trait data ([5154684](https://github.com/lemonadesocial/web-new/commit/51546845b28499e5cb6dd48ff00ee98b48c61e84))

## [7.4.0](https://github.com/lemonadesocial/web-new/compare/v7.3.0...v7.4.0) (2025-09-28)


### Features

* add break words apply for special content ([53a7c7d](https://github.com/lemonadesocial/web-new/commit/53a7c7de7ec72aabd81f32785abf51f59f535934))
* update hint text ([4a28fa3](https://github.com/lemonadesocial/web-new/commit/4a28fa308b45cbf63cb6743c9c8219b7d6b7d3b9))


### Bug Fixes

* update tx url to mainet ([e4464e3](https://github.com/lemonadesocial/web-new/commit/e4464e3ca641186a2ed77b4774c6ca15e39a185c))

## [7.3.0](https://github.com/lemonadesocial/web-new/compare/v7.2.0...v7.3.0) (2025-09-27)


### Features

* add sentry capture exception ([2d467e9](https://github.com/lemonadesocial/web-new/commit/2d467e9e6151c7492e5a900b2e76b43a09b3fdab))
* import nextjs package ([ccb8747](https://github.com/lemonadesocial/web-new/commit/ccb8747e0ae0aae0d2b698b9a0e25ead85d4afad))

## [7.2.0](https://github.com/lemonadesocial/web-new/compare/v7.1.0...v7.2.0) (2025-09-26)


### Features

* check upgrade node ([39c618b](https://github.com/lemonadesocial/web-new/commit/39c618b089e063aa621cef2cb2f70606562ba55d))
* update docker ([022413d](https://github.com/lemonadesocial/web-new/commit/022413dc08a17a083cb5798c82ecbe01d1dc3ad9))
* update qrcode package - export guest list ([67173a0](https://github.com/lemonadesocial/web-new/commit/67173a0267a159327100cce86b9c4331732271f9))
* upgrade self core ([559b88c](https://github.com/lemonadesocial/web-new/commit/559b88c46b4269ca587c3a34da725eebda0237bb))


### Bug Fixes

* **lemonhead:** fix validate trait filters ([62f9a73](https://github.com/lemonadesocial/web-new/commit/62f9a7397f93261446a0a181a5f1ca683e8c277c))

## [7.1.0](https://github.com/lemonadesocial/web-new/compare/v7.0.0...v7.1.0) (2025-09-25)


### Features

* update feed address ([305a2ec](https://github.com/lemonadesocial/web-new/commit/305a2ec810f2e89842f33c7b26dc724ef87cafba))

## [7.0.0](https://github.com/lemonadesocial/web-new/compare/v6.15.0...v7.0.0) (2025-09-25)


### ⚠ BREAKING CHANGES

* council members

### Features

* add council title ([3a5c709](https://github.com/lemonadesocial/web-new/commit/3a5c709b6e523483aef945542b82272e5d672fa2))
* council members ([7813e15](https://github.com/lemonadesocial/web-new/commit/7813e15c59c3507c7bc7b08d226b656e46a164eb))
* resolve conflict style ([ac37d16](https://github.com/lemonadesocial/web-new/commit/ac37d16cde61d20f54478b65ad61a8ed009cc5b0))
* update feed post detail ([7a19d43](https://github.com/lemonadesocial/web-new/commit/7a19d43dddcf743eb6a98f883ab500fee0d8216d))


### Bug Fixes

* layout auto scale based on content ([f91f11a](https://github.com/lemonadesocial/web-new/commit/f91f11a4ed0e4af45ad70e258ecfbe87ee3efcc6))
* missing council display name ([637d315](https://github.com/lemonadesocial/web-new/commit/637d315e9d55fd6727f2da746ecb1a6214475505))

## [6.15.0](https://github.com/lemonadesocial/web-new/compare/v6.14.0...v6.15.0) (2025-09-24)


### Features

* add event to lemonheads community ([a76d070](https://github.com/lemonadesocial/web-new/commit/a76d070baf89d708bf1dbd5b70cf44963144630e))
* add gif ([7fd2291](https://github.com/lemonadesocial/web-new/commit/7fd2291502db4b67a31069d31d4ec4e1f4d6e6b5))
* complete home page lemonheads community ([25953fd](https://github.com/lemonadesocial/web-new/commit/25953fd3ccb1faa82b01de3e3ee70506d64e4fc2))
* delete post ([ccb8d1d](https://github.com/lemonadesocial/web-new/commit/ccb8d1d6f652ede9be8479a8b52a92220271652d))
* edit post ([b6fc276](https://github.com/lemonadesocial/web-new/commit/b6fc2762697abe8b2c4fd7e1548e33aff848f40b))
* enhance post textarea ([2da53a2](https://github.com/lemonadesocial/web-new/commit/2da53a24f0c214f1295b6f676328523cb34ff991))
* implement logic check render lock post feeds ([697d8e5](https://github.com/lemonadesocial/web-new/commit/697d8e543619eed6ab37ae1a790a147fbc306138))
* lemonheads gallery ([99eb88b](https://github.com/lemonadesocial/web-new/commit/99eb88bd811742d96fa89a139d5c624b66ed9223))
* load len feed from space ([12171f5](https://github.com/lemonadesocial/web-new/commit/12171f5606a14cb8dd429128f02ab0c8b7e1e7e4))
* remove lemonhead tab profile ([30fa4df](https://github.com/lemonadesocial/web-new/commit/30fa4df64135d6a16cf4416cf3b0c3b17597e2e0))
* resolve feedback from lemonheads hub ([118493b](https://github.com/lemonadesocial/web-new/commit/118493bbd11f8e6da548bc606408a932b8f10011))
* update border card ([a63c0be](https://github.com/lemonadesocial/web-new/commit/a63c0be0af7dbbe049639b63386da2343c46f510))
* update border dp ([8747bd0](https://github.com/lemonadesocial/web-new/commit/8747bd012c1e354cc45630d59a04c03eed7ee324))
* update border-width post feed ([00ffad3](https://github.com/lemonadesocial/web-new/commit/00ffad3b4ec080b53636283f45ae99155da3c45c))
* update connect wallet button lock feature ([b163175](https://github.com/lemonadesocial/web-new/commit/b163175ce15f9a476f6a7889d3780d5b8354e8c8))
* update download before set profile photo ([026d345](https://github.com/lemonadesocial/web-new/commit/026d34549e340854657371f0848b72b0c6176bc8))
* update featured hubs ([60dec3f](https://github.com/lemonadesocial/web-new/commit/60dec3f3d5f67b124c10ee9b180b8a239c5c7e7e))
* update font title ([71187b6](https://github.com/lemonadesocial/web-new/commit/71187b6e94241d36ba0162912dc87066050f0b2f))
* update icon ui mobile view ([e05d5b6](https://github.com/lemonadesocial/web-new/commit/e05d5b69e715802c3a7876631d50fc800910d9a3))
* update import path ([2c7493c](https://github.com/lemonadesocial/web-new/commit/2c7493c849d6766583d352626b94b06b18ab194c))
* update leaderboard lemonheads community ([5c54942](https://github.com/lemonadesocial/web-new/commit/5c549426f67d6cbc08cfd8c859646278404d8e1b))
* update locked content ([24ccf92](https://github.com/lemonadesocial/web-new/commit/24ccf92d43b0de8c43acce6bd70cb7b5ae14ad65))
* update mobile view ([cbfe331](https://github.com/lemonadesocial/web-new/commit/cbfe3313cbe9a645f74dadc964e04fff7d097abf))
* update post profile (user feed) ([d09d071](https://github.com/lemonadesocial/web-new/commit/d09d071283792a42fdb7fff267a0e7c0d35b3e56))
* update profile lemonheads community ([25c53a0](https://github.com/lemonadesocial/web-new/commit/25c53a007806e877062c82805cbed95d98d08f92))
* update profile page lemonheads community ([c69c3aa](https://github.com/lemonadesocial/web-new/commit/c69c3aa973cdb49f1ea8ede14a0946fc0394e3bb))

## [6.14.0](https://github.com/lemonadesocial/web-new/compare/v6.13.2...v6.14.0) (2025-09-19)


### Features

* update gitignore ([dd605fc](https://github.com/lemonadesocial/web-new/commit/dd605fccc3e45b6103c763afdcb92ca8cc07a74f))


### Bug Fixes

* reduce size on lemonheads mint flow ([90c8ef2](https://github.com/lemonadesocial/web-new/commit/90c8ef231686ec38739100e07b23a9062f4ed890))
* update missing shared action ([cd57669](https://github.com/lemonadesocial/web-new/commit/cd57669453950fc5d3d9fa5c8a7be3fbe734dcac))

## [6.13.2](https://github.com/lemonadesocial/web-new/compare/v6.13.1...v6.13.2) (2025-09-18)


### Bug Fixes

* update text ([e6bb8dc](https://github.com/lemonadesocial/web-new/commit/e6bb8dc5c162c1aa3994168d4515be1d10f61e58))

## [6.13.1](https://github.com/lemonadesocial/web-new/compare/v6.13.0...v6.13.1) (2025-09-18)


### Bug Fixes

* update event state hide_attending on manage event ([ed820df](https://github.com/lemonadesocial/web-new/commit/ed820df98ecdfc07b5c4463b06bee3aa7b1fdb71))

## [6.13.0](https://github.com/lemonadesocial/web-new/compare/v6.12.2...v6.13.0) (2025-09-18)


### Features

* display suffle at customize step ([4912eb4](https://github.com/lemonadesocial/web-new/commit/4912eb4fb69ba7c4426ab0bdbbe6be9fca235172))
* remove console ([975db82](https://github.com/lemonadesocial/web-new/commit/975db8233499c7ea17e34fa2560b459ad61982f5))
* update loading and empty state on leaderboard lemonheads ([e9ea799](https://github.com/lemonadesocial/web-new/commit/e9ea7997682b1632e8503dc55cf4647638e06437))
* update shared action on right column lemonheads ([2e45080](https://github.com/lemonadesocial/web-new/commit/2e45080e14d47aa0a9817219d92b451b01281d36))


### Bug Fixes

* improve ux ([07ff3d7](https://github.com/lemonadesocial/web-new/commit/07ff3d70d17856562a7feeeba50938da09248c74))
* **lemonhead:** fix pet race filter when random look ([f605695](https://github.com/lemonadesocial/web-new/commit/f605695e7517c1e154f2a647a6696bb1fc93884c))
* **lemonhead:** fix random look ([cdb03a0](https://github.com/lemonadesocial/web-new/commit/cdb03a0a3c0582eba724e6e54ce4a153e75e0ba9))
* missing hide attending event guest page ([03efced](https://github.com/lemonadesocial/web-new/commit/03efced074d2e78ae0d78ba259c3a33b23c29224))
* remove unused ([5ff1697](https://github.com/lemonadesocial/web-new/commit/5ff1697c0b55fd03e48e4f0b6b1687e712c2feaf))

## [6.12.2](https://github.com/lemonadesocial/web-new/compare/v6.12.1...v6.12.2) (2025-09-18)


### Bug Fixes

* truncate on desktop view ([07a406e](https://github.com/lemonadesocial/web-new/commit/07a406ef022003021eca8743ef5465af220bd1bf))

## [6.12.1](https://github.com/lemonadesocial/web-new/compare/v6.12.0...v6.12.1) (2025-09-18)


### Bug Fixes

* fix size avatar on mobile view ([c737208](https://github.com/lemonadesocial/web-new/commit/c737208bf2fd17daebb656264a5fa0637bd807e2))
* lint ([7c79a0b](https://github.com/lemonadesocial/web-new/commit/7c79a0b2acb255d009ace274b487e5d4c49a84e4))

## [6.12.0](https://github.com/lemonadesocial/web-new/compare/v6.11.1...v6.12.0) (2025-09-18)


### Features

* **lemonhead:** include inviter wallet address in nft metadata ([594dd57](https://github.com/lemonadesocial/web-new/commit/594dd57a764cf0e6dc24cbfb6d8c67dbd56fd1e8))
* remove unused ([38e807e](https://github.com/lemonadesocial/web-new/commit/38e807e12deefdfdec814e0ee1c40b8e5bee010a))
* update lemonheads title ([706beb1](https://github.com/lemonadesocial/web-new/commit/706beb1e4f5cf16edf3afaaa1c5373bdb0171d49))


### Bug Fixes

* add missing lin jpeg when build ([471744c](https://github.com/lemonadesocial/web-new/commit/471744cde32fd9c4f42058a302f347c428987fb6))
* check canMintLemonhead it could be null for some reason from be ([0a1318a](https://github.com/lemonadesocial/web-new/commit/0a1318a98423876ef6f4e8f2b29c41d024556c29))
* only fetch pricing when currency is set ([50b48c7](https://github.com/lemonadesocial/web-new/commit/50b48c71f203cfcd3bdd9b13b076a5bd65483526))
* udpate ui mobile view ([512aca5](https://github.com/lemonadesocial/web-new/commit/512aca54985d2828ba54ec78b17842c92bc33862))
* update drawer pane ui approval list ([1f29d87](https://github.com/lemonadesocial/web-new/commit/1f29d87035815224e171101089ef3b28a7e4c336))

## [6.11.1](https://github.com/lemonadesocial/web-new/compare/v6.11.0...v6.11.1) (2025-09-16)


### Bug Fixes

* hide content when navigate ([fa22a2b](https://github.com/lemonadesocial/web-new/commit/fa22a2b25fa10c9c73eeaedf0424d3ba0b4305aa))

## [6.11.0](https://github.com/lemonadesocial/web-new/compare/v6.10.0...v6.11.0) (2025-09-16)


### Features

* check wallets new before set user wallet ([931813f](https://github.com/lemonadesocial/web-new/commit/931813f8166a28e1183d0490c1fb84207895a492))
* missing hide scrollbar ([fae3909](https://github.com/lemonadesocial/web-new/commit/fae39094626190cf71962ef04acc59b55067190d))
* missing user avatar ([d745052](https://github.com/lemonadesocial/web-new/commit/d7450521449cef7b809dd743899f1cd9c406632d))
* revert - update leaderboard ([6dc2b2a](https://github.com/lemonadesocial/web-new/commit/6dc2b2ae85544426994ae8b6cd342e0c1e336231))
* update content ([6cceed8](https://github.com/lemonadesocial/web-new/commit/6cceed848b15aa12f96bb99934a8ebb646de5b49))
* update invite wallet ([6a13a18](https://github.com/lemonadesocial/web-new/commit/6a13a18405b45a3db400ab4ee4c2663933148cf2))
* update leaderboard ([7b12872](https://github.com/lemonadesocial/web-new/commit/7b12872e50cd28866dbd16610902bae54703f7ee))
* update lemonheads get started page ([9091b33](https://github.com/lemonadesocial/web-new/commit/9091b339b00455eb665386a04c7035b3ba7f9ace))
* update locked ([f372030](https://github.com/lemonadesocial/web-new/commit/f372030c0fb76920ff352cd8bff5d7030c406d11))
* update message ([fdb2f59](https://github.com/lemonadesocial/web-new/commit/fdb2f592c62676acee13207675279495b9d47f9a))
* update mobile view ([75a7a86](https://github.com/lemonadesocial/web-new/commit/75a7a86958bb82f2788363299088ab3b9dbdbf77))
* update pending list ui ([1b38a43](https://github.com/lemonadesocial/web-new/commit/1b38a4318d8bdca36a0973a278f66d4266dddfbf))
* update router lemonheads ([5f08c46](https://github.com/lemonadesocial/web-new/commit/5f08c46563279f13e29338a9e684560e13919281))
* update shared mint url ([9b09c32](https://github.com/lemonadesocial/web-new/commit/9b09c32089b0f373a4fc46d23837286b1870d488))


### Bug Fixes

* cannot read APP_ENV ([ad8f4c6](https://github.com/lemonadesocial/web-new/commit/ad8f4c644e2d3e3011c16a87ecf3a240ae42114e))
* discount payment ([5e27c4f](https://github.com/lemonadesocial/web-new/commit/5e27c4f7e92e1ceb44c3b3f6637b112c2918db8e))
* lint ([302dd0e](https://github.com/lemonadesocial/web-new/commit/302dd0ecc97ca848e04b9abae52eb02a52dceb03))
* rsvp doesn't close ([ba03d2f](https://github.com/lemonadesocial/web-new/commit/ba03d2ffca597c57cd56f1e5568f909b8e7a913f))
* **temp:** remove cancel payment ([475a023](https://github.com/lemonadesocial/web-new/commit/475a023d800a097d09845621919d54d2c62629e2))
* timezone not reflected ([a114343](https://github.com/lemonadesocial/web-new/commit/a1143437b2325ed538fc78f2dfa7df23bb9c0c34))
* update content default bio ([fce91e7](https://github.com/lemonadesocial/web-new/commit/fce91e75489fd89593a54eafd30b3339191b1445))

## [6.10.0](https://github.com/lemonadesocial/web-new/compare/v6.9.0...v6.10.0) (2025-09-12)


### Features

* add overlay ([3655e8d](https://github.com/lemonadesocial/web-new/commit/3655e8d4ed49a892a6f287095fc30dba7b8d3bb2))
* check address before loading image ([f385b8b](https://github.com/lemonadesocial/web-new/commit/f385b8bacfe7ecc056111c8a97ab2d0d7e199876))
* dont strict compare ([9200419](https://github.com/lemonadesocial/web-new/commit/9200419d2d977abfaf6e198e68d5fd9b62795d3d))
* hide select profile last step - update loading state modal ([e4607f1](https://github.com/lemonadesocial/web-new/commit/e4607f12e670872601c9ed5e357c70e46c178497))
* mint price only show when have at least one sponsor available ([dd491e5](https://github.com/lemonadesocial/web-new/commit/dd491e52c87ef2a73976b8675efdb2e0a42e261a))
* remove limit sponsor ([8664284](https://github.com/lemonadesocial/web-new/commit/86642844e3c09b3e67c02759633243f8bb0973ec))
* remove unused ([043382a](https://github.com/lemonadesocial/web-new/commit/043382a4f3abeb53c53e3287ba2efefbd0c9225e))
* remove unused - regenerate after update select account ([d9ce1f4](https://github.com/lemonadesocial/web-new/commit/d9ce1f46168cb93bf2b5d5563ba11e5ad97623c3))
* remove verify wallet step ([7a5ff54](https://github.com/lemonadesocial/web-new/commit/7a5ff548e17a4677b53fea41f5040c303aa29984))
* truncate username ([f411354](https://github.com/lemonadesocial/web-new/commit/f4113549437142388dbb2185ddb2e65c195792e3))
* update active sidebar ([c6a0d61](https://github.com/lemonadesocial/web-new/commit/c6a0d6198ddc058f318fdc8c99611d6d429862af))
* update community event lemonheads production ([6a84c05](https://github.com/lemonadesocial/web-new/commit/6a84c05934404377dc86da4c2db297ffd8734b22))
* update contract ([3fb3edc](https://github.com/lemonadesocial/web-new/commit/3fb3edc6a406d32e0ee0aaf8b1b8939e0d6b77fe))
* update contract ABI ([12bd0d7](https://github.com/lemonadesocial/web-new/commit/12bd0d7353ec0909f89e6cfeb8cc72d571626dc3))
* update event layout ([a4f3fe3](https://github.com/lemonadesocial/web-new/commit/a4f3fe30791659c9f8f31f89af3c08ba8a36e2cd))
* update event lemonheads ([8befecf](https://github.com/lemonadesocial/web-new/commit/8befecf60ff0048a0b73d09906cf598e0dc182be))
* update events testing ([de747a5](https://github.com/lemonadesocial/web-new/commit/de747a57ea1cc22b44c60c44a5ba151f66c34770))
* update generate image with color ([9d66e63](https://github.com/lemonadesocial/web-new/commit/9d66e63395146384eaa06b2398a62e6c7f5bba13))
* update home page ([ba6ded8](https://github.com/lemonadesocial/web-new/commit/ba6ded8dded547eee0db3e755227728e95ac1166))
* update invite modal ([2051263](https://github.com/lemonadesocial/web-new/commit/2051263125b09b72d1dcfbbe3612cb17ab98747b))
* update lab profile icon ([aff45a6](https://github.com/lemonadesocial/web-new/commit/aff45a60520deed165d5dd3e1a42332680578c7b))
* update loading state ([70e399c](https://github.com/lemonadesocial/web-new/commit/70e399c25381a1339caacafed8a3b1b6e83f08d7))
* update mint function call ([8915caf](https://github.com/lemonadesocial/web-new/commit/8915caf3c3c2ebc8c7bf47b5efd0b78e5e38b4e2))
* update minted modal ([15a9be6](https://github.com/lemonadesocial/web-new/commit/15a9be6cd6fe1341b41d2f10ac1ce8ce0f2bdbfe))
* update minted value ([903bd75](https://github.com/lemonadesocial/web-new/commit/903bd75077fb3db2b62ed2ff283244dc89c6d404))
* update mobile view ([0da9941](https://github.com/lemonadesocial/web-new/commit/0da9941e0e0596db8cee49f67e4b50e5417dddfe))
* update modal Insufficient Funds ([76a09fa](https://github.com/lemonadesocial/web-new/commit/76a09facb55e728c084e1f7f4467cd5877d4045e))
* update new mint price flow ([16c5560](https://github.com/lemonadesocial/web-new/commit/16c55606a59f0cc4d5544dd025c6887c88c12f1d))
* update newsfeed - events ([4518a09](https://github.com/lemonadesocial/web-new/commit/4518a0997352a3852ee3ac3a56d3a055a07c43e1))
* update progress bar ([7a6d2c4](https://github.com/lemonadesocial/web-new/commit/7a6d2c41e95aab613519b4eab45327cea4ad03f4))
* update route ([a2e409d](https://github.com/lemonadesocial/web-new/commit/a2e409d23b11a59a52df4a362613e8851eaaef47))
* update total minted ([c60f66f](https://github.com/lemonadesocial/web-new/commit/c60f66f61426c40be254510d47e72a503372534c))
* update white list field check can mint ([f7d645f](https://github.com/lemonadesocial/web-new/commit/f7d645f13616e68a0ecc4d39bdd4c10488e40ed6))


### Bug Fixes

* guest list page size ([988deae](https://github.com/lemonadesocial/web-new/commit/988deaee167ad399918c939842fb42587624c9ae))
* **temp:** remove cancel payment ([55033b9](https://github.com/lemonadesocial/web-new/commit/55033b9e7f85a5ca672ab0451d54b9ec8c07f52c))

## [6.9.0](https://github.com/lemonadesocial/web-new/compare/v6.8.0...v6.9.0) (2025-09-04)


### Features

* backward compatibility for sharing miniapp ([3dd0c2d](https://github.com/lemonadesocial/web-new/commit/3dd0c2d1de255ef631c9fa3bad8c0707918944aa))

## [6.8.0](https://github.com/lemonadesocial/web-new/compare/v6.7.0...v6.8.0) (2025-09-03)


### Features

* share miniapp ([cf1bf83](https://github.com/lemonadesocial/web-new/commit/cf1bf835fbb176356989224048024fe5d0f68a06))

## [6.7.0](https://github.com/lemonadesocial/web-new/compare/v6.6.0...v6.7.0) (2025-09-03)


### Features

* display farcaster username ([89c93ec](https://github.com/lemonadesocial/web-new/commit/89c93ecd0c374a9f0ba090696a66364b9210c5ce))
* link farcaster ([a197049](https://github.com/lemonadesocial/web-new/commit/a19704968d574896a36396ede13ea9a17b133caf))

## [6.6.0](https://github.com/lemonadesocial/web-new/compare/v6.5.0...v6.6.0) (2025-08-29)


### Features

* update connect farcaster status ([dbff8ec](https://github.com/lemonadesocial/web-new/commit/dbff8ec3d82904bd48ae82c9699f1122c9163a53))

## [6.5.0](https://github.com/lemonadesocial/web-new/compare/v6.4.0...v6.5.0) (2025-08-29)


### Features

* update age constraint ([cc2bd2a](https://github.com/lemonadesocial/web-new/commit/cc2bd2a04f9808651ee20425c57c1449f1d64213))
* update farcaster mobile ux ([d63d547](https://github.com/lemonadesocial/web-new/commit/d63d547325df243884f6aa7a3a6f495fb18e41bc))
* update self scan ([e008869](https://github.com/lemonadesocial/web-new/commit/e0088694cac9a06e99df46eb9240f62177dcea08))
* verify self ([f50d4ab](https://github.com/lemonadesocial/web-new/commit/f50d4ab5addc17f94301ca69652db4e0754290f8))


### Bug Fixes

* farcaster dialog ([0037478](https://github.com/lemonadesocial/web-new/commit/00374780cd961d554e003d29dc74ba90df2d196b))

## [6.4.0](https://github.com/lemonadesocial/web-new/compare/v6.3.0...v6.4.0) (2025-08-29)


### Features

* revert bottom bar mobile view ([efd426c](https://github.com/lemonadesocial/web-new/commit/efd426cba624379805dba8f883a115cbb0ba9e6f))

## [6.3.0](https://github.com/lemonadesocial/web-new/compare/v6.2.1...v6.3.0) (2025-08-28)


### Features

* update actions on Complete your profile ([7d93c58](https://github.com/lemonadesocial/web-new/commit/7d93c58beb45ff0ca52b7dc2a25739f361e1ec74))
* update mweb home page ([0872830](https://github.com/lemonadesocial/web-new/commit/0872830b5196ce916f5d5de8091d96fc741e5ad3))
* update settings navigation ([30dd442](https://github.com/lemonadesocial/web-new/commit/30dd442d9d62cee926db040d03677f7cf34ac22b))

## [6.2.1](https://github.com/lemonadesocial/web-new/compare/v6.2.0...v6.2.1) (2025-08-28)


### Bug Fixes

* typo ([1b55ce9](https://github.com/lemonadesocial/web-new/commit/1b55ce9a2b1287906027fce6fdd7fd7ebb9bdf56))

## [6.2.0](https://github.com/lemonadesocial/web-new/compare/v6.1.0...v6.2.0) (2025-08-28)


### Features

* update empty message ([ac11789](https://github.com/lemonadesocial/web-new/commit/ac11789323d1c0f21940b528341d269da30029ed))

## [6.1.0](https://github.com/lemonadesocial/web-new/compare/v6.0.0...v6.1.0) (2025-08-28)


### Features

* check host display ui ([129b173](https://github.com/lemonadesocial/web-new/commit/129b17344f9f25b5a85a2439a86d8bbe3b599c26))
* missing host ([1c74e49](https://github.com/lemonadesocial/web-new/commit/1c74e49681042a6f928578adadfd02e489cfa485))
* revert test ([fdcee9a](https://github.com/lemonadesocial/web-new/commit/fdcee9a81791c1a5d8b7e7dd077e07dc7e4032d7))
* update connect wallet ([a26fd88](https://github.com/lemonadesocial/web-new/commit/a26fd88b5719914b33a2e469e7383276b4636680))
* update type ([0d1d4e4](https://github.com/lemonadesocial/web-new/commit/0d1d4e4f2ad19fc446e8b05d36cbbcb7af3ccc50))

## [6.0.0](https://github.com/lemonadesocial/web-new/compare/v5.7.0...v6.0.0) (2025-08-27)


### ⚠ BREAKING CHANGES

* edit coupon

### Features

* customize rsvp email ([95b45c4](https://github.com/lemonadesocial/web-new/commit/95b45c42085ca747f59967297c4eddb9b2de1ef6))
* edit coupon ([ed20f20](https://github.com/lemonadesocial/web-new/commit/ed20f202550a3860681b7f84c050fd5f74876cdc))


### Bug Fixes

* pending limit ([3485853](https://github.com/lemonadesocial/web-new/commit/3485853d5f394108db070a56768b0929bf1ad9d8))
* whitelabel post login popup ([43cd9f4](https://github.com/lemonadesocial/web-new/commit/43cd9f45d3e6aca9679cf35e69457c224db1cadb))

## [5.7.0](https://github.com/lemonadesocial/web-new/compare/v5.6.0...v5.7.0) (2025-08-26)


### Features

* show poap minting network ([cb5c040](https://github.com/lemonadesocial/web-new/commit/cb5c040d9b17dc06037758d9912fe03fbb81900a))


### Bug Fixes

* only show ready poaps for guests ([da2be04](https://github.com/lemonadesocial/web-new/commit/da2be04de042d0101b837fc872609a021b5548de))

## [5.6.0](https://github.com/lemonadesocial/web-new/compare/v5.5.1...v5.6.0) (2025-08-26)


### Features

* remove unused ([dc33fb6](https://github.com/lemonadesocial/web-new/commit/dc33fb65389ee2644e8cfa0f937c1164615aed1f))
* update combine date with timezone ([f7baac4](https://github.com/lemonadesocial/web-new/commit/f7baac4492176e5f9ac796ae0946c71de8e73cd4))
* update min max count between 1 and 29 ([8626f36](https://github.com/lemonadesocial/web-new/commit/8626f367031d2f3b99417603df7ccbc99c54fa90))
* update success modal clone event ([27fd1b5](https://github.com/lemonadesocial/web-new/commit/27fd1b5e935befd42cca664ddb87f00f14b169f5))
* update ui clone success modal ([470e9f0](https://github.com/lemonadesocial/web-new/commit/470e9f050be75d04ec4272f71450257bf8c5a55f))


### Bug Fixes

* complete profile popup on whitelabel ([226686e](https://github.com/lemonadesocial/web-new/commit/226686e530f778896300bc8df574f05be99461ad))
* update timezone ([70e65b7](https://github.com/lemonadesocial/web-new/commit/70e65b781a88f0a4b90a1dcb3f9a42999f25f244))
* wrong condition ([ee3eaa1](https://github.com/lemonadesocial/web-new/commit/ee3eaa1c657d4598ffe31b9e2d06f50ee0545072))

## [5.5.1](https://github.com/lemonadesocial/web-new/compare/v5.5.0...v5.5.1) (2025-08-25)


### Bug Fixes

* menu content community ([dbfcf59](https://github.com/lemonadesocial/web-new/commit/dbfcf598a2293ee0e6e0d7e84a76ba3f55229adc))


### Reverts

* poap network ([24b9293](https://github.com/lemonadesocial/web-new/commit/24b929328b12be23df283ab5297fe2c403719440))

## [5.5.0](https://github.com/lemonadesocial/web-new/compare/v5.4.0...v5.5.0) (2025-08-25)


### Features

* add community when clone event ([d85ceaf](https://github.com/lemonadesocial/web-new/commit/d85ceafe89f8e53c321f840294e68b1b003ede16))
* event coupon ([de0728b](https://github.com/lemonadesocial/web-new/commit/de0728bcc1919679e339bebd1c346a28b475fdfc))
* manage host - fallback to user id ([0a55843](https://github.com/lemonadesocial/web-new/commit/0a5584368ecede89b671eef703e1f5910ae12bd0))
* missing iamge input dropdown ([0ece341](https://github.com/lemonadesocial/web-new/commit/0ece3412881896b1fc07b7a552abf72ef3160b8e))
* poap network ([b877469](https://github.com/lemonadesocial/web-new/commit/b877469dc02b482c7de593b1de93edcd8729b4e8))
* remove cohost ([422073c](https://github.com/lemonadesocial/web-new/commit/422073c1c1dd916973f35ce00bab31dc82b0d6dc))
* revert ([116cc23](https://github.com/lemonadesocial/web-new/commit/116cc2331a5763a5482e22e9039945e736ad1815))
* update start date ([be6c12a](https://github.com/lemonadesocial/web-new/commit/be6c12a0be476c1759b3e832d910c22d327a2898))
* upgrade sentry ([83e8cb9](https://github.com/lemonadesocial/web-new/commit/83e8cb9b364aa1b3e369731fa5500ec5cbbb000b))


### Bug Fixes

* long ticket desc ([6a340f6](https://github.com/lemonadesocial/web-new/commit/6a340f6130ebb739cdc993dd1a8dc89410580b99))
* missing load private from event ([95cbf8b](https://github.com/lemonadesocial/web-new/commit/95cbf8b928fc7ed9e0b4b81154950e250983936f))
* remove test prefix ([959c9cb](https://github.com/lemonadesocial/web-new/commit/959c9cb5609628a19f49e73157c090fb81b38785))
* update ui ([67bf99f](https://github.com/lemonadesocial/web-new/commit/67bf99ffa353860985b928f6d6e6cfaa2e346e15))
* update ui recurring ([3320b8b](https://github.com/lemonadesocial/web-new/commit/3320b8b6981b82b7f9282ee2aa547c7e11ad806d))

## [5.4.0](https://github.com/lemonadesocial/web-new/compare/v5.3.0...v5.4.0) (2025-08-23)


### Features

* open event new tab on mobile from community ([4a3e133](https://github.com/lemonadesocial/web-new/commit/4a3e1331d0f18e398b7c7dc5ef416d9a29942a3c))

## [5.3.0](https://github.com/lemonadesocial/web-new/compare/v5.2.4...v5.3.0) (2025-08-22)


### Features

* oauth2 updates ([b357546](https://github.com/lemonadesocial/web-new/commit/b357546dc32ae3775e3225dd6cab901a904083c2))


### Bug Fixes

* drawer issues ([35f7292](https://github.com/lemonadesocial/web-new/commit/35f7292c12fcecd255cce01f2da115abe24bbc53))
* free ticket doesn't show as free ([5689544](https://github.com/lemonadesocial/web-new/commit/5689544865582345f16773a7b8ccdb31de3f0aa8))

## [5.2.4](https://github.com/lemonadesocial/web-new/compare/v5.2.3...v5.2.4) (2025-08-22)


### Bug Fixes

* missing mobile view ([dc795b1](https://github.com/lemonadesocial/web-new/commit/dc795b1524d01ac2a610158af7b9a7356f52d5ca))

## [5.2.3](https://github.com/lemonadesocial/web-new/compare/v5.2.2...v5.2.3) (2025-08-22)


### Bug Fixes

* missing flexbox ([5ec3d40](https://github.com/lemonadesocial/web-new/commit/5ec3d407520b778c12f9581286f4b43c141cb217))

## [5.2.2](https://github.com/lemonadesocial/web-new/compare/v5.2.1...v5.2.2) (2025-08-22)


### Bug Fixes

* ui pane break ([02e9a49](https://github.com/lemonadesocial/web-new/commit/02e9a49a2978ec020abbcfa004311e33d5fa2056))

## [5.2.1](https://github.com/lemonadesocial/web-new/compare/v5.2.0...v5.2.1) (2025-08-21)


### Bug Fixes

* missing route whitelabel ([f06b2cb](https://github.com/lemonadesocial/web-new/commit/f06b2cbaa5112a2d734bd3d54fcbfdc91b14d7c8))
* only allow create event ([402dee1](https://github.com/lemonadesocial/web-new/commit/402dee1f0072bad2916f62a7ae116896150c29f2))

## [5.2.0](https://github.com/lemonadesocial/web-new/compare/v5.1.4...v5.2.0) (2025-08-21)


### Features

* implement re-order ([6a3ad71](https://github.com/lemonadesocial/web-new/commit/6a3ad71f481d68d3208a8375ac0c525f2bc3686b))
* udpate default layout sections value ([e241a2b](https://github.com/lemonadesocial/web-new/commit/e241a2b283a7b65a41f9434f5d6d40990db514d3))
* whitelabel direct login ([7f36593](https://github.com/lemonadesocial/web-new/commit/7f3659393d51ddfd5655ecdf0cf9cc2b3086a6fb))

## [5.1.4](https://github.com/lemonadesocial/web-new/compare/v5.1.3...v5.1.4) (2025-08-20)


### Bug Fixes

* remove filter on id ([3a57504](https://github.com/lemonadesocial/web-new/commit/3a575042e390dba9217678e5bd26269cf30a2326))

## [5.1.3](https://github.com/lemonadesocial/web-new/compare/v5.1.2...v5.1.3) (2025-08-20)


### Bug Fixes

* remove filter on id ([b4aedaf](https://github.com/lemonadesocial/web-new/commit/b4aedaf3d578489551dfef9e17f73ffeee98d2ca))
* update missing fields ([ca94a9c](https://github.com/lemonadesocial/web-new/commit/ca94a9c10c468711d841b02af03907008dc88731))

## [5.1.2](https://github.com/lemonadesocial/web-new/compare/v5.1.1...v5.1.2) (2025-08-20)


### Bug Fixes

* revert filter ([72679c5](https://github.com/lemonadesocial/web-new/commit/72679c572073733d3d8faca7656872af2da2211e))

## [5.1.1](https://github.com/lemonadesocial/web-new/compare/v5.1.0...v5.1.1) (2025-08-20)


### Bug Fixes

* email fallback for cohost ([e40af70](https://github.com/lemonadesocial/web-new/commit/e40af70d92f185b3c12c0b5b9c68fe4ef10f9528))
* filter draft when select hosting ([2e234ce](https://github.com/lemonadesocial/web-new/commit/2e234cefc97c387cffca11cf0676cbf7ee1878d4))
* hosts display on event list ([fc4f0a2](https://github.com/lemonadesocial/web-new/commit/fc4f0a280cfdb7c47c34fc86c1f2e0b2b1a91440))

## [5.1.0](https://github.com/lemonadesocial/web-new/compare/v5.0.3...v5.1.0) (2025-08-20)


### Features

* missing hydra client id ([0da9ad0](https://github.com/lemonadesocial/web-new/commit/0da9ad0c02d8624a496ba9632743675a4a51d12b))
* update draft bagde ([dc3a718](https://github.com/lemonadesocial/web-new/commit/dc3a71837bca8435c080756df254f2feac6a9e52))


### Bug Fixes

* remove visible cohosts fallback ([61f2327](https://github.com/lemonadesocial/web-new/commit/61f23271edcdd441699736a520e3aa4e957d25a6))

## [5.0.3](https://github.com/lemonadesocial/web-new/compare/v5.0.2...v5.0.3) (2025-08-20)


### Bug Fixes

* missing update whitelabel ([c6069d0](https://github.com/lemonadesocial/web-new/commit/c6069d07888942cad135efac89cef763a19a2a1a))
* update sub path ([41665a3](https://github.com/lemonadesocial/web-new/commit/41665a33abef7e0ab7db34c5886a4543afaf6aa7))

## [5.0.2](https://github.com/lemonadesocial/web-new/compare/v5.0.1...v5.0.2) (2025-08-20)


### Bug Fixes

* format short date ([78b3959](https://github.com/lemonadesocial/web-new/commit/78b395943633aa99edf22bb36f85d2925c11552d))
* missing auth ([61eb000](https://github.com/lemonadesocial/web-new/commit/61eb000a1f70199cc2e7c13bb11becb52f225e58))

## [5.0.1](https://github.com/lemonadesocial/web-new/compare/v5.0.0...v5.0.1) (2025-08-20)


### Bug Fixes

* middot render ([ab4fdeb](https://github.com/lemonadesocial/web-new/commit/ab4fdeb1b4551741f18ac48040e767dbb9f8359b))

## [5.0.0](https://github.com/lemonadesocial/web-new/compare/v4.4.0...v5.0.0) (2025-08-20)


### ⚠ BREAKING CHANGES

* update host event types

### Features

* add token gate label ([273fe4e](https://github.com/lemonadesocial/web-new/commit/273fe4ec7c3c0059fa994412e485345e79b7c407))
* poap creation loading ([df5af4a](https://github.com/lemonadesocial/web-new/commit/df5af4aa15ebe9bb32449cbb39d7d7ce480b8af7))
* update format date event guest view ([5e8bac0](https://github.com/lemonadesocial/web-new/commit/5e8bac0b45a8517856fb68330fb5da27217b655a))
* update host event types ([de99389](https://github.com/lemonadesocial/web-new/commit/de993893498bfabc991c450ebcf61a842eb91fc8))


### Bug Fixes

* check claimed date ([3d5e7c7](https://github.com/lemonadesocial/web-new/commit/3d5e7c70db34a1c50e7ff3aa1a97b7f5ea865b6d))
* checking caching ([5fed743](https://github.com/lemonadesocial/web-new/commit/5fed7439678aeeac77a7dfdad9ec6200f8a77fe5))
* it could be same query from some place ([b0548cb](https://github.com/lemonadesocial/web-new/commit/b0548cb6024c14181db7155a3f956a03b82120b6))
* no collectibles ([66da46c](https://github.com/lemonadesocial/web-new/commit/66da46c0ea68293996b7412c21f66d73b42f115a))
* type selector behavior ([6a99575](https://github.com/lemonadesocial/web-new/commit/6a99575e5b70e9cb187298106b7a75247c2ad8c5))
* type selector style ([e5d0403](https://github.com/lemonadesocial/web-new/commit/e5d04031f144a944ed9f097a7a73208ace1725e5))

## [4.4.0](https://github.com/lemonadesocial/web-new/compare/v4.3.0...v4.4.0) (2025-08-18)


### Features

* update default font ([e5ded41](https://github.com/lemonadesocial/web-new/commit/e5ded41e2aa3045f58619a89a1df147080d882b3))

## [4.3.0](https://github.com/lemonadesocial/web-new/compare/v4.2.0...v4.3.0) (2025-08-18)


### Features

* poap itegration ([92d664e](https://github.com/lemonadesocial/web-new/commit/92d664e540266d3aa72645649d9684f983835705))

## [4.2.0](https://github.com/lemonadesocial/web-new/compare/v4.1.0...v4.2.0) (2025-08-18)


### Features

* add email list ([aa49c43](https://github.com/lemonadesocial/web-new/commit/aa49c43e736759e1d1d40b9494582c688071b00d))
* filter ticket type ([e2cce7e](https://github.com/lemonadesocial/web-new/commit/e2cce7e90de471b5b193894353946a75e96d024c))
* handle Farcaster login jwt ([3e3351a](https://github.com/lemonadesocial/web-new/commit/3e3351a85164d5c5ed11d959aa89c7cc74cdf93e))
* set mini app ready ([2dccfbc](https://github.com/lemonadesocial/web-new/commit/2dccfbcc7e7262f4855d88bbbe14ae95a7edb39b))
* update user ([a724089](https://github.com/lemonadesocial/web-new/commit/a72408905821966e2f4994de457efbe27a768a32))


### Bug Fixes

* display issue on safari ([07ef194](https://github.com/lemonadesocial/web-new/commit/07ef194cf5475ddde150ac18cb2fd5973c563654))
* fix loading using atom is useAuth ([41fc7f8](https://github.com/lemonadesocial/web-new/commit/41fc7f8e07bbe1def64d7e3e57b707e91d3b2fc0))
* refetch me ([577981a](https://github.com/lemonadesocial/web-new/commit/577981a1d851fee796a93d9bca7a0a0f335ff1f3))

## [4.1.0](https://github.com/lemonadesocial/web-new/compare/v4.0.1...v4.1.0) (2025-08-15)


### Features

* disabled dismiss modal ([66bd583](https://github.com/lemonadesocial/web-new/commit/66bd583698fd5cd839df005f0268842bdd5ab3f3))
* hooks error ([a8e95f5](https://github.com/lemonadesocial/web-new/commit/a8e95f5f2b8afb88ec043173d4830b1959a4a1c0))
* remove auth cookie param after logging in ([7c2d106](https://github.com/lemonadesocial/web-new/commit/7c2d106e785894d9f5d523c68ec5d4fa66f5571e))
* unicor login ([d8164e5](https://github.com/lemonadesocial/web-new/commit/d8164e5433a87d168e585d19e667f8ed12234cee))
* update add guest to list ([3e63d19](https://github.com/lemonadesocial/web-new/commit/3e63d19eceba179959690d00c924bf0d3b294108))
* update btn style ([99da37d](https://github.com/lemonadesocial/web-new/commit/99da37daa36dabeb2b12a3a718e310526c25c09f))
* update custom message invite email ([1ddd882](https://github.com/lemonadesocial/web-new/commit/1ddd8829f4f98fc1fd1ca83148f99375fa311a5b))
* update filter invite emails ([7f13a7c](https://github.com/lemonadesocial/web-new/commit/7f13a7cb8872996db52913fcdc3dd75c8f48cd29))
* update guests view ui manage event ([3eaa1fb](https://github.com/lemonadesocial/web-new/commit/3eaa1fbf325458881ec7bfc420d16f791a9742df))
* update human timing schedule email ([ffdde9c](https://github.com/lemonadesocial/web-new/commit/ffdde9c7c0747f90f24db844ea26e1177d097e87))
* update invite guest modal ([746cb51](https://github.com/lemonadesocial/web-new/commit/746cb51f91b7dfbd90b23d482465286d8444d8a6))
* update message schedule email ([f1b3781](https://github.com/lemonadesocial/web-new/commit/f1b3781b1c03813b14c7b6c53c56cf8899082593))
* update mweb pending approval list ([4a58eed](https://github.com/lemonadesocial/web-new/commit/4a58eed5b9ea1055b207ef890c404f8320727b08))
* update table mweb ([87ac0ba](https://github.com/lemonadesocial/web-new/commit/87ac0babb88bc0584535e3387cc0e673699337ce))
* update ui overview manage event ([5b9cf39](https://github.com/lemonadesocial/web-new/commit/5b9cf3958a8fbf71f07cfc44888caf783711fb5f))


### Bug Fixes

* allow dismiss modal ([900c598](https://github.com/lemonadesocial/web-new/commit/900c59807dd5286b416e3675be7b23bc737f5cd5))
* checking modal event blasts ([602725c](https://github.com/lemonadesocial/web-new/commit/602725c18adc8feec7e8528929c1bd6926ca1650))
* getMe called mul times ([86ee628](https://github.com/lemonadesocial/web-new/commit/86ee6281eded23948c0c6ca34606ccec9c9a85d9))
* me is null ([822c2ea](https://github.com/lemonadesocial/web-new/commit/822c2eaf44cd80820239a648791ff508938a56ca))
* navigate perf ([5dce0e2](https://github.com/lemonadesocial/web-new/commit/5dce0e28b5201ca08eea84f6b3253a353f4be553))
* stripe account ([656e1f3](https://github.com/lemonadesocial/web-new/commit/656e1f32851ed15a3b2c461af918e4f452209d19))
* whoami called mul times ([42cc0c5](https://github.com/lemonadesocial/web-new/commit/42cc0c5f299b7a73cb31cdce0446ccd23b712dae))
* whoami get called multiple times ([3e50f27](https://github.com/lemonadesocial/web-new/commit/3e50f27129cc10e6de8fde82e03f0015d14d1bd0))
* wrong all guests actio ([ab19501](https://github.com/lemonadesocial/web-new/commit/ab19501d7e9822705d729ea44d27ab42881d5129))
* wrong message ([ef13c05](https://github.com/lemonadesocial/web-new/commit/ef13c05a62f4503cff77ea6310e2f7e2ebb8ed73))

## [4.0.1](https://github.com/lemonadesocial/web-new/compare/v4.0.0...v4.0.1) (2025-08-13)


### Bug Fixes

* event ticket description overflow ([9f9ee1c](https://github.com/lemonadesocial/web-new/commit/9f9ee1ce7a5a72ad3257aa7327f25c0070411ac0))
* hide email and socials in wallet connect ([5c09883](https://github.com/lemonadesocial/web-new/commit/5c09883eee2c60780f23bfc71fc886526bcf8f57))

## [4.0.0](https://github.com/lemonadesocial/web-new/compare/v3.1.0...v4.0.0) (2025-08-12)


### ⚠ BREAKING CHANGES

* manage event
* update event visible cohosts fragments
* update event visible cohosts fragments

### Features

* add bottom bar ([a707c39](https://github.com/lemonadesocial/web-new/commit/a707c3955591c2267bac733a15319d8c68018807))
* add core logic & unit tests ([a716080](https://github.com/lemonadesocial/web-new/commit/a7160804d4f6b2d620e746509e51e527197683d5))
* add feedback - advanced send email ([aa9670a](https://github.com/lemonadesocial/web-new/commit/aa9670ae37f30c46af786cfd59b494d6834a4630))
* add intrusment layer ([bd94234](https://github.com/lemonadesocial/web-new/commit/bd94234500c0aeb2678ed279456a98ac3d5754d8))
* add lemonheads entry point ([5b151cd](https://github.com/lemonadesocial/web-new/commit/5b151cd090fd0016f8daa22d3cfc07c07195a8e2))
* add log ([51b7db0](https://github.com/lemonadesocial/web-new/commit/51b7db0cd3947b99224db818b2666154eddbbe9f))
* add necklace ([0c4d3c3](https://github.com/lemonadesocial/web-new/commit/0c4d3c37f3d1a709967604ace44ec0ad908f4eb3))
* add step ui claim ([cfc7644](https://github.com/lemonadesocial/web-new/commit/cfc76442d5626b686b5a88cf9694a0ae2f20e0ee))
* add switch account and disconnect ([9182f11](https://github.com/lemonadesocial/web-new/commit/9182f11cebdcdab0d25c72a1183793f2269afafb))
* add token id ([7972ceb](https://github.com/lemonadesocial/web-new/commit/7972ceb84899c4236401c6392ea896880ba701c4))
* allow dismiss modal ([5a60416](https://github.com/lemonadesocial/web-new/commit/5a60416efb6cffc375bdb95b1535ef935240e041))
* **auth:** implement unified login signup ([9d1c66d](https://github.com/lemonadesocial/web-new/commit/9d1c66de361bc3cdff2f174e0f94a29b41f8f582))
* break works on post modal ([ba07e7b](https://github.com/lemonadesocial/web-new/commit/ba07e7b3f9e03eb05858d291391343fe3ff61eef))
* call lemonheadnft contract ([fd271cb](https://github.com/lemonadesocial/web-new/commit/fd271cb18d3c06f7b9f73bed57b91bd3b41ad09c))
* cancel payment ([c56ba4c](https://github.com/lemonadesocial/web-new/commit/c56ba4ce0742efdb4d2e7e5e384a4aff3f607bfb))
* change all tables to layers ([cb25175](https://github.com/lemonadesocial/web-new/commit/cb251751066731d51eef8cebfb26044331b7cd17))
* change endpoint ([01e9d45](https://github.com/lemonadesocial/web-new/commit/01e9d459752f85569dbcdb664e6886ac12f9f70e))
* check auth ([7dd9255](https://github.com/lemonadesocial/web-new/commit/7dd9255f7175efdfaa15a7aeb328ce2e4e18cf05))
* check balance ([6c34587](https://github.com/lemonadesocial/web-new/commit/6c34587a45d9dbd16b4956c8fb0710cd2902591a))
* check can mint after connect wallet ([311d78d](https://github.com/lemonadesocial/web-new/commit/311d78d764bd7eb3314e48e3a4fc20b2e9d344a9))
* check if nft is minted ([b8bf55a](https://github.com/lemonadesocial/web-new/commit/b8bf55a317d72d084e18b95ca0dc1a35d4dc577b))
* check mint process ([000c9e7](https://github.com/lemonadesocial/web-new/commit/000c9e7f9cbbc9766e002aa24afa823c4407e19f))
* check mweb ([6a65bb7](https://github.com/lemonadesocial/web-new/commit/6a65bb7451123a21e6118e536fb97e537c644f74))
* check payment state of event join requests ([da3cd2e](https://github.com/lemonadesocial/web-new/commit/da3cd2ea0ae8daed007419ff9f5663ab50d09cef))
* check tx response ([a1fc92f](https://github.com/lemonadesocial/web-new/commit/a1fc92fa4c9fd794888a046a778315d07661d991))
* checking post composer modal ([5107913](https://github.com/lemonadesocial/web-new/commit/5107913d71f93383fc58d1c38299e13f03a5b277))
* citizen check ([56c6628](https://github.com/lemonadesocial/web-new/commit/56c6628108889bc81cb972131adcf74096a07150))
* close modal after share post ([2eee8af](https://github.com/lemonadesocial/web-new/commit/2eee8afedda3045301b6a507400938d0cff2372c))
* complete migrate ([51c65f3](https://github.com/lemonadesocial/web-new/commit/51c65f31a2bf39f78e7384b7c990d9944d9d5210))
* complete mobile ([971baa4](https://github.com/lemonadesocial/web-new/commit/971baa4bd70a962b698d5029783ba23aa39fa67d))
* complete mweb post ([2c697da](https://github.com/lemonadesocial/web-new/commit/2c697da4187557722030536276c96f4dd0645290))
* complete share actions ([ed18d7b](https://github.com/lemonadesocial/web-new/commit/ed18d7bb46a486cb1c26e3a935eddafefbb85ffe))
* complete web view ([14e7f40](https://github.com/lemonadesocial/web-new/commit/14e7f40afeda309b88d700622a5017326f840704))
* completed ([c31cbb3](https://github.com/lemonadesocial/web-new/commit/c31cbb32aec528153a93329b136137f8af5c48a0))
* completed mweb ([b0246dd](https://github.com/lemonadesocial/web-new/commit/b0246dd1c9cdb10a26829f1f0f4f91e06d8ef21c))
* determine nft output image format ([019f313](https://github.com/lemonadesocial/web-new/commit/019f3130c08f5aaebd97ff4dab8d3080883fccc9))
* extract metadata ([6ed38de](https://github.com/lemonadesocial/web-new/commit/6ed38de957ad3d545460f8159de8d0ea25191fd2))
* fallback name ([50626be](https://github.com/lemonadesocial/web-new/commit/50626be12ea6c3c12ef84adeadb9238a91602539))
* feature family wallet ([e94e861](https://github.com/lemonadesocial/web-new/commit/e94e8619ee715429d2d0a4d0c4648f66d138ae85))
* filter background style ([753d414](https://github.com/lemonadesocial/web-new/commit/753d414f33f773b30ffbfddf7d6135b11c573071))
* fix style mweb ([8a98421](https://github.com/lemonadesocial/web-new/commit/8a984214ab55c2ccd57a612f171fd195cfa1fb96))
* format error message ([14c99d2](https://github.com/lemonadesocial/web-new/commit/14c99d2a6a9e80cf2f7f67f9249ed418067e4e4c))
* full page content ([a6c1640](https://github.com/lemonadesocial/web-new/commit/a6c1640f7fdf5a8ab5ce72e3ebfe16f8038ff040))
* get default set ([d84d012](https://github.com/lemonadesocial/web-new/commit/d84d012a73fa0e1f989625152fb437dc2a0a3042))
* get token id ([7732cb8](https://github.com/lemonadesocial/web-new/commit/7732cb807ff31a68d41aac081afa591593cbc89b))
* guests overview ([fb6e2cd](https://github.com/lemonadesocial/web-new/commit/fb6e2cda3aa1d15d6adf2a6546662aa5410aa335))
* handle email login / sign up ([8803b70](https://github.com/lemonadesocial/web-new/commit/8803b7001b2b6d562f32929342d562308de07b97))
* handle link unicorn wallet ([b77613f](https://github.com/lemonadesocial/web-new/commit/b77613f2db8c80016ccb5bec9f8514300bcc40be))
* handle oidc ([1275b90](https://github.com/lemonadesocial/web-new/commit/1275b90d0811445bd2a3c379ef48c5906cdb0b5a))
* handle resend email code ([38ed2b8](https://github.com/lemonadesocial/web-new/commit/38ed2b87bb67f7d91a040b89e4bdf23ff3aece4b))
* handle unicorn login with session ([b7efe50](https://github.com/lemonadesocial/web-new/commit/b7efe50e274d9b26a005be2a5daa9626a201cf5a))
* hide lemonheads feature ([8cb0dba](https://github.com/lemonadesocial/web-new/commit/8cb0dbaee5d7f373f12b155a2edee23dfa0337c8))
* hide tabs ([c9dca71](https://github.com/lemonadesocial/web-new/commit/c9dca71d35dcb05c75c3121c0ddeac9dd8e508ce))
* hide who to follow on mobile ([d5b917c](https://github.com/lemonadesocial/web-new/commit/d5b917cd8ac0a16635c039469f5c75db37e504a3))
* home restructure ([bf9dc9a](https://github.com/lemonadesocial/web-new/commit/bf9dc9aefe4c521e93b37bab9570ec0c5268ad5c))
* implement blasts ([de9c587](https://github.com/lemonadesocial/web-new/commit/de9c587b11afe4414d0098adeb27fe28ae7255e2))
* implement create community ([7608d59](https://github.com/lemonadesocial/web-new/commit/7608d59cfa3346cf76d7c3281bfe3c43089fcac1))
* implement image & metadata generation ([33661c9](https://github.com/lemonadesocial/web-new/commit/33661c96069967a559b9d22ff9e5c92f006dce92))
* implement share image ([fb54960](https://github.com/lemonadesocial/web-new/commit/fb5496055a64b47ebe6c0dfc00475a17696780c5))
* improve modal ([affda30](https://github.com/lemonadesocial/web-new/commit/affda302667e0859b59ad1c776447f5f10af8f00))
* **lemonhead:** add custom validation for alien ([e500e9d](https://github.com/lemonadesocial/web-new/commit/e500e9d95d8356220c90336544be9ebeb9ff81bb))
* **lemonhead:** add layers and update table id ([926ed52](https://github.com/lemonadesocial/web-new/commit/926ed5223222ddbef0042246fa7d72f1bb42ca92))
* **lemonhead:** request backend for lemonhead layers ([3140fe1](https://github.com/lemonadesocial/web-new/commit/3140fe112c0266ae417c299e2abbef20b24d6f6c))
* **lemonhead:** request backend for lemonhead layers ([24f4d1c](https://github.com/lemonadesocial/web-new/commit/24f4d1ccb7172fbbb988873a9b9fa0b45d0f0f50))
* **lemonhead:** update NFT description ([ad9d64e](https://github.com/lemonadesocial/web-new/commit/ad9d64ec6ea827ace2e092119f9e92109939bb72))
* **lemonhead:** update output size and description ([ef4364c](https://github.com/lemonadesocial/web-new/commit/ef4364c9a645209228fdf8a8c7976c350dd4c0d5))
* lens log out on signing out ([8b9abb1](https://github.com/lemonadesocial/web-new/commit/8b9abb186701e526c336fe33db90c1eeccd1693c))
* lint ([ef17643](https://github.com/lemonadesocial/web-new/commit/ef176438011601711266f90e9fb2246249ac9b06))
* lint code ([a39a2ec](https://github.com/lemonadesocial/web-new/commit/a39a2ecea2d4bfdaf83518965575d3fdda392572))
* lint code ([9d0fb3a](https://github.com/lemonadesocial/web-new/commit/9d0fb3a010849bb0ecc96166a4f2e1ef1a26058e))
* lint code ([4079e05](https://github.com/lemonadesocial/web-new/commit/4079e05b763d952de961054308373d0bab354d5e))
* login sign up with wallet ([13ff297](https://github.com/lemonadesocial/web-new/commit/13ff297a9c364d03ef70b14be9962149a6a57d3d))
* manage event ([69f9865](https://github.com/lemonadesocial/web-new/commit/69f9865d2e1522a278906c955e39b04cb9b657a1))
* manage event ([29fe643](https://github.com/lemonadesocial/web-new/commit/29fe6431f38a55a086168f7370affd010110a5b6))
* missing connected but still cannot mint ([5e44dcd](https://github.com/lemonadesocial/web-new/commit/5e44dcd95bb9c3d01a483fc736fefbcff73f46a3))
* missing value schedule datetime ([fe2416c](https://github.com/lemonadesocial/web-new/commit/fe2416cf567f86d2b3640e6c45d714453fd6b694))
* mute video by default ([934e6ec](https://github.com/lemonadesocial/web-new/commit/934e6ecbc8dd8e5e19926947a852fdc8de0ff7db))
* new auth flow ([8c226cb](https://github.com/lemonadesocial/web-new/commit/8c226cb7a90e129de951ffe23d9116fc27bda440))
* **nginx:** increase proxy buffer ([18397e7](https://github.com/lemonadesocial/web-new/commit/18397e74ce97e99403666810507e94853a456bc6))
* optimize preselec ([f0ede4a](https://github.com/lemonadesocial/web-new/commit/f0ede4a8b01b164e6dbbce2c70ecd8949bb01a15))
* prevent dismiss modal ([cb5dac2](https://github.com/lemonadesocial/web-new/commit/cb5dac2c4e18f11bc30956bb29699a879c9d9197))
* profile page ([f9d8225](https://github.com/lemonadesocial/web-new/commit/f9d82251d5794caa09ad5fee9ff24ae57906b633))
* refactor lemonheads ([727981c](https://github.com/lemonadesocial/web-new/commit/727981c9d05670ca82bcd720afae8fbc550367e1))
* remove blur toggle blasts input ([17d540c](https://github.com/lemonadesocial/web-new/commit/17d540cba76eda720f40f7077234a72999f34aff))
* remove contract address ([1729fba](https://github.com/lemonadesocial/web-new/commit/1729fba0d65cb6cabc3de54feaf08b221390f3a5))
* remove contract env ([01bd3d6](https://github.com/lemonadesocial/web-new/commit/01bd3d6793b2a4f0017baa536f0e8b0d6f5040db))
* remove unused ([322e495](https://github.com/lemonadesocial/web-new/commit/322e495183e6dd0937328369173659731b795ed2))
* remove unused ([aba544b](https://github.com/lemonadesocial/web-new/commit/aba544b71af92e5cb729f9d267e69ef5533c18d8))
* request change preselect ([79a783b](https://github.com/lemonadesocial/web-new/commit/79a783b84872383a73a67346a677938eb05c55bd))
* resolve loading height content ([1812f1e](https://github.com/lemonadesocial/web-new/commit/1812f1eae624b87c2b1dd34bd081b98ff81c2380))
* resolve small desktop view ([b2b4444](https://github.com/lemonadesocial/web-new/commit/b2b4444da485d7e706bf63b80f420999f9d2fd09))
* resolve tablet ([61187ff](https://github.com/lemonadesocial/web-new/commit/61187ff69541c5bb789f3b6135ca1603faf171b9))
* restructure feed ([16257f6](https://github.com/lemonadesocial/web-new/commit/16257f637b33fb57adc9a8ba11891276f549e1ba))
* revert ([01f5f44](https://github.com/lemonadesocial/web-new/commit/01f5f4490950c56fa6abe09e323cd7fcbb781473))
* revert upgreade lens ([1d1652f](https://github.com/lemonadesocial/web-new/commit/1d1652f1890d64231a281326ff444593b87ff1c8))
* rm unused ([4fd23e0](https://github.com/lemonadesocial/web-new/commit/4fd23e0f44f2a0443bc407afcadea53b44b3785f))
* session check ([0c0e584](https://github.com/lemonadesocial/web-new/commit/0c0e584d1eedea9118753c3182e5f116f51e8157))
* stand card ([f5c8cd0](https://github.com/lemonadesocial/web-new/commit/f5c8cd03c27eea152b340437b8324f13107b74bb))
* **temp:** hide swipe ([d92ac3d](https://github.com/lemonadesocial/web-new/commit/d92ac3d35d907ec0a3c86d721e4294934cb8281e))
* testing display image ([023f88a](https://github.com/lemonadesocial/web-new/commit/023f88a91eeeae76bdd3becd2490ff3eca0e015a))
* ticket desc ([55a8c4d](https://github.com/lemonadesocial/web-new/commit/55a8c4da5514aceb6d9e4e06d9cb1da53fae6ede))
* ticket visibility ([8a2a1df](https://github.com/lemonadesocial/web-new/commit/8a2a1dff4509f90e5ff0d33dcdc8eb19be7cd3f3))
* udpate text ([cd48e0d](https://github.com/lemonadesocial/web-new/commit/cd48e0d1d9aaf7164bba300cc9bb14f54949ed12))
* unhance minting flow ([93fa75a](https://github.com/lemonadesocial/web-new/commit/93fa75abf3dd17ee840f34b6175d8fe31fae5537))
* upcoming events card ([64a1045](https://github.com/lemonadesocial/web-new/commit/64a1045f51bec28f915b632416e2ed2e5c8e478f))
* update accout creation ([d702af0](https://github.com/lemonadesocial/web-new/commit/d702af0214f353f2a045d41e86a4a5fd5477a5cc))
* update alien color ([ae656d5](https://github.com/lemonadesocial/web-new/commit/ae656d513c470ea414b65b77722435b187c2f73e))
* update assets filtering ([c369762](https://github.com/lemonadesocial/web-new/commit/c369762dd9007caa7971fc3179e2d647fbf0ad00))
* update bot ([2824d8f](https://github.com/lemonadesocial/web-new/commit/2824d8f8d86046894c63509029ec346b11b64000))
* update color - preview mweb ([f4a915c](https://github.com/lemonadesocial/web-new/commit/f4a915c8f96e43bd8fc81505f2380d6daf9fa290))
* update colorset ([912cc7d](https://github.com/lemonadesocial/web-new/commit/912cc7d3d734afb4ccf53130d69bf4bd88a8fd24))
* update core logic ([4765173](https://github.com/lemonadesocial/web-new/commit/47651734418db5d3bd40326a5e079708fc738a18))
* update data changed ([22bfb64](https://github.com/lemonadesocial/web-new/commit/22bfb645588469192c6ab779f599accae66dc6dc))
* update data type ([d90d61f](https://github.com/lemonadesocial/web-new/commit/d90d61f90859a9e16eca152fa68b3cbc075969b5))
* update default blasts advance ([d4fee6f](https://github.com/lemonadesocial/web-new/commit/d4fee6fe34a251dad0be882fb6ddfe729e8bb006))
* update deselect ([23ddbaf](https://github.com/lemonadesocial/web-new/commit/23ddbaf4293431ad9a38084f74d8e949afa38042))
* update display schedule date blasts advanced ([847c2f5](https://github.com/lemonadesocial/web-new/commit/847c2f5a6705361287babbdb99c3df3be7a08509))
* update divider post composer ([30ce704](https://github.com/lemonadesocial/web-new/commit/30ce70431a6fc842f09a4a3a92e15ec04ee1b670))
* update env ([b55c445](https://github.com/lemonadesocial/web-new/commit/b55c445083da202744bbd199d15faf874f529645))
* update error ([48982a3](https://github.com/lemonadesocial/web-new/commit/48982a3af097a77c4eeb2fe5fc7ca93e114a4c76))
* update error message ([7e962c9](https://github.com/lemonadesocial/web-new/commit/7e962c9aee297e608cba28028ede61df27064b98))
* update error message ([270ee5d](https://github.com/lemonadesocial/web-new/commit/270ee5dba3f4e0f3b0512e07f14ffbb2afc17390))
* update event visibility ([44d3dc6](https://github.com/lemonadesocial/web-new/commit/44d3dc6fc71043a2c2274a37a39e08fc43d6c65d))
* update event visible cohosts fragments ([3d89d4c](https://github.com/lemonadesocial/web-new/commit/3d89d4c86b0bd90bde8e6e46983518e88f01a2df))
* update event visible cohosts fragments ([d091cae](https://github.com/lemonadesocial/web-new/commit/d091cae34a61027d430c603f24c2a1dd094c34dd))
* update filter background ([2d72537](https://github.com/lemonadesocial/web-new/commit/2d725379212249e1a5c781ed9c0280a96764e07b))
* update filter background ([532a08a](https://github.com/lemonadesocial/web-new/commit/532a08aeeb7648a2aed4ef8bbc7147002b5215bd))
* update filter bag ([8de5c17](https://github.com/lemonadesocial/web-new/commit/8de5c179a4c87b867f85f42cd110eed90eb05fff))
* update filter list ([ab2473c](https://github.com/lemonadesocial/web-new/commit/ab2473cc6534a098e73abaeb38da7e9b8de7d198))
* update filters/pets ([a31bd76](https://github.com/lemonadesocial/web-new/commit/a31bd7694e83b11e211ad272d753adba859fe61f))
* update format message - list external space ([512a25d](https://github.com/lemonadesocial/web-new/commit/512a25d58288422570a5696f8e7226c575f2e1b7))
* update generate final image ([8feaad7](https://github.com/lemonadesocial/web-new/commit/8feaad737a31c3a532a266c176195c4aa909b86c))
* update get started screen ([549df54](https://github.com/lemonadesocial/web-new/commit/549df54bcb2faf97121e4e5f790479523b02fb67))
* update graphql ([ab8f751](https://github.com/lemonadesocial/web-new/commit/ab8f751184d0a8f19c54808dff3f95b16278f10c))
* update handle oidc ([b785c8c](https://github.com/lemonadesocial/web-new/commit/b785c8c48002601f386e8920e770b3e2153f1652))
* update header item ([03e2f16](https://github.com/lemonadesocial/web-new/commit/03e2f16ffe9c3577fe33e8d906528a8b73550cf5))
* update image lemonheads link preview ([76543d9](https://github.com/lemonadesocial/web-new/commit/76543d9aa8e0c8b64939b234363bfa7681e2b2c2))
* update instrument ([67f6688](https://github.com/lemonadesocial/web-new/commit/67f668822c8b499a014777251f038fe7e87c2f09))
* update keyboard avoid modal ([18c448e](https://github.com/lemonadesocial/web-new/commit/18c448edd6a2387d7257ce643a0431ab3e8c273c))
* update layer type ([52e65c5](https://github.com/lemonadesocial/web-new/commit/52e65c5a8f8b0ebdb0da39b199bf0750359f00fe))
* update layering logic ([599351c](https://github.com/lemonadesocial/web-new/commit/599351c63b3773dbb8b37889e21a32c08cd2ec94))
* update layout ([a0b4767](https://github.com/lemonadesocial/web-new/commit/a0b4767898ae220c8a23b5e4916cf1f2d7559017))
* update layout claim success ([c797121](https://github.com/lemonadesocial/web-new/commit/c79712195011f95e4c1ad9c6d9321cf002bc2a4d))
* update layout mobile ([984e63a](https://github.com/lemonadesocial/web-new/commit/984e63aa2511887fb19aee6dae8d44a55c24d1e9))
* update layout mweb ([29e9109](https://github.com/lemonadesocial/web-new/commit/29e910973df6557538b0a6ebdbeea81e2f4f88ff))
* update link preview ([e5b9190](https://github.com/lemonadesocial/web-new/commit/e5b919099ba10782f9539460ba8e7cb12e7164b4))
* update link preview post content ([2f4ee5c](https://github.com/lemonadesocial/web-new/commit/2f4ee5c07da434eefed5ec68e1ac7a1b268f458e))
* update link-preview ([8bdcc91](https://github.com/lemonadesocial/web-new/commit/8bdcc912fbb3dc495ff3d47135c34f30a8636813))
* update loading state ([a26b5b2](https://github.com/lemonadesocial/web-new/commit/a26b5b2af43d5ab8999313d9b104e1c59afec834))
* update mbweb ([f927606](https://github.com/lemonadesocial/web-new/commit/f927606430115faf0c41ef816270197d17ca9655))
* update message error ([4dbb018](https://github.com/lemonadesocial/web-new/commit/4dbb0182b54f3636756f190d8554a67a5336149f))
* update metadata ([1deae6b](https://github.com/lemonadesocial/web-new/commit/1deae6b90f4cd7157856c32bd7d7cfff61558214))
* update mint api ([6e6b4ff](https://github.com/lemonadesocial/web-new/commit/6e6b4ff280805f2a106fceebe3e25e92f3dd5032))
* update mint price ([54f0351](https://github.com/lemonadesocial/web-new/commit/54f035101ca6215ea47ee3731e56356f0ceba029))
* update mint state ui ([c730c38](https://github.com/lemonadesocial/web-new/commit/c730c38d474d204d8422c3aecc62c5b00462de9a))
* update mint success ui ([9ab9d03](https://github.com/lemonadesocial/web-new/commit/9ab9d036417f5c05758f6234ed482c3758790190))
* update mobile view ([ed2a2de](https://github.com/lemonadesocial/web-new/commit/ed2a2deb173091681cb8e1e5ec84eb621b1bb980))
* update mobile view ([75b9104](https://github.com/lemonadesocial/web-new/commit/75b91040aa19e2e238c778f73c7519e12ba1b531))
* update modal flow ([0c1ab9d](https://github.com/lemonadesocial/web-new/commit/0c1ab9dffae8847bba09bad15e785e4215d890b9))
* update modal mobile view ([54c9efd](https://github.com/lemonadesocial/web-new/commit/54c9efd1ff5a4bc2a89c403e14c4be73c74024cb))
* update modal style ([bb2e85b](https://github.com/lemonadesocial/web-new/commit/bb2e85b330642e4d2d27015e3f57c49b3e2f1d39))
* update mweb ui ([04b40a4](https://github.com/lemonadesocial/web-new/commit/04b40a4a24c6f28de46d5a8549361c5efe194274))
* update new api ([f3091d7](https://github.com/lemonadesocial/web-new/commit/f3091d77ca6de6cd6965ca50d3bda3d90f073cea))
* update new trait - bag, earings, tie ([7c0c19a](https://github.com/lemonadesocial/web-new/commit/7c0c19a890e709d0b478b41a4db09ef940f7de23))
* update post mweb ([1071db0](https://github.com/lemonadesocial/web-new/commit/1071db064828a47cf6ef226d1b41a9412ef1586c))
* update process modal ([c9f0fcc](https://github.com/lemonadesocial/web-new/commit/c9f0fccacc5b2112e05d9c159a367066fbc17da7))
* update reset action - handle mint state ([9aebc8a](https://github.com/lemonadesocial/web-new/commit/9aebc8a70793bac1a3839e77d34da8a5bced0d07))
* update response structure from BE ([800d7dc](https://github.com/lemonadesocial/web-new/commit/800d7dcef4a4512d6e74494ca5904c9276ee47c1))
* update router ([57db427](https://github.com/lemonadesocial/web-new/commit/57db427df72971450c6771c30a5e37bcf81334f9))
* update scroll height textarea ([9a26bbd](https://github.com/lemonadesocial/web-new/commit/9a26bbdf2d9ee1d1436cc0029ec6dc65a5dc1582))
* update send email - test email ([9f8301c](https://github.com/lemonadesocial/web-new/commit/9f8301cd225ac518ccb9b96043187fa3fe4c1197))
* update settings page ([52a9b27](https://github.com/lemonadesocial/web-new/commit/52a9b277bfae7299746ec974f6d990a4cabac840))
* update share post lemonheads ([180eae8](https://github.com/lemonadesocial/web-new/commit/180eae89a00a3a176f97e6c04508ca9014e0367c))
* update sidebar ([db45e32](https://github.com/lemonadesocial/web-new/commit/db45e32a938ca83b58388f61e773a8c11d8787a5))
* update string utils ([401b78f](https://github.com/lemonadesocial/web-new/commit/401b78f8e61d936e5ea0df829b53798677c3708a))
* update style mobile color pick ([0b40864](https://github.com/lemonadesocial/web-new/commit/0b4086481e7675d2826d765371c6865a2140e738))
* update styling modal ([0195b64](https://github.com/lemonadesocial/web-new/commit/0195b64ed1f1848f015b6fa23ae38a48ad192f59))
* update swipe footer ([bfecec8](https://github.com/lemonadesocial/web-new/commit/bfecec8632cd9f55eb593e490405d90ceff9aa0a))
* update tabs label ([f0694d5](https://github.com/lemonadesocial/web-new/commit/f0694d5f7bc692aea3e847d0f96cdde01d0fe39f))
* update test ([64c18fd](https://github.com/lemonadesocial/web-new/commit/64c18fdd3bb59c38e241f747143a47c19801443d))
* update ui ([9b5e2b2](https://github.com/lemonadesocial/web-new/commit/9b5e2b2ea34e97342815b76a82a55d9b22ed2629))
* update ui claim ([40dbbb5](https://github.com/lemonadesocial/web-new/commit/40dbbb5f693475580e139052de5eae2c6db828b2))
* update video control web ([f841410](https://github.com/lemonadesocial/web-new/commit/f841410fbf9e8857fbf33c38190189b6504baaa5))
* update video post mint ([b5a62f4](https://github.com/lemonadesocial/web-new/commit/b5a62f406120ef93e7c91dbeb58c46290e318aaf))
* update wallet login password ([894e2fd](https://github.com/lemonadesocial/web-new/commit/894e2fd5b62cce4aff07cecb0d573955b530fc54))
* update whoami session ([9fe9547](https://github.com/lemonadesocial/web-new/commit/9fe9547c9d8e6250a08661568a1320fc691a1213))
* upgreade lens ([b90728a](https://github.com/lemonadesocial/web-new/commit/b90728af12682eeb9968c9976450e104c77a2056))
* who to follow ([a8b002a](https://github.com/lemonadesocial/web-new/commit/a8b002afb70ee517a188d717384a1f1c142b52df))


### Bug Fixes

* active overview ([515d506](https://github.com/lemonadesocial/web-new/commit/515d506ccfbea1991de8e4086f1655b4ad3bd3b9))
* add loading - compile time too slow ([eeff659](https://github.com/lemonadesocial/web-new/commit/eeff6594012da8a7ce7543a0e9467075a5c8465f))
* add token id ([9444e8f](https://github.com/lemonadesocial/web-new/commit/9444e8fb0c26f9219950df75e2510a18ae82cb49))
* add transaction confirmation ([98837af](https://github.com/lemonadesocial/web-new/commit/98837afdc557854804c55098500359bb8ecaf681))
* build ([9280e84](https://github.com/lemonadesocial/web-new/commit/9280e846d6dc01ac886a3dbbc65a766d297cb1e8))
* caching filter ([3723240](https://github.com/lemonadesocial/web-new/commit/3723240f32f8029fdeef0e86a19de06af05e0482))
* check from node ([818cb51](https://github.com/lemonadesocial/web-new/commit/818cb51caa635e424411faee165be2f693e8a299))
* check mint before claim ([7b6d4db](https://github.com/lemonadesocial/web-new/commit/7b6d4dbfbb992d4963a3b5505b84b5d85cf4858f))
* check mint data ([b9c5b57](https://github.com/lemonadesocial/web-new/commit/b9c5b57ffd6450147943fafc116b7cab6d4413f0))
* check mintPrice with sponsor ([bfdffeb](https://github.com/lemonadesocial/web-new/commit/bfdffebd9d6258707d2c86d5413a9ff710467a0a))
* check python build ([be33898](https://github.com/lemonadesocial/web-new/commit/be338981f6accea31f4a90d4346bcab6e3a679ec))
* checking build ([e8d3466](https://github.com/lemonadesocial/web-new/commit/e8d34664bfb88ea597cf4733c05ba07a9b7c2c4a))
* checking canvas lib ([91abb3a](https://github.com/lemonadesocial/web-new/commit/91abb3a24a7c9a5bc46ede017a02e217cd7cfe7f))
* checking issue auth modal ([381d1b8](https://github.com/lemonadesocial/web-new/commit/381d1b8af1a06b04eddefe7860d65c1ecbaf6e45))
* checking view tnx ([bbc605f](https://github.com/lemonadesocial/web-new/commit/bbc605ff7e915a142befa92a10d12d552de81837))
* claim username without wallet ([b455d5e](https://github.com/lemonadesocial/web-new/commit/b455d5e548f289fc69e491b9064c96ea70815632))
* clean refetch ([95c7511](https://github.com/lemonadesocial/web-new/commit/95c75110e5ff388ae6e46f254630bbff7bfad447))
* display identity ([4c168f1](https://github.com/lemonadesocial/web-new/commit/4c168f1b676aaa013e58e3801c8f404268a4e836))
* dont show content when not login ([5c80285](https://github.com/lemonadesocial/web-new/commit/5c80285b3edd6f83b127ad28b833170a18c3be5b))
* duplicate check ([bee86c4](https://github.com/lemonadesocial/web-new/commit/bee86c43846e8fb0cd8085d12522767315d20392))
* duplicate filter ([09171f9](https://github.com/lemonadesocial/web-new/commit/09171f9aadf8427254d54d4ceafdcd487f558cf5))
* email suggestion ([f0ec964](https://github.com/lemonadesocial/web-new/commit/f0ec9646f36caca74b676e27fa5741bb5799d2a7))
* fallback account display ([ebc86f7](https://github.com/lemonadesocial/web-new/commit/ebc86f79f6da89e42124c93665fbf52f731521cf))
* fallback to address ([757b1d9](https://github.com/lemonadesocial/web-new/commit/757b1d9abf18b0aa3d606298abbdbc07ee12318c))
* fallback to name ([2acf167](https://github.com/lemonadesocial/web-new/commit/2acf167df5d0aef7a4e4495c31641697feca49dc))
* filter background ([dcd5145](https://github.com/lemonadesocial/web-new/commit/dcd5145ddcb1181e8bdc8adebb73907d0ea40123))
* filter size ([e30c4a2](https://github.com/lemonadesocial/web-new/commit/e30c4a2ee8291b4392381127c4a6436396203ee2))
* fix small issues ([5cb81f1](https://github.com/lemonadesocial/web-new/commit/5cb81f1c8611a815908c2716bb122e6b724ee9cd))
* fix some render issue ([a94e767](https://github.com/lemonadesocial/web-new/commit/a94e767261680cebe0b7980fa8642be61c690edd))
* fix terms link ([2f6873d](https://github.com/lemonadesocial/web-new/commit/2f6873d96ba7a9be0d950b25594731e998013953))
* follow status ([22e44a9](https://github.com/lemonadesocial/web-new/commit/22e44a9203d48d6b8c6184f72f1bb41b0c053baf))
* format date with timezone ([e4e78e1](https://github.com/lemonadesocial/web-new/commit/e4e78e1919c3526fe279070a03b27ed3f07b9976))
* gender accessories ([81122e0](https://github.com/lemonadesocial/web-new/commit/81122e0064e4f878c911a11830fa26b5ad5e31ec))
* guest display name ([73bd303](https://github.com/lemonadesocial/web-new/commit/73bd303253fad3bc5bc7fc4ad2cac1dbc335b5aa))
* handle error ([55d376b](https://github.com/lemonadesocial/web-new/commit/55d376b756f936d28b24254420a6c539749e0137))
* hide menu on mweb ([6a10745](https://github.com/lemonadesocial/web-new/commit/6a10745d2073f4e76f1a6317b72c39aea18fb267))
* hide posting for lemonheads ([a81a275](https://github.com/lemonadesocial/web-new/commit/a81a2755658f1d6b025907fdb5ca1fe25bfb72de))
* high image quality ([63562aa](https://github.com/lemonadesocial/web-new/commit/63562aa976a55e351dff26c31a5e25ebbe96076a))
* ignore eyes,mouth,hair on alien ([9084066](https://github.com/lemonadesocial/web-new/commit/90840669fe9dbd4f36a5cec85a4b13bee6628000))
* import ([5e3a98b](https://github.com/lemonadesocial/web-new/commit/5e3a98bc08820565851fa4b73f5394ea8826feeb))
* increase rounded card ([1c63928](https://github.com/lemonadesocial/web-new/commit/1c63928dc81a0667bb1839f0da847de9c707021a))
* invite display name ([7544325](https://github.com/lemonadesocial/web-new/commit/7544325dd3d6d227e06f3898052c01302a6c5cdc))
* layout ([ca08531](https://github.com/lemonadesocial/web-new/commit/ca085316798b35477c7e477a5fe13e7e7f224148))
* layout home content ([ac7e414](https://github.com/lemonadesocial/web-new/commit/ac7e41448504fe96e1abdda9e1988472ef923f34))
* layout repsonsive ([93d8781](https://github.com/lemonadesocial/web-new/commit/93d8781620a3c7193bf7b13132131b035467d12b))
* **lemonhead:** add color filter to coresponding layers ([01563f5](https://github.com/lemonadesocial/web-new/commit/01563f54404e136050e6e1ab3d5a28e91d9459b8))
* **lemonhead:** fix alien validation ([afcf0be](https://github.com/lemonadesocial/web-new/commit/afcf0bec0e59043cdd260c5e23ae1e0c11aa49bf))
* **lemonhead:** fix calculation of final traits ([2d43a1d](https://github.com/lemonadesocial/web-new/commit/2d43a1d23552e18b2682543bf619bc2647f0c356))
* **lemonhead:** fix FE preview logic ([5267da0](https://github.com/lemonadesocial/web-new/commit/5267da0de9544fb0db1c5216e405a20e950b687c))
* **lemonhead:** fix formatString not to lowercase ([035b368](https://github.com/lemonadesocial/web-new/commit/035b368dd3aab0e303556abb3df67cf67cfb303e))
* **lemonhead:** fix missing cairo in final image ([d10ee26](https://github.com/lemonadesocial/web-new/commit/d10ee26774edf11bc783ca199ae27a4a8d61dd68))
* **lemonhead:** improve validation logic & look hash ([3cd4302](https://github.com/lemonadesocial/web-new/commit/3cd4302f07b04529abae179c7b10500179faf709))
* lint ([90fbab0](https://github.com/lemonadesocial/web-new/commit/90fbab0dabb8a707210c7adec09c5b5c7000fb82))
* lint ([0e6c32f](https://github.com/lemonadesocial/web-new/commit/0e6c32f8ab4c6d67259a07024ef4e8189afd15fe))
* lint ([38743db](https://github.com/lemonadesocial/web-new/commit/38743db0ac9c3a482227ccc8cb2bbcb2ebe62337))
* lint code ([faaf11b](https://github.com/lemonadesocial/web-new/commit/faaf11bddca6be0e63c06fc4e02899f511273fc8))
* lint code ([012e992](https://github.com/lemonadesocial/web-new/commit/012e992fe736eb862d40fa5da95af4f83dbc8f29))
* lint code ([c8318f7](https://github.com/lemonadesocial/web-new/commit/c8318f77abf9fcf64759b49b1eb033d65e60dcaf))
* lint code ([504bd29](https://github.com/lemonadesocial/web-new/commit/504bd2967720f2a8674b50d051b94a7620cd371d))
* lint code ([9db7732](https://github.com/lemonadesocial/web-new/commit/9db77327062d455cf08c41deabcce57d4720cf23))
* lint code ([b101ad2](https://github.com/lemonadesocial/web-new/commit/b101ad2ebc1f55a5c1f92d4c448ace7dfb552b07))
* loading image ([c8f5466](https://github.com/lemonadesocial/web-new/commit/c8f5466f1c4fd96db40b9542683f446babe71dd0))
* **login:** fix wallet login with lowercase ([398abb8](https://github.com/lemonadesocial/web-new/commit/398abb804d83ea110d8e1e2f2e67f438b20837ba))
* menu not show ([261e272](https://github.com/lemonadesocial/web-new/commit/261e2721722a4066f4795e25b48b56ea4349f63d))
* missed filter size on body ([00898c8](https://github.com/lemonadesocial/web-new/commit/00898c80544f7647a57bbf3aa9a867b483ebe1c9))
* missing color ([0550bf5](https://github.com/lemonadesocial/web-new/commit/0550bf505cc627abf8401b5f4cbc9a9538f2d858))
* missing default assets human ([c02c7a4](https://github.com/lemonadesocial/web-new/commit/c02c7a4935e7b1b5444882ab3879338f0baf10c4))
* missing env ([3318a63](https://github.com/lemonadesocial/web-new/commit/3318a639606d47f0e011ad184a0d54855772013d))
* missing field ([356938c](https://github.com/lemonadesocial/web-new/commit/356938cdd2eed6d01f0f566df687acb4ba5e0d31))
* missing field - ui send blasts overview manage event ([c75f71e](https://github.com/lemonadesocial/web-new/commit/c75f71ed8ced0c75ee5111cb2d351aedc20c273c))
* missing filter background ([43d3d3c](https://github.com/lemonadesocial/web-new/commit/43d3d3c41afeaa217a9b38800989b3b4254e8fe3))
* missing form values claim steps ([5b9892a](https://github.com/lemonadesocial/web-new/commit/5b9892aebbc50f6d675d6761026bbf217c0d16c0))
* missing state preview select gender ([78ab2fb](https://github.com/lemonadesocial/web-new/commit/78ab2fb8dcd347821edca28ebf0f72de9a8d1aa5))
* missing transform ([b084281](https://github.com/lemonadesocial/web-new/commit/b0842815e7e9e0a28bbdae47c8e01fa6682d5c00))
* mobile view ([2e0f3c5](https://github.com/lemonadesocial/web-new/commit/2e0f3c5567948c4d352fadf002f52736e330f499))
* mobile view - add delete button ([c75e061](https://github.com/lemonadesocial/web-new/commit/c75e06135a918eb555892be338baa2a9a62af12e))
* modal close function ([ba4bae5](https://github.com/lemonadesocial/web-new/commit/ba4bae50432fa2fc10940077707691eecb9f119d))
* move check valid mint to claim button ([86df32c](https://github.com/lemonadesocial/web-new/commit/86df32cf4ff27622a3b2903fb4820f09f54ea34d))
* only for testing ([94e1531](https://github.com/lemonadesocial/web-new/commit/94e15316eaa09fe0c8c772b34b27d4fc89a56db2))
* open check in ([c34e570](https://github.com/lemonadesocial/web-new/commit/c34e570bad893f51694bf7817e170bc0fafefd46))
* optimize preselect image ([bf2ad6d](https://github.com/lemonadesocial/web-new/commit/bf2ad6d8d06dc48e1fc8b30208249bb9d30f8221))
* pagination ([eacec66](https://github.com/lemonadesocial/web-new/commit/eacec66d584d20c6451f0e987871ae2e8db402f9))
* pending approval title ([dbe7b74](https://github.com/lemonadesocial/web-new/commit/dbe7b7400b9a72110303b96ba56b5ea9881348b0))
* placeholder ([4771475](https://github.com/lemonadesocial/web-new/commit/4771475138403167c5b6509a10605f779bf57702))
* post content overflow ([cfceafe](https://github.com/lemonadesocial/web-new/commit/cfceafed4cfb646288619e673f6e3619c29f5a9f))
* redeclare ([9512c25](https://github.com/lemonadesocial/web-new/commit/9512c25c69bc5a46541ea16dda1e2ca32065dc06))
* remove divider desktop view ([4a29d55](https://github.com/lemonadesocial/web-new/commit/4a29d55b3bc9edc20eadef219d86ea85965a77ba))
* remove testing ([5b4018a](https://github.com/lemonadesocial/web-new/commit/5b4018a06aad5e163ea8b26bdff4235fa60ddc6c))
* remove testing ([e2c3377](https://github.com/lemonadesocial/web-new/commit/e2c33771b1bd2e54c9185ebf6022d35cda0951d3))
* revert ([ac4f935](https://github.com/lemonadesocial/web-new/commit/ac4f9359f3d22d2d8d2d23197f4df26d6c4911a3))
* revert code ([bc01f2b](https://github.com/lemonadesocial/web-new/commit/bc01f2bd43338253ed6461cfd22ffb4a1bc4113e))
* revert new mint flow ([53ea923](https://github.com/lemonadesocial/web-new/commit/53ea9231520842462a695d2a399262cc55592440))
* select/deselect color ([42b2363](https://github.com/lemonadesocial/web-new/commit/42b236301d29952b9b18cadd4a77d4db85458e2e))
* should show back button when minted false ([e33d0de](https://github.com/lemonadesocial/web-new/commit/e33d0de5ccc760f8693de83b292df3443b888003))
* show who to follow when logged in ([364b2de](https://github.com/lemonadesocial/web-new/commit/364b2deab77150d476e625da56e7f19d2a2b9282))
* sidebar divider ([34c4c5a](https://github.com/lemonadesocial/web-new/commit/34c4c5a61f1df0bb660f9a1533fc938c8f0ea4e9))
* skip retry when fail ([d6e3210](https://github.com/lemonadesocial/web-new/commit/d6e321042417e8de79a540e7ab4743955df52a32))
* stand url ([3e7ee1d](https://github.com/lemonadesocial/web-new/commit/3e7ee1daef981e4dc22ba1d2a1d7b7619bce9fd1))
* style bg action ([fecb5f1](https://github.com/lemonadesocial/web-new/commit/fecb5f1eb0f93fb3a80f5d9e322997ed1867ecb8))
* tabs control home page ([489418f](https://github.com/lemonadesocial/web-new/commit/489418f82eb6e38a1627183f838bc167891d4699))
* testing mint ([019c253](https://github.com/lemonadesocial/web-new/commit/019c253ae085088e83b68c9e1130276daf925eb2))
* text ([7f811dd](https://github.com/lemonadesocial/web-new/commit/7f811ddd3cc1cdc21b3e4f51a7569f0698703235))
* text truncate ([a2c9bb0](https://github.com/lemonadesocial/web-new/commit/a2c9bb0ce86e0039da4c678c59be298fa1d65f9c))
* ticket desc format ([38ffd87](https://github.com/lemonadesocial/web-new/commit/38ffd87cd7620f26567a6ba20bb2227d862f1820))
* ticket desc line breaking ([b712050](https://github.com/lemonadesocial/web-new/commit/b71205000071d3b44270542b5b12928c4cab7cb8))
* typos ([15fe6ea](https://github.com/lemonadesocial/web-new/commit/15fe6eae94f5a398914d568e62777607c697e01c))
* ui layout ([1ba5d48](https://github.com/lemonadesocial/web-new/commit/1ba5d481dd670adc6caa28ed311bc6cf923f4e43))
* update buttons action profile page ([a8e4899](https://github.com/lemonadesocial/web-new/commit/a8e489968feae8d149e55ace640a33a2e51ed6ca))
* update chain - update ui ([d8b6995](https://github.com/lemonadesocial/web-new/commit/d8b6995d26507e59ca687b8a6c1dacc27ad7efe5))
* update default set name ([24b36be](https://github.com/lemonadesocial/web-new/commit/24b36bec313af72c0b5d9eecc39f01c5d75e6bf4))
* update image cover create community ([b2c2c4f](https://github.com/lemonadesocial/web-new/commit/b2c2c4f6e120b858aedb13813cdead31c81f4486))
* update label ([befcf16](https://github.com/lemonadesocial/web-new/commit/befcf16514741a6df6353fe8530a802c801e1242))
* update settings data profile ([174a585](https://github.com/lemonadesocial/web-new/commit/174a58517f476a9a035c74513d14410b9d01d64f))
* upload loading state ([8697ab4](https://github.com/lemonadesocial/web-new/commit/8697ab4b2cf0e8e582865f302888db963b752316))
* user avatar on registraion ([14911f7](https://github.com/lemonadesocial/web-new/commit/14911f778b2e06d963220a4e67a081183fc312af))
* wrong condition ([4603fd9](https://github.com/lemonadesocial/web-new/commit/4603fd9a9cc482455433850ec477ffead2a75c35))
* wrong conflicts type ([24c80a7](https://github.com/lemonadesocial/web-new/commit/24c80a799f9b65f5d4c45bc1a8ea011c481da061))
* wrong event path ([3b65f90](https://github.com/lemonadesocial/web-new/commit/3b65f908b518d14bb1ae531007eeeb6b4aceb9bf))
* wrong image name ([e122d1a](https://github.com/lemonadesocial/web-new/commit/e122d1ae7c488cef2d509098ee599ef0e077ccaf))

## [3.1.0](https://github.com/lemonadesocial/web-new/compare/v3.0.0...v3.1.0) (2025-08-12)


### Features

* hide tabs ([c9dca71](https://github.com/lemonadesocial/web-new/commit/c9dca71d35dcb05c75c3121c0ddeac9dd8e508ce))
* update event visibility ([44d3dc6](https://github.com/lemonadesocial/web-new/commit/44d3dc6fc71043a2c2274a37a39e08fc43d6c65d))


### Bug Fixes

* active overview ([515d506](https://github.com/lemonadesocial/web-new/commit/515d506ccfbea1991de8e4086f1655b4ad3bd3b9))
* missing field - ui send blasts overview manage event ([c75f71e](https://github.com/lemonadesocial/web-new/commit/c75f71ed8ced0c75ee5111cb2d351aedc20c273c))

## [3.0.0](https://github.com/lemonadesocial/web-new/compare/v2.2.1...v3.0.0) (2025-08-11)


### ⚠ BREAKING CHANGES

* manage event

### Features

* add feedback - advanced send email ([aa9670a](https://github.com/lemonadesocial/web-new/commit/aa9670ae37f30c46af786cfd59b494d6834a4630))
* guests overview ([fb6e2cd](https://github.com/lemonadesocial/web-new/commit/fb6e2cda3aa1d15d6adf2a6546662aa5410aa335))
* implement blasts ([de9c587](https://github.com/lemonadesocial/web-new/commit/de9c587b11afe4414d0098adeb27fe28ae7255e2))
* manage event ([69f9865](https://github.com/lemonadesocial/web-new/commit/69f9865d2e1522a278906c955e39b04cb9b657a1))
* manage event ([29fe643](https://github.com/lemonadesocial/web-new/commit/29fe6431f38a55a086168f7370affd010110a5b6))
* missing value schedule datetime ([fe2416c](https://github.com/lemonadesocial/web-new/commit/fe2416cf567f86d2b3640e6c45d714453fd6b694))
* prevent dismiss modal ([cb5dac2](https://github.com/lemonadesocial/web-new/commit/cb5dac2c4e18f11bc30956bb29699a879c9d9197))
* remove blur toggle blasts input ([17d540c](https://github.com/lemonadesocial/web-new/commit/17d540cba76eda720f40f7077234a72999f34aff))
* ticket visibility ([8a2a1df](https://github.com/lemonadesocial/web-new/commit/8a2a1dff4509f90e5ff0d33dcdc8eb19be7cd3f3))
* update default blasts advance ([d4fee6f](https://github.com/lemonadesocial/web-new/commit/d4fee6fe34a251dad0be882fb6ddfe729e8bb006))
* update display schedule date blasts advanced ([847c2f5](https://github.com/lemonadesocial/web-new/commit/847c2f5a6705361287babbdb99c3df3be7a08509))
* update graphql ([ab8f751](https://github.com/lemonadesocial/web-new/commit/ab8f751184d0a8f19c54808dff3f95b16278f10c))
* update layout ([a0b4767](https://github.com/lemonadesocial/web-new/commit/a0b4767898ae220c8a23b5e4916cf1f2d7559017))
* update mbweb ([f927606](https://github.com/lemonadesocial/web-new/commit/f927606430115faf0c41ef816270197d17ca9655))
* update new api ([f3091d7](https://github.com/lemonadesocial/web-new/commit/f3091d77ca6de6cd6965ca50d3bda3d90f073cea))
* update send email - test email ([9f8301c](https://github.com/lemonadesocial/web-new/commit/9f8301cd225ac518ccb9b96043187fa3fe4c1197))
* update test ([64c18fd](https://github.com/lemonadesocial/web-new/commit/64c18fdd3bb59c38e241f747143a47c19801443d))


### Bug Fixes

* email suggestion ([f0ec964](https://github.com/lemonadesocial/web-new/commit/f0ec9646f36caca74b676e27fa5741bb5799d2a7))
* fix terms link ([2f6873d](https://github.com/lemonadesocial/web-new/commit/2f6873d96ba7a9be0d950b25594731e998013953))
* import ([5e3a98b](https://github.com/lemonadesocial/web-new/commit/5e3a98bc08820565851fa4b73f5394ea8826feeb))
* invite display name ([7544325](https://github.com/lemonadesocial/web-new/commit/7544325dd3d6d227e06f3898052c01302a6c5cdc))
* open check in ([c34e570](https://github.com/lemonadesocial/web-new/commit/c34e570bad893f51694bf7817e170bc0fafefd46))
* pending approval title ([dbe7b74](https://github.com/lemonadesocial/web-new/commit/dbe7b7400b9a72110303b96ba56b5ea9881348b0))
* user avatar on registraion ([14911f7](https://github.com/lemonadesocial/web-new/commit/14911f778b2e06d963220a4e67a081183fc312af))

## [2.2.1](https://github.com/lemonadesocial/web-new/compare/v2.2.0...v2.2.1) (2025-08-07)


### Bug Fixes

* update image cover create community ([b2c2c4f](https://github.com/lemonadesocial/web-new/commit/b2c2c4f6e120b858aedb13813cdead31c81f4486))

## [2.2.0](https://github.com/lemonadesocial/web-new/compare/v2.1.0...v2.2.0) (2025-08-06)


### Features

* check auth ([7dd9255](https://github.com/lemonadesocial/web-new/commit/7dd9255f7175efdfaa15a7aeb328ce2e4e18cf05))
* update message error ([4dbb018](https://github.com/lemonadesocial/web-new/commit/4dbb0182b54f3636756f190d8554a67a5336149f))
* update mweb ui ([04b40a4](https://github.com/lemonadesocial/web-new/commit/04b40a4a24c6f28de46d5a8549361c5efe194274))
* update ui ([9b5e2b2](https://github.com/lemonadesocial/web-new/commit/9b5e2b2ea34e97342815b76a82a55d9b22ed2629))

## [2.1.0](https://github.com/lemonadesocial/web-new/compare/v2.0.0...v2.1.0) (2025-08-05)


### Features

* add log ([51b7db0](https://github.com/lemonadesocial/web-new/commit/51b7db0cd3947b99224db818b2666154eddbbe9f))
* check can mint after connect wallet ([311d78d](https://github.com/lemonadesocial/web-new/commit/311d78d764bd7eb3314e48e3a4fc20b2e9d344a9))
* check mint process ([000c9e7](https://github.com/lemonadesocial/web-new/commit/000c9e7f9cbbc9766e002aa24afa823c4407e19f))
* checking post composer modal ([5107913](https://github.com/lemonadesocial/web-new/commit/5107913d71f93383fc58d1c38299e13f03a5b277))
* complete mweb post ([2c697da](https://github.com/lemonadesocial/web-new/commit/2c697da4187557722030536276c96f4dd0645290))
* handle link unicorn wallet ([b77613f](https://github.com/lemonadesocial/web-new/commit/b77613f2db8c80016ccb5bec9f8514300bcc40be))
* handle unicorn login with session ([b7efe50](https://github.com/lemonadesocial/web-new/commit/b7efe50e274d9b26a005be2a5daa9626a201cf5a))
* implement create community ([7608d59](https://github.com/lemonadesocial/web-new/commit/7608d59cfa3346cf76d7c3281bfe3c43089fcac1))
* improve modal ([affda30](https://github.com/lemonadesocial/web-new/commit/affda302667e0859b59ad1c776447f5f10af8f00))
* lint code ([a39a2ec](https://github.com/lemonadesocial/web-new/commit/a39a2ecea2d4bfdaf83518965575d3fdda392572))
* lint code ([9d0fb3a](https://github.com/lemonadesocial/web-new/commit/9d0fb3a010849bb0ecc96166a4f2e1ef1a26058e))
* missing connected but still cannot mint ([5e44dcd](https://github.com/lemonadesocial/web-new/commit/5e44dcd95bb9c3d01a483fc736fefbcff73f46a3))
* **nginx:** increase proxy buffer ([18397e7](https://github.com/lemonadesocial/web-new/commit/18397e74ce97e99403666810507e94853a456bc6))
* remove unused ([322e495](https://github.com/lemonadesocial/web-new/commit/322e495183e6dd0937328369173659731b795ed2))
* remove unused ([aba544b](https://github.com/lemonadesocial/web-new/commit/aba544b71af92e5cb729f9d267e69ef5533c18d8))
* update bot ([2824d8f](https://github.com/lemonadesocial/web-new/commit/2824d8f8d86046894c63509029ec346b11b64000))
* update image lemonheads link preview ([76543d9](https://github.com/lemonadesocial/web-new/commit/76543d9aa8e0c8b64939b234363bfa7681e2b2c2))
* update keyboard avoid modal ([18c448e](https://github.com/lemonadesocial/web-new/commit/18c448edd6a2387d7257ce643a0431ab3e8c273c))
* update router ([57db427](https://github.com/lemonadesocial/web-new/commit/57db427df72971450c6771c30a5e37bcf81334f9))
* update scroll height textarea ([9a26bbd](https://github.com/lemonadesocial/web-new/commit/9a26bbdf2d9ee1d1436cc0029ec6dc65a5dc1582))
* update share post lemonheads ([180eae8](https://github.com/lemonadesocial/web-new/commit/180eae89a00a3a176f97e6c04508ca9014e0367c))
* update wallet login password ([894e2fd](https://github.com/lemonadesocial/web-new/commit/894e2fd5b62cce4aff07cecb0d573955b530fc54))

## [2.0.0](https://github.com/lemonadesocial/web-new/compare/v1.64.1...v2.0.0) (2025-07-29)


### ⚠ BREAKING CHANGES

* update event visible cohosts fragments

### Features

* update event visible cohosts fragments ([d091cae](https://github.com/lemonadesocial/web-new/commit/d091cae34a61027d430c603f24c2a1dd094c34dd))

## [1.64.1](https://github.com/lemonadesocial/web-new/compare/v1.64.0...v1.64.1) (2025-07-24)


### Bug Fixes

* wrong event path ([3b65f90](https://github.com/lemonadesocial/web-new/commit/3b65f908b518d14bb1ae531007eeeb6b4aceb9bf))

## [1.64.0](https://github.com/lemonadesocial/web-new/compare/v1.63.4...v1.64.0) (2025-07-24)


### Features

* add intrusment layer ([bd94234](https://github.com/lemonadesocial/web-new/commit/bd94234500c0aeb2678ed279456a98ac3d5754d8))
* allow dismiss modal ([5a60416](https://github.com/lemonadesocial/web-new/commit/5a60416efb6cffc375bdb95b1535ef935240e041))
* break works on post modal ([ba07e7b](https://github.com/lemonadesocial/web-new/commit/ba07e7b3f9e03eb05858d291391343fe3ff61eef))
* cancel payment ([c56ba4c](https://github.com/lemonadesocial/web-new/commit/c56ba4ce0742efdb4d2e7e5e384a4aff3f607bfb))
* close modal after share post ([2eee8af](https://github.com/lemonadesocial/web-new/commit/2eee8afedda3045301b6a507400938d0cff2372c))
* complete share actions ([ed18d7b](https://github.com/lemonadesocial/web-new/commit/ed18d7bb46a486cb1c26e3a935eddafefbb85ffe))
* complete web view ([14e7f40](https://github.com/lemonadesocial/web-new/commit/14e7f40afeda309b88d700622a5017326f840704))
* determine nft output image format ([019f313](https://github.com/lemonadesocial/web-new/commit/019f3130c08f5aaebd97ff4dab8d3080883fccc9))
* extract metadata ([6ed38de](https://github.com/lemonadesocial/web-new/commit/6ed38de957ad3d545460f8159de8d0ea25191fd2))
* rm unused ([4fd23e0](https://github.com/lemonadesocial/web-new/commit/4fd23e0f44f2a0443bc407afcadea53b44b3785f))
* update data changed ([22bfb64](https://github.com/lemonadesocial/web-new/commit/22bfb645588469192c6ab779f599accae66dc6dc))
* update divider post composer ([30ce704](https://github.com/lemonadesocial/web-new/commit/30ce70431a6fc842f09a4a3a92e15ec04ee1b670))
* update filter background ([2d72537](https://github.com/lemonadesocial/web-new/commit/2d725379212249e1a5c781ed9c0280a96764e07b))
* update filter bag ([8de5c17](https://github.com/lemonadesocial/web-new/commit/8de5c179a4c87b867f85f42cd110eed90eb05fff))
* update link preview ([e5b9190](https://github.com/lemonadesocial/web-new/commit/e5b919099ba10782f9539460ba8e7cb12e7164b4))
* update link preview post content ([2f4ee5c](https://github.com/lemonadesocial/web-new/commit/2f4ee5c07da434eefed5ec68e1ac7a1b268f458e))
* update link-preview ([8bdcc91](https://github.com/lemonadesocial/web-new/commit/8bdcc912fbb3dc495ff3d47135c34f30a8636813))
* update metadata ([1deae6b](https://github.com/lemonadesocial/web-new/commit/1deae6b90f4cd7157856c32bd7d7cfff61558214))
* update mobile view ([ed2a2de](https://github.com/lemonadesocial/web-new/commit/ed2a2deb173091681cb8e1e5ec84eb621b1bb980))
* update modal mobile view ([54c9efd](https://github.com/lemonadesocial/web-new/commit/54c9efd1ff5a4bc2a89c403e14c4be73c74024cb))
* update modal style ([bb2e85b](https://github.com/lemonadesocial/web-new/commit/bb2e85b330642e4d2d27015e3f57c49b3e2f1d39))
* update new trait - bag, earings, tie ([7c0c19a](https://github.com/lemonadesocial/web-new/commit/7c0c19a890e709d0b478b41a4db09ef940f7de23))
* update sidebar ([db45e32](https://github.com/lemonadesocial/web-new/commit/db45e32a938ca83b58388f61e773a8c11d8787a5))
* update string utils ([401b78f](https://github.com/lemonadesocial/web-new/commit/401b78f8e61d936e5ea0df829b53798677c3708a))
* update styling modal ([0195b64](https://github.com/lemonadesocial/web-new/commit/0195b64ed1f1848f015b6fa23ae38a48ad192f59))


### Bug Fixes

* lint code ([faaf11b](https://github.com/lemonadesocial/web-new/commit/faaf11bddca6be0e63c06fc4e02899f511273fc8))
* mobile view - add delete button ([c75e061](https://github.com/lemonadesocial/web-new/commit/c75e06135a918eb555892be338baa2a9a62af12e))
* modal close function ([ba4bae5](https://github.com/lemonadesocial/web-new/commit/ba4bae50432fa2fc10940077707691eecb9f119d))
* tabs control home page ([489418f](https://github.com/lemonadesocial/web-new/commit/489418f82eb6e38a1627183f838bc167891d4699))
* wrong condition ([4603fd9](https://github.com/lemonadesocial/web-new/commit/4603fd9a9cc482455433850ec477ffead2a75c35))

## [1.63.4](https://github.com/lemonadesocial/web-new/compare/v1.63.3...v1.63.4) (2025-07-20)


### Bug Fixes

* hide menu on mweb ([6a10745](https://github.com/lemonadesocial/web-new/commit/6a10745d2073f4e76f1a6317b72c39aea18fb267))
* wrong image name ([e122d1a](https://github.com/lemonadesocial/web-new/commit/e122d1ae7c488cef2d509098ee599ef0e077ccaf))

## [1.63.3](https://github.com/lemonadesocial/web-new/compare/v1.63.2...v1.63.3) (2025-07-18)


### Bug Fixes

* remove divider desktop view ([4a29d55](https://github.com/lemonadesocial/web-new/commit/4a29d55b3bc9edc20eadef219d86ea85965a77ba))

## [1.63.2](https://github.com/lemonadesocial/web-new/compare/v1.63.1...v1.63.2) (2025-07-18)


### Bug Fixes

* fallback to address ([757b1d9](https://github.com/lemonadesocial/web-new/commit/757b1d9abf18b0aa3d606298abbdbc07ee12318c))

## [1.63.1](https://github.com/lemonadesocial/web-new/compare/v1.63.0...v1.63.1) (2025-07-17)


### Bug Fixes

* fallback to name ([2acf167](https://github.com/lemonadesocial/web-new/commit/2acf167df5d0aef7a4e4495c31641697feca49dc))

## [1.63.0](https://github.com/lemonadesocial/web-new/compare/v1.62.2...v1.63.0) (2025-07-17)


### Features

* check balance ([6c34587](https://github.com/lemonadesocial/web-new/commit/6c34587a45d9dbd16b4956c8fb0710cd2902591a))
* check mweb ([6a65bb7](https://github.com/lemonadesocial/web-new/commit/6a65bb7451123a21e6118e536fb97e537c644f74))
* completed mweb ([b0246dd](https://github.com/lemonadesocial/web-new/commit/b0246dd1c9cdb10a26829f1f0f4f91e06d8ef21c))
* fix style mweb ([8a98421](https://github.com/lemonadesocial/web-new/commit/8a984214ab55c2ccd57a612f171fd195cfa1fb96))
* format error message ([14c99d2](https://github.com/lemonadesocial/web-new/commit/14c99d2a6a9e80cf2f7f67f9249ed418067e4e4c))
* resolve loading height content ([1812f1e](https://github.com/lemonadesocial/web-new/commit/1812f1eae624b87c2b1dd34bd081b98ff81c2380))
* resolve small desktop view ([b2b4444](https://github.com/lemonadesocial/web-new/commit/b2b4444da485d7e706bf63b80f420999f9d2fd09))
* update color - preview mweb ([f4a915c](https://github.com/lemonadesocial/web-new/commit/f4a915c8f96e43bd8fc81505f2380d6daf9fa290))
* update error message ([7e962c9](https://github.com/lemonadesocial/web-new/commit/7e962c9aee297e608cba28028ede61df27064b98))
* update format message - list external space ([512a25d](https://github.com/lemonadesocial/web-new/commit/512a25d58288422570a5696f8e7226c575f2e1b7))
* update layout claim success ([c797121](https://github.com/lemonadesocial/web-new/commit/c79712195011f95e4c1ad9c6d9321cf002bc2a4d))
* update mobile view ([75b9104](https://github.com/lemonadesocial/web-new/commit/75b91040aa19e2e238c778f73c7519e12ba1b531))
* update reset action - handle mint state ([9aebc8a](https://github.com/lemonadesocial/web-new/commit/9aebc8a70793bac1a3839e77d34da8a5bced0d07))
* update style mobile color pick ([0b40864](https://github.com/lemonadesocial/web-new/commit/0b4086481e7675d2826d765371c6865a2140e738))


### Bug Fixes

* check mintPrice with sponsor ([bfdffeb](https://github.com/lemonadesocial/web-new/commit/bfdffebd9d6258707d2c86d5413a9ff710467a0a))
* increase rounded card ([1c63928](https://github.com/lemonadesocial/web-new/commit/1c63928dc81a0667bb1839f0da847de9c707021a))
* layout home content ([ac7e414](https://github.com/lemonadesocial/web-new/commit/ac7e41448504fe96e1abdda9e1988472ef923f34))
* lint code ([012e992](https://github.com/lemonadesocial/web-new/commit/012e992fe736eb862d40fa5da95af4f83dbc8f29))
* lint code ([c8318f7](https://github.com/lemonadesocial/web-new/commit/c8318f77abf9fcf64759b49b1eb033d65e60dcaf))
* remove testing ([5b4018a](https://github.com/lemonadesocial/web-new/commit/5b4018a06aad5e163ea8b26bdff4235fa60ddc6c))
* text ([7f811dd](https://github.com/lemonadesocial/web-new/commit/7f811ddd3cc1cdc21b3e4f51a7569f0698703235))
* update buttons action profile page ([a8e4899](https://github.com/lemonadesocial/web-new/commit/a8e489968feae8d149e55ace640a33a2e51ed6ca))
* wrong conflicts type ([24c80a7](https://github.com/lemonadesocial/web-new/commit/24c80a799f9b65f5d4c45bc1a8ea011c481da061))

## [1.62.2](https://github.com/lemonadesocial/web-new/compare/v1.62.1...v1.62.2) (2025-07-14)


### Bug Fixes

* follow status ([22e44a9](https://github.com/lemonadesocial/web-new/commit/22e44a9203d48d6b8c6184f72f1bb41b0c053baf))

## [1.62.1](https://github.com/lemonadesocial/web-new/compare/v1.62.0...v1.62.1) (2025-07-14)


### Bug Fixes

* hide posting for lemonheads ([a81a275](https://github.com/lemonadesocial/web-new/commit/a81a2755658f1d6b025907fdb5ca1fe25bfb72de))

## [1.62.0](https://github.com/lemonadesocial/web-new/compare/v1.61.3...v1.62.0) (2025-07-14)


### Features

* filter background style ([753d414](https://github.com/lemonadesocial/web-new/commit/753d414f33f773b30ffbfddf7d6135b11c573071))
* update alien color ([ae656d5](https://github.com/lemonadesocial/web-new/commit/ae656d513c470ea414b65b77722435b187c2f73e))
* update filter list ([ab2473c](https://github.com/lemonadesocial/web-new/commit/ab2473cc6534a098e73abaeb38da7e9b8de7d198))


### Bug Fixes

* format date with timezone ([e4e78e1](https://github.com/lemonadesocial/web-new/commit/e4e78e1919c3526fe279070a03b27ed3f07b9976))

## [1.61.3](https://github.com/lemonadesocial/web-new/compare/v1.61.2...v1.61.3) (2025-07-13)


### Bug Fixes

* sidebar divider ([34c4c5a](https://github.com/lemonadesocial/web-new/commit/34c4c5a61f1df0bb660f9a1533fc938c8f0ea4e9))

## [1.61.2](https://github.com/lemonadesocial/web-new/compare/v1.61.1...v1.61.2) (2025-07-12)


### Bug Fixes

* post content overflow ([cfceafe](https://github.com/lemonadesocial/web-new/commit/cfceafed4cfb646288619e673f6e3619c29f5a9f))

## [1.61.1](https://github.com/lemonadesocial/web-new/compare/v1.61.0...v1.61.1) (2025-07-11)


### Bug Fixes

* ticket desc format ([38ffd87](https://github.com/lemonadesocial/web-new/commit/38ffd87cd7620f26567a6ba20bb2227d862f1820))

## [1.61.0](https://github.com/lemonadesocial/web-new/compare/v1.60.0...v1.61.0) (2025-07-11)


### Features

* check payment state of event join requests ([da3cd2e](https://github.com/lemonadesocial/web-new/commit/da3cd2ea0ae8daed007419ff9f5663ab50d09cef))


### Bug Fixes

* stand url ([3e7ee1d](https://github.com/lemonadesocial/web-new/commit/3e7ee1daef981e4dc22ba1d2a1d7b7619bce9fd1))
* ticket desc line breaking ([b712050](https://github.com/lemonadesocial/web-new/commit/b71205000071d3b44270542b5b12928c4cab7cb8))

## [1.60.0](https://github.com/lemonadesocial/web-new/compare/v1.59.0...v1.60.0) (2025-07-11)


### Features

* hide lemonheads feature ([8cb0dba](https://github.com/lemonadesocial/web-new/commit/8cb0dbaee5d7f373f12b155a2edee23dfa0337c8))
* lens log out on signing out ([8b9abb1](https://github.com/lemonadesocial/web-new/commit/8b9abb186701e526c336fe33db90c1eeccd1693c))
* refactor lemonheads ([727981c](https://github.com/lemonadesocial/web-new/commit/727981c9d05670ca82bcd720afae8fbc550367e1))
* restructure feed ([16257f6](https://github.com/lemonadesocial/web-new/commit/16257f637b33fb57adc9a8ba11891276f549e1ba))
* stand card ([f5c8cd0](https://github.com/lemonadesocial/web-new/commit/f5c8cd03c27eea152b340437b8324f13107b74bb))
* **temp:** hide swipe ([d92ac3d](https://github.com/lemonadesocial/web-new/commit/d92ac3d35d907ec0a3c86d721e4294934cb8281e))
* ticket desc ([55a8c4d](https://github.com/lemonadesocial/web-new/commit/55a8c4da5514aceb6d9e4e06d9cb1da53fae6ede))
* upcoming events card ([64a1045](https://github.com/lemonadesocial/web-new/commit/64a1045f51bec28f915b632416e2ed2e5c8e478f))
* update loading state ([a26b5b2](https://github.com/lemonadesocial/web-new/commit/a26b5b2af43d5ab8999313d9b104e1c59afec834))
* update settings page ([52a9b27](https://github.com/lemonadesocial/web-new/commit/52a9b277bfae7299746ec974f6d990a4cabac840))


### Bug Fixes

* checking issue auth modal ([381d1b8](https://github.com/lemonadesocial/web-new/commit/381d1b8af1a06b04eddefe7860d65c1ecbaf6e45))
* dont show content when not login ([5c80285](https://github.com/lemonadesocial/web-new/commit/5c80285b3edd6f83b127ad28b833170a18c3be5b))
* duplicate check ([bee86c4](https://github.com/lemonadesocial/web-new/commit/bee86c43846e8fb0cd8085d12522767315d20392))
* filter background ([dcd5145](https://github.com/lemonadesocial/web-new/commit/dcd5145ddcb1181e8bdc8adebb73907d0ea40123))
* high image quality ([63562aa](https://github.com/lemonadesocial/web-new/commit/63562aa976a55e351dff26c31a5e25ebbe96076a))
* lint code ([504bd29](https://github.com/lemonadesocial/web-new/commit/504bd2967720f2a8674b50d051b94a7620cd371d))
* mobile view ([2e0f3c5](https://github.com/lemonadesocial/web-new/commit/2e0f3c5567948c4d352fadf002f52736e330f499))
* text truncate ([a2c9bb0](https://github.com/lemonadesocial/web-new/commit/a2c9bb0ce86e0039da4c678c59be298fa1d65f9c))
* update settings data profile ([174a585](https://github.com/lemonadesocial/web-new/commit/174a58517f476a9a035c74513d14410b9d01d64f))

## [1.59.0](https://github.com/lemonadesocial/web-new/compare/v1.58.0...v1.59.0) (2025-07-09)


### Features

* revert upgreade lens ([1d1652f](https://github.com/lemonadesocial/web-new/commit/1d1652f1890d64231a281326ff444593b87ff1c8))


### Bug Fixes

* claim username without wallet ([b455d5e](https://github.com/lemonadesocial/web-new/commit/b455d5e548f289fc69e491b9064c96ea70815632))
* lint ([90fbab0](https://github.com/lemonadesocial/web-new/commit/90fbab0dabb8a707210c7adec09c5b5c7000fb82))

## [1.58.0](https://github.com/lemonadesocial/web-new/compare/v1.57.1...v1.58.0) (2025-07-09)


### Features

* update error message ([270ee5d](https://github.com/lemonadesocial/web-new/commit/270ee5dba3f4e0f3b0512e07f14ffbb2afc17390))
* upgreade lens ([b90728a](https://github.com/lemonadesocial/web-new/commit/b90728af12682eeb9968c9976450e104c77a2056))

## [1.57.1](https://github.com/lemonadesocial/web-new/compare/v1.57.0...v1.57.1) (2025-07-08)


### Bug Fixes

* **login:** fix wallet login with lowercase ([398abb8](https://github.com/lemonadesocial/web-new/commit/398abb804d83ea110d8e1e2f2e67f438b20837ba))

## [1.57.0](https://github.com/lemonadesocial/web-new/compare/v1.56.1...v1.57.0) (2025-07-08)


### Features

* update header item ([03e2f16](https://github.com/lemonadesocial/web-new/commit/03e2f16ffe9c3577fe33e8d906528a8b73550cf5))

## [1.56.1](https://github.com/lemonadesocial/web-new/compare/v1.56.0...v1.56.1) (2025-07-07)


### Bug Fixes

* redeclare ([9512c25](https://github.com/lemonadesocial/web-new/commit/9512c25c69bc5a46541ea16dda1e2ca32065dc06))

## [1.56.0](https://github.com/lemonadesocial/web-new/compare/v1.55.0...v1.56.0) (2025-07-07)


### Features

* add switch account and disconnect ([9182f11](https://github.com/lemonadesocial/web-new/commit/9182f11cebdcdab0d25c72a1183793f2269afafb))
* feature family wallet ([e94e861](https://github.com/lemonadesocial/web-new/commit/e94e8619ee715429d2d0a4d0c4648f66d138ae85))

## [1.55.0](https://github.com/lemonadesocial/web-new/compare/v1.54.0...v1.55.0) (2025-07-07)


### Features

* add bottom bar ([a707c39](https://github.com/lemonadesocial/web-new/commit/a707c3955591c2267bac733a15319d8c68018807))
* add core logic & unit tests ([a716080](https://github.com/lemonadesocial/web-new/commit/a7160804d4f6b2d620e746509e51e527197683d5))
* add necklace ([0c4d3c3](https://github.com/lemonadesocial/web-new/commit/0c4d3c37f3d1a709967604ace44ec0ad908f4eb3))
* add token id ([7972ceb](https://github.com/lemonadesocial/web-new/commit/7972ceb84899c4236401c6392ea896880ba701c4))
* **auth:** implement unified login signup ([9d1c66d](https://github.com/lemonadesocial/web-new/commit/9d1c66de361bc3cdff2f174e0f94a29b41f8f582))
* call lemonheadnft contract ([fd271cb](https://github.com/lemonadesocial/web-new/commit/fd271cb18d3c06f7b9f73bed57b91bd3b41ad09c))
* change all tables to layers ([cb25175](https://github.com/lemonadesocial/web-new/commit/cb251751066731d51eef8cebfb26044331b7cd17))
* check if nft is minted ([b8bf55a](https://github.com/lemonadesocial/web-new/commit/b8bf55a317d72d084e18b95ca0dc1a35d4dc577b))
* check tx response ([a1fc92f](https://github.com/lemonadesocial/web-new/commit/a1fc92fa4c9fd794888a046a778315d07661d991))
* citizen check ([56c6628](https://github.com/lemonadesocial/web-new/commit/56c6628108889bc81cb972131adcf74096a07150))
* fallback name ([50626be](https://github.com/lemonadesocial/web-new/commit/50626be12ea6c3c12ef84adeadb9238a91602539))
* get default set ([d84d012](https://github.com/lemonadesocial/web-new/commit/d84d012a73fa0e1f989625152fb437dc2a0a3042))
* get token id ([7732cb8](https://github.com/lemonadesocial/web-new/commit/7732cb807ff31a68d41aac081afa591593cbc89b))
* handle email login / sign up ([8803b70](https://github.com/lemonadesocial/web-new/commit/8803b7001b2b6d562f32929342d562308de07b97))
* handle oidc ([1275b90](https://github.com/lemonadesocial/web-new/commit/1275b90d0811445bd2a3c379ef48c5906cdb0b5a))
* handle resend email code ([38ed2b8](https://github.com/lemonadesocial/web-new/commit/38ed2b87bb67f7d91a040b89e4bdf23ff3aece4b))
* hide who to follow on mobile ([d5b917c](https://github.com/lemonadesocial/web-new/commit/d5b917cd8ac0a16635c039469f5c75db37e504a3))
* home restructure ([bf9dc9a](https://github.com/lemonadesocial/web-new/commit/bf9dc9aefe4c521e93b37bab9570ec0c5268ad5c))
* implement image & metadata generation ([33661c9](https://github.com/lemonadesocial/web-new/commit/33661c96069967a559b9d22ff9e5c92f006dce92))
* implement share image ([fb54960](https://github.com/lemonadesocial/web-new/commit/fb5496055a64b47ebe6c0dfc00475a17696780c5))
* **lemonhead:** add custom validation for alien ([e500e9d](https://github.com/lemonadesocial/web-new/commit/e500e9d95d8356220c90336544be9ebeb9ff81bb))
* **lemonhead:** add layers and update table id ([926ed52](https://github.com/lemonadesocial/web-new/commit/926ed5223222ddbef0042246fa7d72f1bb42ca92))
* **lemonhead:** update NFT description ([ad9d64e](https://github.com/lemonadesocial/web-new/commit/ad9d64ec6ea827ace2e092119f9e92109939bb72))
* **lemonhead:** update output size and description ([ef4364c](https://github.com/lemonadesocial/web-new/commit/ef4364c9a645209228fdf8a8c7976c350dd4c0d5))
* lint ([ef17643](https://github.com/lemonadesocial/web-new/commit/ef176438011601711266f90e9fb2246249ac9b06))
* login sign up with wallet ([13ff297](https://github.com/lemonadesocial/web-new/commit/13ff297a9c364d03ef70b14be9962149a6a57d3d))
* mute video by default ([934e6ec](https://github.com/lemonadesocial/web-new/commit/934e6ecbc8dd8e5e19926947a852fdc8de0ff7db))
* new auth flow ([8c226cb](https://github.com/lemonadesocial/web-new/commit/8c226cb7a90e129de951ffe23d9116fc27bda440))
* optimize preselec ([f0ede4a](https://github.com/lemonadesocial/web-new/commit/f0ede4a8b01b164e6dbbce2c70ecd8949bb01a15))
* profile page ([f9d8225](https://github.com/lemonadesocial/web-new/commit/f9d82251d5794caa09ad5fee9ff24ae57906b633))
* remove contract env ([01bd3d6](https://github.com/lemonadesocial/web-new/commit/01bd3d6793b2a4f0017baa536f0e8b0d6f5040db))
* revert ([01f5f44](https://github.com/lemonadesocial/web-new/commit/01f5f4490950c56fa6abe09e323cd7fcbb781473))
* session check ([0c0e584](https://github.com/lemonadesocial/web-new/commit/0c0e584d1eedea9118753c3182e5f116f51e8157))
* testing display image ([023f88a](https://github.com/lemonadesocial/web-new/commit/023f88a91eeeae76bdd3becd2490ff3eca0e015a))
* unhance minting flow ([93fa75a](https://github.com/lemonadesocial/web-new/commit/93fa75abf3dd17ee840f34b6175d8fe31fae5537))
* update assets filtering ([c369762](https://github.com/lemonadesocial/web-new/commit/c369762dd9007caa7971fc3179e2d647fbf0ad00))
* update colorset ([912cc7d](https://github.com/lemonadesocial/web-new/commit/912cc7d3d734afb4ccf53130d69bf4bd88a8fd24))
* update core logic ([4765173](https://github.com/lemonadesocial/web-new/commit/47651734418db5d3bd40326a5e079708fc738a18))
* update env ([b55c445](https://github.com/lemonadesocial/web-new/commit/b55c445083da202744bbd199d15faf874f529645))
* update error ([48982a3](https://github.com/lemonadesocial/web-new/commit/48982a3af097a77c4eeb2fe5fc7ca93e114a4c76))
* update filter background ([532a08a](https://github.com/lemonadesocial/web-new/commit/532a08aeeb7648a2aed4ef8bbc7147002b5215bd))
* update filters/pets ([a31bd76](https://github.com/lemonadesocial/web-new/commit/a31bd7694e83b11e211ad272d753adba859fe61f))
* update get started screen ([549df54](https://github.com/lemonadesocial/web-new/commit/549df54bcb2faf97121e4e5f790479523b02fb67))
* update handle oidc ([b785c8c](https://github.com/lemonadesocial/web-new/commit/b785c8c48002601f386e8920e770b3e2153f1652))
* update instrument ([67f6688](https://github.com/lemonadesocial/web-new/commit/67f668822c8b499a014777251f038fe7e87c2f09))
* update layering logic ([599351c](https://github.com/lemonadesocial/web-new/commit/599351c63b3773dbb8b37889e21a32c08cd2ec94))
* update layout mobile ([984e63a](https://github.com/lemonadesocial/web-new/commit/984e63aa2511887fb19aee6dae8d44a55c24d1e9))
* update mint api ([6e6b4ff](https://github.com/lemonadesocial/web-new/commit/6e6b4ff280805f2a106fceebe3e25e92f3dd5032))
* update mint price ([54f0351](https://github.com/lemonadesocial/web-new/commit/54f035101ca6215ea47ee3731e56356f0ceba029))
* update mint state ui ([c730c38](https://github.com/lemonadesocial/web-new/commit/c730c38d474d204d8422c3aecc62c5b00462de9a))
* update mint success ui ([9ab9d03](https://github.com/lemonadesocial/web-new/commit/9ab9d036417f5c05758f6234ed482c3758790190))
* update modal flow ([0c1ab9d](https://github.com/lemonadesocial/web-new/commit/0c1ab9dffae8847bba09bad15e785e4215d890b9))
* update process modal ([c9f0fcc](https://github.com/lemonadesocial/web-new/commit/c9f0fccacc5b2112e05d9c159a367066fbc17da7))
* update swipe footer ([bfecec8](https://github.com/lemonadesocial/web-new/commit/bfecec8632cd9f55eb593e490405d90ceff9aa0a))
* update ui claim ([40dbbb5](https://github.com/lemonadesocial/web-new/commit/40dbbb5f693475580e139052de5eae2c6db828b2))
* update video control web ([f841410](https://github.com/lemonadesocial/web-new/commit/f841410fbf9e8857fbf33c38190189b6504baaa5))
* update video post mint ([b5a62f4](https://github.com/lemonadesocial/web-new/commit/b5a62f406120ef93e7c91dbeb58c46290e318aaf))
* update whoami session ([9fe9547](https://github.com/lemonadesocial/web-new/commit/9fe9547c9d8e6250a08661568a1320fc691a1213))
* who to follow ([a8b002a](https://github.com/lemonadesocial/web-new/commit/a8b002afb70ee517a188d717384a1f1c142b52df))


### Bug Fixes

* add loading - compile time too slow ([eeff659](https://github.com/lemonadesocial/web-new/commit/eeff6594012da8a7ce7543a0e9467075a5c8465f))
* add token id ([9444e8f](https://github.com/lemonadesocial/web-new/commit/9444e8fb0c26f9219950df75e2510a18ae82cb49))
* add transaction confirmation ([98837af](https://github.com/lemonadesocial/web-new/commit/98837afdc557854804c55098500359bb8ecaf681))
* build ([9280e84](https://github.com/lemonadesocial/web-new/commit/9280e846d6dc01ac886a3dbbc65a766d297cb1e8))
* caching filter ([3723240](https://github.com/lemonadesocial/web-new/commit/3723240f32f8029fdeef0e86a19de06af05e0482))
* check from node ([818cb51](https://github.com/lemonadesocial/web-new/commit/818cb51caa635e424411faee165be2f693e8a299))
* check mint before claim ([7b6d4db](https://github.com/lemonadesocial/web-new/commit/7b6d4dbfbb992d4963a3b5505b84b5d85cf4858f))
* check mint data ([b9c5b57](https://github.com/lemonadesocial/web-new/commit/b9c5b57ffd6450147943fafc116b7cab6d4413f0))
* check python build ([be33898](https://github.com/lemonadesocial/web-new/commit/be338981f6accea31f4a90d4346bcab6e3a679ec))
* checking build ([e8d3466](https://github.com/lemonadesocial/web-new/commit/e8d34664bfb88ea597cf4733c05ba07a9b7c2c4a))
* checking canvas lib ([91abb3a](https://github.com/lemonadesocial/web-new/commit/91abb3a24a7c9a5bc46ede017a02e217cd7cfe7f))
* checking view tnx ([bbc605f](https://github.com/lemonadesocial/web-new/commit/bbc605ff7e915a142befa92a10d12d552de81837))
* clean refetch ([95c7511](https://github.com/lemonadesocial/web-new/commit/95c75110e5ff388ae6e46f254630bbff7bfad447))
* display identity ([4c168f1](https://github.com/lemonadesocial/web-new/commit/4c168f1b676aaa013e58e3801c8f404268a4e836))
* duplicate filter ([09171f9](https://github.com/lemonadesocial/web-new/commit/09171f9aadf8427254d54d4ceafdcd487f558cf5))
* fallback account display ([ebc86f7](https://github.com/lemonadesocial/web-new/commit/ebc86f79f6da89e42124c93665fbf52f731521cf))
* fix small issues ([5cb81f1](https://github.com/lemonadesocial/web-new/commit/5cb81f1c8611a815908c2716bb122e6b724ee9cd))
* fix some render issue ([a94e767](https://github.com/lemonadesocial/web-new/commit/a94e767261680cebe0b7980fa8642be61c690edd))
* handle error ([55d376b](https://github.com/lemonadesocial/web-new/commit/55d376b756f936d28b24254420a6c539749e0137))
* ignore eyes,mouth,hair on alien ([9084066](https://github.com/lemonadesocial/web-new/commit/90840669fe9dbd4f36a5cec85a4b13bee6628000))
* **lemonhead:** add color filter to coresponding layers ([01563f5](https://github.com/lemonadesocial/web-new/commit/01563f54404e136050e6e1ab3d5a28e91d9459b8))
* **lemonhead:** fix alien validation ([afcf0be](https://github.com/lemonadesocial/web-new/commit/afcf0bec0e59043cdd260c5e23ae1e0c11aa49bf))
* **lemonhead:** fix calculation of final traits ([2d43a1d](https://github.com/lemonadesocial/web-new/commit/2d43a1d23552e18b2682543bf619bc2647f0c356))
* **lemonhead:** fix FE preview logic ([5267da0](https://github.com/lemonadesocial/web-new/commit/5267da0de9544fb0db1c5216e405a20e950b687c))
* **lemonhead:** fix formatString not to lowercase ([035b368](https://github.com/lemonadesocial/web-new/commit/035b368dd3aab0e303556abb3df67cf67cfb303e))
* **lemonhead:** fix missing cairo in final image ([d10ee26](https://github.com/lemonadesocial/web-new/commit/d10ee26774edf11bc783ca199ae27a4a8d61dd68))
* **lemonhead:** improve validation logic & look hash ([3cd4302](https://github.com/lemonadesocial/web-new/commit/3cd4302f07b04529abae179c7b10500179faf709))
* lint ([0e6c32f](https://github.com/lemonadesocial/web-new/commit/0e6c32f8ab4c6d67259a07024ef4e8189afd15fe))
* lint ([38743db](https://github.com/lemonadesocial/web-new/commit/38743db0ac9c3a482227ccc8cb2bbcb2ebe62337))
* lint code ([9db7732](https://github.com/lemonadesocial/web-new/commit/9db77327062d455cf08c41deabcce57d4720cf23))
* lint code ([b101ad2](https://github.com/lemonadesocial/web-new/commit/b101ad2ebc1f55a5c1f92d4c448ace7dfb552b07))
* loading image ([c8f5466](https://github.com/lemonadesocial/web-new/commit/c8f5466f1c4fd96db40b9542683f446babe71dd0))
* missed filter size on body ([00898c8](https://github.com/lemonadesocial/web-new/commit/00898c80544f7647a57bbf3aa9a867b483ebe1c9))
* missing color ([0550bf5](https://github.com/lemonadesocial/web-new/commit/0550bf505cc627abf8401b5f4cbc9a9538f2d858))
* missing default assets human ([c02c7a4](https://github.com/lemonadesocial/web-new/commit/c02c7a4935e7b1b5444882ab3879338f0baf10c4))
* missing env ([3318a63](https://github.com/lemonadesocial/web-new/commit/3318a639606d47f0e011ad184a0d54855772013d))
* missing field ([356938c](https://github.com/lemonadesocial/web-new/commit/356938cdd2eed6d01f0f566df687acb4ba5e0d31))
* missing filter background ([43d3d3c](https://github.com/lemonadesocial/web-new/commit/43d3d3c41afeaa217a9b38800989b3b4254e8fe3))
* missing form values claim steps ([5b9892a](https://github.com/lemonadesocial/web-new/commit/5b9892aebbc50f6d675d6761026bbf217c0d16c0))
* missing state preview select gender ([78ab2fb](https://github.com/lemonadesocial/web-new/commit/78ab2fb8dcd347821edca28ebf0f72de9a8d1aa5))
* missing transform ([b084281](https://github.com/lemonadesocial/web-new/commit/b0842815e7e9e0a28bbdae47c8e01fa6682d5c00))
* move check valid mint to claim button ([86df32c](https://github.com/lemonadesocial/web-new/commit/86df32cf4ff27622a3b2903fb4820f09f54ea34d))
* only for testing ([94e1531](https://github.com/lemonadesocial/web-new/commit/94e15316eaa09fe0c8c772b34b27d4fc89a56db2))
* optimize preselect image ([bf2ad6d](https://github.com/lemonadesocial/web-new/commit/bf2ad6d8d06dc48e1fc8b30208249bb9d30f8221))
* placeholder ([4771475](https://github.com/lemonadesocial/web-new/commit/4771475138403167c5b6509a10605f779bf57702))
* remove testing ([e2c3377](https://github.com/lemonadesocial/web-new/commit/e2c33771b1bd2e54c9185ebf6022d35cda0951d3))
* revert code ([bc01f2b](https://github.com/lemonadesocial/web-new/commit/bc01f2bd43338253ed6461cfd22ffb4a1bc4113e))
* select/deselect color ([42b2363](https://github.com/lemonadesocial/web-new/commit/42b236301d29952b9b18cadd4a77d4db85458e2e))
* should show back button when minted false ([e33d0de](https://github.com/lemonadesocial/web-new/commit/e33d0de5ccc760f8693de83b292df3443b888003))
* show who to follow when logged in ([364b2de](https://github.com/lemonadesocial/web-new/commit/364b2deab77150d476e625da56e7f19d2a2b9282))
* skip retry when fail ([d6e3210](https://github.com/lemonadesocial/web-new/commit/d6e321042417e8de79a540e7ab4743955df52a32))
* testing mint ([019c253](https://github.com/lemonadesocial/web-new/commit/019c253ae085088e83b68c9e1130276daf925eb2))
* update default set name ([24b36be](https://github.com/lemonadesocial/web-new/commit/24b36bec313af72c0b5d9eecc39f01c5d75e6bf4))
* upload loading state ([8697ab4](https://github.com/lemonadesocial/web-new/commit/8697ab4b2cf0e8e582865f302888db963b752316))

## [1.54.0](https://github.com/lemonadesocial/web-new/compare/v1.53.3...v1.54.0) (2025-06-27)


### Features

* update accout creation ([d702af0](https://github.com/lemonadesocial/web-new/commit/d702af0214f353f2a045d41e86a4a5fd5477a5cc))

## [1.53.3](https://github.com/lemonadesocial/web-new/compare/v1.53.2...v1.53.3) (2025-06-23)


### Bug Fixes

* wrong qr code ([0e2eea4](https://github.com/lemonadesocial/web-new/commit/0e2eea4a6558d51ae95aff351397aeee6178ec29))

## [1.53.2](https://github.com/lemonadesocial/web-new/compare/v1.53.1...v1.53.2) (2025-06-23)


### Bug Fixes

* typos ([0573a60](https://github.com/lemonadesocial/web-new/commit/0573a609a5b61490823a2cc3e94de8801b4562e9))
* update requests from session with lens account ([1a11f25](https://github.com/lemonadesocial/web-new/commit/1a11f2523f3a31e3207a50a91065173bc14707f5))
* wrong key ([22aab0b](https://github.com/lemonadesocial/web-new/commit/22aab0be5ca5702b1dde491bbdfa434881ac55ca))

## [1.53.1](https://github.com/lemonadesocial/web-new/compare/v1.53.0...v1.53.1) (2025-06-21)


### Bug Fixes

* missing picture when update profile ([87b1be3](https://github.com/lemonadesocial/web-new/commit/87b1be30db6a6d956f2a6e3250989bfb9e110129))

## [1.53.0](https://github.com/lemonadesocial/web-new/compare/v1.52.0...v1.53.0) (2025-06-21)


### Features

* sync photo from lens to lemonade ([4e09d65](https://github.com/lemonadesocial/web-new/commit/4e09d656ec125f86d2def3f9382d94d0b0b50384))


### Bug Fixes

* catch error ([45a11c4](https://github.com/lemonadesocial/web-new/commit/45a11c4d2746dc0f08513a90e415816193c8e0a3))
* remove unused ([33612ec](https://github.com/lemonadesocial/web-new/commit/33612ecfca1e2a22cc222003aed8f6abc66ee560))

## [1.52.0](https://github.com/lemonadesocial/web-new/compare/v1.51.1...v1.52.0) (2025-06-20)


### Features

* update ui after claim username ([c229bff](https://github.com/lemonadesocial/web-new/commit/c229bffb965316e8bff926d1ae58a4634581b5da))


### Bug Fixes

* missing picture ([96d9b84](https://github.com/lemonadesocial/web-new/commit/96d9b84543dce33f9a6d33527546fd6397c223a3))

## [1.51.1](https://github.com/lemonadesocial/web-new/compare/v1.51.0...v1.51.1) (2025-06-20)


### Bug Fixes

* update flow disconnect account/wallet ([d8b763b](https://github.com/lemonadesocial/web-new/commit/d8b763b321a1678e9e45c1a7ff2c90f6b881d290))

## [1.51.0](https://github.com/lemonadesocial/web-new/compare/v1.50.1...v1.51.0) (2025-06-20)


### Features

* call resume account lens on community/event ([91f8295](https://github.com/lemonadesocial/web-new/commit/91f8295b48883671d7e272cdcb0219cd643fb4ff))

## [1.50.1](https://github.com/lemonadesocial/web-new/compare/v1.50.0...v1.50.1) (2025-06-20)


### Bug Fixes

* update data profile top nav ([88cc302](https://github.com/lemonadesocial/web-new/commit/88cc3022f29ee4a437350bfb128f7bead3b1d3f4))

## [1.50.0](https://github.com/lemonadesocial/web-new/compare/v1.49.0...v1.50.0) (2025-06-20)


### Features

* add custom header ([3905d36](https://github.com/lemonadesocial/web-new/commit/3905d365bc9dad1e58e9cdf733f0ceeb92072594))
* format error message ([5306a93](https://github.com/lemonadesocial/web-new/commit/5306a93432649a889834eb0cb11462bffe569237))
* remove unused icon ([9e38532](https://github.com/lemonadesocial/web-new/commit/9e385323e36f93648fae51b8b3c6daabebeb65d6))
* update sync data ([417c8ab](https://github.com/lemonadesocial/web-new/commit/417c8abf362de4dd34e14fdaedd7453895f59036))


### Bug Fixes

* missing confirm upload ([4053100](https://github.com/lemonadesocial/web-new/commit/40531005ac0428f88948416e43492c40ac7b6660))
* missing display_name ([e37dc80](https://github.com/lemonadesocial/web-new/commit/e37dc803d47fb3e3dd7721bf1b21bb0c8cf6d5f1))
* polish edit profile ([8696e29](https://github.com/lemonadesocial/web-new/commit/8696e29f4a6b7eb22139e9ca7827d1e4e2f182d8))
* revert code ([d77a05c](https://github.com/lemonadesocial/web-new/commit/d77a05cdb9629210c59e624bde03a8a5b0e96477))
* revert test file ([625e9f8](https://github.com/lemonadesocial/web-new/commit/625e9f86ff997177d89779f81d7488fc1885f6e3))
* use lemonade avatar by default ([46878c6](https://github.com/lemonadesocial/web-new/commit/46878c647b8579b3ccab58168fbcd6392c9a481c))

## [1.49.0](https://github.com/lemonadesocial/web-new/compare/v1.48.0...v1.49.0) (2025-06-19)


### Features

* render text with links ([2870920](https://github.com/lemonadesocial/web-new/commit/2870920c4dbdc77e00c7ba4b7b70a3662944b833))

## [1.48.0](https://github.com/lemonadesocial/web-new/compare/v1.47.1...v1.48.0) (2025-06-18)


### Features

* refetch lemonade username ([2ec0a36](https://github.com/lemonadesocial/web-new/commit/2ec0a36bb93a034149129affdb19ddc6f985094e))

## [1.47.1](https://github.com/lemonadesocial/web-new/compare/v1.47.0...v1.47.1) (2025-06-17)


### Bug Fixes

* env ([de599bd](https://github.com/lemonadesocial/web-new/commit/de599bd47d5ee76b7b8d6c2c71871b1c4f069647))

## [1.47.0](https://github.com/lemonadesocial/web-new/compare/v1.46.7...v1.47.0) (2025-06-17)


### Features

* update account card ([ca723f6](https://github.com/lemonadesocial/web-new/commit/ca723f624aaae779022798152a0dd332331ca29d))
* update lens signer ([a7900f6](https://github.com/lemonadesocial/web-new/commit/a7900f6c22ac9d7cfc530d69eeeb92a4ec5de67f))

## [1.46.7](https://github.com/lemonadesocial/web-new/compare/v1.46.6...v1.46.7) (2025-06-17)


### Bug Fixes

* content can null ([291b21f](https://github.com/lemonadesocial/web-new/commit/291b21f44d375ae852ef0833b97b0f6f7cd26f19))

## [1.46.6](https://github.com/lemonadesocial/web-new/compare/v1.46.5...v1.46.6) (2025-06-17)


### Bug Fixes

* valid url - add prefix ([a00e55f](https://github.com/lemonadesocial/web-new/commit/a00e55f677758421f9ef281a9d04008610071b78))

## [1.46.5](https://github.com/lemonadesocial/web-new/compare/v1.46.4...v1.46.5) (2025-06-17)


### Bug Fixes

* post button ([02b087a](https://github.com/lemonadesocial/web-new/commit/02b087aa614244c953bba415c969076f7125afe9))

## [1.46.4](https://github.com/lemonadesocial/web-new/compare/v1.46.3...v1.46.4) (2025-06-17)


### Bug Fixes

* remove __typename on address ([d15667e](https://github.com/lemonadesocial/web-new/commit/d15667e13556e46d97e0a760bfb5339ecd3cdc67))

## [1.46.3](https://github.com/lemonadesocial/web-new/compare/v1.46.2...v1.46.3) (2025-06-16)


### Bug Fixes

* remove unused ([c9884da](https://github.com/lemonadesocial/web-new/commit/c9884da910c84b766debe8ce37eca36f1360563c))

## [1.46.2](https://github.com/lemonadesocial/web-new/compare/v1.46.1...v1.46.2) (2025-06-16)


### Bug Fixes

* missing namespace ([e5c2b7e](https://github.com/lemonadesocial/web-new/commit/e5c2b7e7a5d31febb4c81e6ebf60e430bddfb3bc))

## [1.46.1](https://github.com/lemonadesocial/web-new/compare/v1.46.0...v1.46.1) (2025-06-16)


### Bug Fixes

* correct createUsername ([f7efddb](https://github.com/lemonadesocial/web-new/commit/f7efddbdfba01eaaa222d71f94d1d6f56c1d1a97))

## [1.46.0](https://github.com/lemonadesocial/web-new/compare/v1.45.0...v1.46.0) (2025-06-16)


### Features

* update username flow for existing lens users ([3d9675c](https://github.com/lemonadesocial/web-new/commit/3d9675ccb776352ffdb16ad786c42a9853b31506))

## [1.45.0](https://github.com/lemonadesocial/web-new/compare/v1.44.0...v1.45.0) (2025-06-15)


### Features

* accept cohost ([938d530](https://github.com/lemonadesocial/web-new/commit/938d530f853e85c4d7ac7d969fb45bce613e985c))
* highlight post link ([98abe4c](https://github.com/lemonadesocial/web-new/commit/98abe4c609ca1f26cfa000fb0ef666f77383beae))
* update post action buttons ([15ea20c](https://github.com/lemonadesocial/web-new/commit/15ea20c41e1bc2b07d43a3bbb35c469711d1b40f))

## [1.44.0](https://github.com/lemonadesocial/web-new/compare/v1.43.4...v1.44.0) (2025-06-13)


### Features

* add verify email button ([b82947a](https://github.com/lemonadesocial/web-new/commit/b82947af37a83210da8376b15363e506d7ec205a))

## [1.43.4](https://github.com/lemonadesocial/web-new/compare/v1.43.3...v1.43.4) (2025-06-13)


### Bug Fixes

* claim username flow ([940c653](https://github.com/lemonadesocial/web-new/commit/940c653dc7095a70273a0fbd7cd5d6b9a3098f6b))

## [1.43.3](https://github.com/lemonadesocial/web-new/compare/v1.43.2...v1.43.3) (2025-06-13)


### Bug Fixes

* event time status ([18b8fb8](https://github.com/lemonadesocial/web-new/commit/18b8fb8e4c5465bbeb15944e806f07d47a06d0d2))

## [1.43.2](https://github.com/lemonadesocial/web-new/compare/v1.43.1...v1.43.2) (2025-06-13)


### Bug Fixes

* event null ([094ab20](https://github.com/lemonadesocial/web-new/commit/094ab206a008a2d9d25d3f8bb5f08f033f9a5619))
* lint ([352ecca](https://github.com/lemonadesocial/web-new/commit/352ecca44120f15632f2dd618432987edddc3307))

## [1.43.1](https://github.com/lemonadesocial/web-new/compare/v1.43.0...v1.43.1) (2025-06-13)


### Bug Fixes

* cohosts display ([2ddee63](https://github.com/lemonadesocial/web-new/commit/2ddee63692083096eabd467cf30727e6ccb852fc))

## [1.43.0](https://github.com/lemonadesocial/web-new/compare/v1.42.0...v1.43.0) (2025-06-12)


### Features

* update claim username flow ([0bf92cf](https://github.com/lemonadesocial/web-new/commit/0bf92cf2494ce0380cf92960ab0a663b92da61d8))

## [1.42.0](https://github.com/lemonadesocial/web-new/compare/v1.41.1...v1.42.0) (2025-06-12)


### Features

* update event bg image ([d326166](https://github.com/lemonadesocial/web-new/commit/d326166cb04c1e6da5c1612af595a1a379514be9))

## [1.41.1](https://github.com/lemonadesocial/web-new/compare/v1.41.0...v1.41.1) (2025-06-12)


### Bug Fixes

* missing assets ([855a2a4](https://github.com/lemonadesocial/web-new/commit/855a2a4010fb08e01130ea73e64626d3c648a3a1))

## [1.41.0](https://github.com/lemonadesocial/web-new/compare/v1.40.0...v1.41.0) (2025-06-12)


### Features

* fix blur - empty cover image ([f12fbf5](https://github.com/lemonadesocial/web-new/commit/f12fbf5d2325997f8baaffd6f2ca9c8974663057))
* merge image theme ([a732afd](https://github.com/lemonadesocial/web-new/commit/a732afd504958b4a547393be62aa45d9c2671a91))
* missing loading image background ([c565d31](https://github.com/lemonadesocial/web-new/commit/c565d318017271954978260b935125c27a00c2b4))
* update image size and dark/light mode ([352e7bb](https://github.com/lemonadesocial/web-new/commit/352e7bbd2fa0828d0c9e1333711765abac6ad80c))


### Bug Fixes

* cover bg image ([9923617](https://github.com/lemonadesocial/web-new/commit/99236174bfedd2ab14a5582c69d1ac1b12c73ca1))
* loading state ([fdeae09](https://github.com/lemonadesocial/web-new/commit/fdeae099e8e92340def4e588024c08ddebaf350f))
* missing check undefined theme ([f6cd79f](https://github.com/lemonadesocial/web-new/commit/f6cd79f47102f7e5440bcfc1f238b7d83740b382))

## [1.40.0](https://github.com/lemonadesocial/web-new/compare/v1.39.0...v1.40.0) (2025-06-12)


### Features

* infinite scoll feed ([07d8d75](https://github.com/lemonadesocial/web-new/commit/07d8d75f56a9b40a834a85bd72c8cfc3fd4a09e7))


### Bug Fixes

* starts in time ([1ae9bcc](https://github.com/lemonadesocial/web-new/commit/1ae9bcc32f7a2802ff34ce5320dbc06f70f9ce3c))

## [1.39.0](https://github.com/lemonadesocial/web-new/compare/v1.38.7...v1.39.0) (2025-06-11)


### Features

* refactor routes ([411db7d](https://github.com/lemonadesocial/web-new/commit/411db7d7161cf538434dee5b3026b2d16b8c98d3))


### Bug Fixes

* check authentication on communities page ([06d2ece](https://github.com/lemonadesocial/web-new/commit/06d2ece904315056c6fe6da3b33c3e32bfc8a482))
* open user post ([075feea](https://github.com/lemonadesocial/web-new/commit/075feea577fe9095e85a460691310c4ada22d2bc))

## [1.38.7](https://github.com/lemonadesocial/web-new/compare/v1.38.6...v1.38.7) (2025-06-11)


### Bug Fixes

* loading skeleton card ([7fc368e](https://github.com/lemonadesocial/web-new/commit/7fc368ec30dd2a0bd233a2fef10f0967b140a3f0))
* theme caching ([7bbfc0b](https://github.com/lemonadesocial/web-new/commit/7bbfc0b0195644d673069e402513fb57eabc7983))

## [1.38.6](https://github.com/lemonadesocial/web-new/compare/v1.38.5...v1.38.6) (2025-06-11)


### Bug Fixes

* missing on mobile view ([5c48566](https://github.com/lemonadesocial/web-new/commit/5c48566e5f7b12a5aa5a09c69aea5f2549d21fd6))

## [1.38.5](https://github.com/lemonadesocial/web-new/compare/v1.38.4...v1.38.5) (2025-06-11)


### Bug Fixes

* reduce image size ([1e29a3a](https://github.com/lemonadesocial/web-new/commit/1e29a3a8df0d4ac662ded9f1c97dcb42d1e3384a))

## [1.38.4](https://github.com/lemonadesocial/web-new/compare/v1.38.3...v1.38.4) (2025-06-11)


### Bug Fixes

* fallback sharing link ([0509783](https://github.com/lemonadesocial/web-new/commit/0509783f5bb07f2cb58de0be55a4ecb50f0f4f8c))
* smart work break ([2ad3400](https://github.com/lemonadesocial/web-new/commit/2ad34008305be1308bca514db460b2eadec2bb96))

## [1.38.3](https://github.com/lemonadesocial/web-new/compare/v1.38.2...v1.38.3) (2025-06-11)


### Bug Fixes

* account stats ([e2fc48a](https://github.com/lemonadesocial/web-new/commit/e2fc48ad726298a847eed78c07b2d2856c09783e))

## [1.38.2](https://github.com/lemonadesocial/web-new/compare/v1.38.1...v1.38.2) (2025-06-10)


### Bug Fixes

* registration modal overflow ([95650e4](https://github.com/lemonadesocial/web-new/commit/95650e4391971a2358f7ae252a52bda8a128faf1))
* update vote status ([3195092](https://github.com/lemonadesocial/web-new/commit/3195092005cd9aac4037d51930c2f680535aaca1))

## [1.38.1](https://github.com/lemonadesocial/web-new/compare/v1.38.0...v1.38.1) (2025-06-10)


### Bug Fixes

* logic fetch events ([46b967e](https://github.com/lemonadesocial/web-new/commit/46b967ea2629564a0c5d6cc2fc54b37629c9b72e))

## [1.38.0](https://github.com/lemonadesocial/web-new/compare/v1.37.3...v1.38.0) (2025-06-10)


### Features

* update post menu ([bc9c80d](https://github.com/lemonadesocial/web-new/commit/bc9c80d117f1f49c7308cfbe0eff41eb84ceb985))

## [1.37.3](https://github.com/lemonadesocial/web-new/compare/v1.37.2...v1.37.3) (2025-06-09)


### Bug Fixes

* update display rules ([9cf26da](https://github.com/lemonadesocial/web-new/commit/9cf26da0fd00db32e44099553fa463241f9d282b))

## [1.37.2](https://github.com/lemonadesocial/web-new/compare/v1.37.1...v1.37.2) (2025-06-09)


### Bug Fixes

* remmove duplicated onboarding user ([1cbef8d](https://github.com/lemonadesocial/web-new/commit/1cbef8d03404e2c00315c69b9a859ad050e3b531))

## [1.37.1](https://github.com/lemonadesocial/web-new/compare/v1.37.0...v1.37.1) (2025-06-09)


### Bug Fixes

* onboarding user ([b42d86a](https://github.com/lemonadesocial/web-new/commit/b42d86adccb05914373d935e11d8f524b406087c))

## [1.37.0](https://github.com/lemonadesocial/web-new/compare/v1.36.0...v1.37.0) (2025-06-09)


### Features

* lens namespace ([ca0c053](https://github.com/lemonadesocial/web-new/commit/ca0c05345d2ca5bd0c288d6688d1a3d3d42d69d9))

## [1.36.0](https://github.com/lemonadesocial/web-new/compare/v1.35.1...v1.36.0) (2025-06-06)


### Features

* add asset prefix ([a80b6f6](https://github.com/lemonadesocial/web-new/commit/a80b6f6996179d615033a3bd627b3f17c9070b5e))
* add attendees section ([4f8af81](https://github.com/lemonadesocial/web-new/commit/4f8af81f628070ed069b1cf3e0688aa65441ddd4))
* add bunny - beer pong effect ([377ccbe](https://github.com/lemonadesocial/web-new/commit/377ccbee4880f3ced9b827cc9b11242981433f2b))
* add comment ([95537e0](https://github.com/lemonadesocial/web-new/commit/95537e072e2928e4516d3bc6cc3e3f6b7c8f42af))
* add default avatar ([eab71bd](https://github.com/lemonadesocial/web-new/commit/eab71bd9831aa19c8522b42a1c5e32b6a5823f64))
* add doc ([87da503](https://github.com/lemonadesocial/web-new/commit/87da5035c1d5568a8437f1edd7f0357a35335e14))
* add effect on top of other theme ([c6e1524](https://github.com/lemonadesocial/web-new/commit/c6e152409ab473a53d443cabe9409a121fed9e08))
* add emoji effect event theme ([6279993](https://github.com/lemonadesocial/web-new/commit/6279993aec5a72ad6ad8330a074a7db275168f85))
* add event builder component ([b5e1643](https://github.com/lemonadesocial/web-new/commit/b5e1643bce7a9f21c02049f1ee7041096c2c826c))
* add event route for proxy ([288d2a0](https://github.com/lemonadesocial/web-new/commit/288d2a0cdfc63377696f47f59739e66858375c50))
* add external url ([f2b35a4](https://github.com/lemonadesocial/web-new/commit/f2b35a41086ec1f1f42073bb81a00a154889cd3c))
* add external_url field ([8a6327c](https://github.com/lemonadesocial/web-new/commit/8a6327cb7fb967e05d3cc8cd3852e507e275c19d))
* add shader styles ([8ce7e4a](https://github.com/lemonadesocial/web-new/commit/8ce7e4aa70d398ff4a1a88bfca24d47860f82883))
* add starts in ([d3b8637](https://github.com/lemonadesocial/web-new/commit/d3b8637f1b1065068156cdb5a21d3576e0483b90))
* add to calendar ([3426057](https://github.com/lemonadesocial/web-new/commit/34260574fc7b9b4926d6a759bf665c525339193b))
* adjust font size ([1e62ad0](https://github.com/lemonadesocial/web-new/commit/1e62ad0826299ef4a406bc3d0e8be38d277be16f))
* attach event ([386ae96](https://github.com/lemonadesocial/web-new/commit/386ae9631b401c17d22e68dbe2329da5abccec75))
* check allow domain can access path ([4191897](https://github.com/lemonadesocial/web-new/commit/419189729539dc42e1ddce022684a1d8bb080733))
* check can select color pick ([18766e0](https://github.com/lemonadesocial/web-new/commit/18766e0243cf8777241618b8e541f399f60756ac))
* check lens auth ([379dcb6](https://github.com/lemonadesocial/web-new/commit/379dcb6038e0a78037750abeb5bceaa1fe43f5ee))
* check native token ([1e7233e](https://github.com/lemonadesocial/web-new/commit/1e7233e16df68c0b356c82a9448459c670b5d6e6))
* check static path ([ca7c353](https://github.com/lemonadesocial/web-new/commit/ca7c3536a8279c6f1e711c619cf1b6e7de9c1144))
* checking pass proxy ([5692a0e](https://github.com/lemonadesocial/web-new/commit/5692a0e4c515d9499f2b2d8359658ba8ff119ebb))
* checking static build ([fe60930](https://github.com/lemonadesocial/web-new/commit/fe609304082894d67aac8b8651806f3df4bc059c))
* checking static path ([3d74700](https://github.com/lemonadesocial/web-new/commit/3d747009b110f2cae5dbe961bc5bf26df7deaa3a))
* claim username ([4af525e](https://github.com/lemonadesocial/web-new/commit/4af525eb71d9cb8f1fa144bef698ab6a0e3a6e6f))
* community mobile nav ([73d921a](https://github.com/lemonadesocial/web-new/commit/73d921aff7c6ca019190f0e6e64a81698434eb8a))
* complete event theme ([6e8569a](https://github.com/lemonadesocial/web-new/commit/6e8569a5131f43b905042cfd5866e171c66a7a2f))
* completed location ([326433c](https://github.com/lemonadesocial/web-new/commit/326433cf58c58b3d417d5144e9c629159ddb0b4d))
* completed logic link to store ([f8b5fd8](https://github.com/lemonadesocial/web-new/commit/f8b5fd880e8c191c0fc0b4ca29914770913a6aef))
* completed ui web ([8cfe168](https://github.com/lemonadesocial/web-new/commit/8cfe168237c35bb527d698042813ed1876b80c9c))
* disable map gesture ([ceda157](https://github.com/lemonadesocial/web-new/commit/ceda157ca5e6c3717c1d366577e5d1f7d1305809))
* edit profile menu item ([9cfb233](https://github.com/lemonadesocial/web-new/commit/9cfb2331e5921ce3bb750579f60d0a5f0fa6d986))
* empty posts ([f81570f](https://github.com/lemonadesocial/web-new/commit/f81570fa35f880ca9bfd612bbfdfe203494750df))
* event collectible ([94b4535](https://github.com/lemonadesocial/web-new/commit/94b45358d2760fc487a0def93558827dc2470901))
* event og ([faa6313](https://github.com/lemonadesocial/web-new/commit/faa63137ea2ab5a5dc781f9b4a8197d9b9261882))
* event status ([e7691bf](https://github.com/lemonadesocial/web-new/commit/e7691bf5f6edb427d386e12c2acbf0ba8b85a13a))
* event terms check ([db57c6f](https://github.com/lemonadesocial/web-new/commit/db57c6f0a7ba8e8d150172ed22f9839b5bb6fa43))
* feeds view mobile ([b2a4abb](https://github.com/lemonadesocial/web-new/commit/b2a4abbaa042c6b1c95968d8ee6a14b2c524eb02))
* graphql subscription ([eadce29](https://github.com/lemonadesocial/web-new/commit/eadce293b66a97e863f7d82f3a9004d16e7c751d))
* host view of event guest ([20228c3](https://github.com/lemonadesocial/web-new/commit/20228c3ebfb39fae6b2fe1e6eaa80350d3c5f6c0))
* implement create external event ([d9755ae](https://github.com/lemonadesocial/web-new/commit/d9755aeab7a2b2cad232a7cab182fe712ff21110))
* implement lens post fullscreen ([820a953](https://github.com/lemonadesocial/web-new/commit/820a9538a6fe62c1c84cf94da737a725b298b74c))
* invite friends ([050e29b](https://github.com/lemonadesocial/web-new/commit/050e29b52c85a6527a8f92ca27701022ba6de6d0))
* lens feed ([2913d6c](https://github.com/lemonadesocial/web-new/commit/2913d6c170f6307579a4fc83afbcbbbad1931064))
* lens profile page ([c910fe6](https://github.com/lemonadesocial/web-new/commit/c910fe65244f1966089e58c6e8b1a7eb1d3b7dbe))
* **lens:** select profile ([447ff06](https://github.com/lemonadesocial/web-new/commit/447ff06c551ddab58bceb77fdc4559147645ab2b))
* my ticket ([266a5d4](https://github.com/lemonadesocial/web-new/commit/266a5d44ae5028496dd06693f331cfcfb4068e9f))
* **nginx:** proxy Sendgrid open & click tracking ([88d1a92](https://github.com/lemonadesocial/web-new/commit/88d1a922e2ebd02a4f2b3205f29ed85f7a733103))
* oauth2 ([ffe967b](https://github.com/lemonadesocial/web-new/commit/ffe967b978a1d092479bf4255860c533cbf0372d))
* polish event details ([2832ca6](https://github.com/lemonadesocial/web-new/commit/2832ca6bc9cedb86abe27f169d248a3bd752e051))
* polish event details ([9d8f594](https://github.com/lemonadesocial/web-new/commit/9d8f594d847bb7692684c9ef1c61b594f0f3f8e0))
* post actions placeholder ([87ec5d0](https://github.com/lemonadesocial/web-new/commit/87ec5d08d12d7bed652972f5443d26fa34617341))
* post comments ([3e75656](https://github.com/lemonadesocial/web-new/commit/3e75656a2acbab6705db6cd9384ae377da4b192c))
* post reactions ([9e5db23](https://github.com/lemonadesocial/web-new/commit/9e5db239b5e23ab14f556081bca2e348158c819b))
* refactor community them builder ([d2e8a15](https://github.com/lemonadesocial/web-new/commit/d2e8a15612fd535dd0d92945ce4a2f6daf6aaf4c))
* refactor pattern theming ([697e478](https://github.com/lemonadesocial/web-new/commit/697e478c89582c78dda196a4ab43c7bb94f5e620))
* rename env ([eb485bb](https://github.com/lemonadesocial/web-new/commit/eb485bbe4d2049a954c7b0897fba1075d5e1f268))
* restructure ([6c0ae51](https://github.com/lemonadesocial/web-new/commit/6c0ae51eb260eef6ee2ad2a8b8a6e6973f35a832))
* staking ([cc282f7](https://github.com/lemonadesocial/web-new/commit/cc282f78f2f7c1d704a806c2905c308208fb2c99))
* **temp:** hide comments ([238c6ae](https://github.com/lemonadesocial/web-new/commit/238c6ae6687cbbbad31cc6a5102ccc0d8abd2e4a))
* update accordion component ([9cc493a](https://github.com/lemonadesocial/web-new/commit/9cc493a8dd0be25acdef4971911c0b78c116b176))
* update color based on dark or light ([7c4d540](https://github.com/lemonadesocial/web-new/commit/7c4d540eca0c4ae1f266290bc184494603324924))
* update comment count ([db82158](https://github.com/lemonadesocial/web-new/commit/db821582bf8c60eaf00c71cfb5c423369a69fb78))
* update comment post detail ([fea14d6](https://github.com/lemonadesocial/web-new/commit/fea14d6f0bb19c1495dff686aa89ac06a41060e2))
* update default color for event builder ([1ca40bf](https://github.com/lemonadesocial/web-new/commit/1ca40bf1191a449a06a959a4d2003948fd9dd10b))
* update env ([0632ce1](https://github.com/lemonadesocial/web-new/commit/0632ce107208376ed69466460ce12f2b9182f1a9))
* update gradient theming ([af6ca90](https://github.com/lemonadesocial/web-new/commit/af6ca9083315e6ad74fc86bb4b2e4914198511e4))
* update layout for community ([1368b9e](https://github.com/lemonadesocial/web-new/commit/1368b9e35c9fa9f2557cfd4c4a9d6096e67aaf1a))
* update LenProfileCard ([98606dc](https://github.com/lemonadesocial/web-new/commit/98606dcab7f67285301670740b8dcb34921e3a96))
* update lens profile link ([880a453](https://github.com/lemonadesocial/web-new/commit/880a453a7a00b01ca3418610d2c21fc7470efb2d))
* update logic external event link on list event ([27aaf8a](https://github.com/lemonadesocial/web-new/commit/27aaf8a0ae575020e1c77f33947b4063efb761b8))
* update main options ([94a6bdd](https://github.com/lemonadesocial/web-new/commit/94a6bdd63aadfb0b15a76af6d9e975a61f8cb0b8))
* update my event requests ([4e24951](https://github.com/lemonadesocial/web-new/commit/4e2495155d135df7a717e09e0016db835c0696cf))
* update open external event ([9a3b6e5](https://github.com/lemonadesocial/web-new/commit/9a3b6e5b3fde4a0ae088ca77992a3a9a2973e69b))
* update post state ([cd97f7b](https://github.com/lemonadesocial/web-new/commit/cd97f7ba76654d2638da54a9c80e91e390c987bc))
* update render community description ([eeba83c](https://github.com/lemonadesocial/web-new/commit/eeba83cd458e4173601a731cd4cb2894d260340f))
* update render link ([08f0a60](https://github.com/lemonadesocial/web-new/commit/08f0a606c141ce07b6c1577e178b67c289d22a07))
* update router ([54b4a9d](https://github.com/lemonadesocial/web-new/commit/54b4a9d35a24186b4978c5a4e427b7b81b727092))
* update save event theme ([0d9cdcf](https://github.com/lemonadesocial/web-new/commit/0d9cdcfbb7e661c65119a8d26fad9206aebaaec6))
* update shader config ([64c2757](https://github.com/lemonadesocial/web-new/commit/64c275705374c3e5b1e289b72b8dce0849305852))
* update shader with mode theme ([81270a7](https://github.com/lemonadesocial/web-new/commit/81270a72c9c1f99ea637256c898721ba6c7be3c5))
* use upvote status from api ([4ff36d5](https://github.com/lemonadesocial/web-new/commit/4ff36d5e47b9a5f0031bcb2e333e2e31289d3fc0))
* user posts ([6b55a9f](https://github.com/lemonadesocial/web-new/commit/6b55a9f08de0cfa7b1df881a21fc16c68d98731c))
* verify wallet ([36665e4](https://github.com/lemonadesocial/web-new/commit/36665e4fc828a26d42a89b0f0cf3f87ba5c89136))
* verify wallet ([2c793c1](https://github.com/lemonadesocial/web-new/commit/2c793c193b4b096aa86111b2f8aba938e1d9aae1))


### Bug Fixes

* accept event non logged in ([751d018](https://github.com/lemonadesocial/web-new/commit/751d018cb28706db0b372773d342a4881bb464a7))
* account picture not showing ([c97c0b8](https://github.com/lemonadesocial/web-new/commit/c97c0b880cb9f3a48dfcfef557f27e9282c11348))
* adapt existing config community ([c267830](https://github.com/lemonadesocial/web-new/commit/c2678306d40892b073f8fdd14d1dc1c6dfd58059))
* adapt existing url ([4f858bf](https://github.com/lemonadesocial/web-new/commit/4f858bf5da9fde34adcce3e89fff89e377b29188))
* allow only guest can subcribe hub ([fec01b4](https://github.com/lemonadesocial/web-new/commit/fec01b40159f9b71ef27d245d6f3ee38372ab5c6))
* apply disabled style ([35dd125](https://github.com/lemonadesocial/web-new/commit/35dd12559236261b6f84b954ea7e385c41ca99c2))
* assign tickets not updating tickets data ([ec17b3d](https://github.com/lemonadesocial/web-new/commit/ec17b3d74cdb58850d194cde82afcdc47217d932))
* attending name ([90dd1f9](https://github.com/lemonadesocial/web-new/commit/90dd1f957472e724991ed278c08edf91617f8582))
* auto select style for shader/pattern ([25d94d0](https://github.com/lemonadesocial/web-new/commit/25d94d01f9fbe1020ac7ea59ddedc4d3e28bc4e0))
* blend black color ([fd827bc](https://github.com/lemonadesocial/web-new/commit/fd827bc1a253945f4bf340c5089accb069be559c))
* calender menu picker on modal ([8664d51](https://github.com/lemonadesocial/web-new/commit/8664d516cf61d3e62a0140fdd7f00f61ab716f39))
* cannot apply code 100% ([23ac6ba](https://github.com/lemonadesocial/web-new/commit/23ac6bacd6b0691a6657be68f2a3978ef30f8a9f))
* check alway play control ([2ae6735](https://github.com/lemonadesocial/web-new/commit/2ae673527fc549660a229cc04fa26a7a9cc2aa4e))
* check condition ([63da540](https://github.com/lemonadesocial/web-new/commit/63da540bec0b99a7364faefe2c3744f0dbb1524e))
* check empty theme ([c9b1258](https://github.com/lemonadesocial/web-new/commit/c9b12587aafdd97a2eaf44af67ad15abcf69416f))
* check missing theme data when init load ([b31d9f7](https://github.com/lemonadesocial/web-new/commit/b31d9f7f17c1100e56a827ce32c3b5c66857f720))
* check reset correct theme ([06a3975](https://github.com/lemonadesocial/web-new/commit/06a39753c5c5f185d379cd02ba63146879a7e037))
* check tickets infinite loop ([a5781a4](https://github.com/lemonadesocial/web-new/commit/a5781a4bc040668a70d324131048d1fb42d29f1b))
* check visibilitychange ([c1e4fa3](https://github.com/lemonadesocial/web-new/commit/c1e4fa3eb4f68d1c383337a0fb838205a2001bbe))
* checking add address ([c499fda](https://github.com/lemonadesocial/web-new/commit/c499fda2f6738a92f964d4edc8315f4fc67ab951))
* checking autoplay ([1c9e7bc](https://github.com/lemonadesocial/web-new/commit/1c9e7bcff11cc95acf9e5f869b3d8c4e2837c5ac))
* checking autoplay ([1dfcef4](https://github.com/lemonadesocial/web-new/commit/1dfcef437dbb1966d4c67bd8a9728fd4160df6c6))
* clean linting ([0b87dd6](https://github.com/lemonadesocial/web-new/commit/0b87dd660f689ffdb0dbeb75d8576c329a83846d))
* click user profile event ([addea5b](https://github.com/lemonadesocial/web-new/commit/addea5bb98cdbf4a7516e061244b285160ef925a))
* clickable checkbox ([ccab88b](https://github.com/lemonadesocial/web-new/commit/ccab88bd3b1d8e451a131dd6e270ae4262a099ba))
* close rsvp modal ([759cf7e](https://github.com/lemonadesocial/web-new/commit/759cf7e72e54934feccf94775441b95273dc1aa9))
* collectibles per ticket ([9c3d6c7](https://github.com/lemonadesocial/web-new/commit/9c3d6c706240a9a45d946cf777268410615ed0e7))
* completed ([4e2cbf0](https://github.com/lemonadesocial/web-new/commit/4e2cbf081d421d8c29805a7b0b5654fce151006b))
* copy ([d2fc4af](https://github.com/lemonadesocial/web-new/commit/d2fc4af4a1aa7dd60a693ed704690c607be1c764))
* correct payment account ([74dec5a](https://github.com/lemonadesocial/web-new/commit/74dec5ac64a050650a3fa1e7a24f3ce9879e79bd))
* cover blend background ([99071b3](https://github.com/lemonadesocial/web-new/commit/99071b3ec6d6f80ab25509ce8c194a3e7f953093))
* crash issue ([6465511](https://github.com/lemonadesocial/web-new/commit/6465511c347fa53b76fbd7a37bd22a2a9f10fd85))
* discount application ([616f679](https://github.com/lemonadesocial/web-new/commit/616f67933146f644e0f00819cd8b9c96935914eb))
* drawer bg ([3d10365](https://github.com/lemonadesocial/web-new/commit/3d10365f8937dea994d76d2e9b2fedf7b9faff57))
* error state theming ([d90100b](https://github.com/lemonadesocial/web-new/commit/d90100b1e2920b1e059359abd6023540708a50c2))
* event desc format ([944f9f8](https://github.com/lemonadesocial/web-new/commit/944f9f87590935546d90691dc7bb4e79b2bc3eef))
* event desc long text ([4237698](https://github.com/lemonadesocial/web-new/commit/423769866f4c8cc7aa3f3e1126af5908a9218f4d))
* event issues ([5930930](https://github.com/lemonadesocial/web-new/commit/593093084d38a4445a29b2fe54bfee929f8bc3d1))
* event list same date ([8734b94](https://github.com/lemonadesocial/web-new/commit/8734b947772a79abf5258c71270d2d00c63c8867))
* event new ([83c3614](https://github.com/lemonadesocial/web-new/commit/83c361437614b65a58955b1481ffd39d1f859f6b))
* event status ([cb9f366](https://github.com/lemonadesocial/web-new/commit/cb9f366f4bb011241ba0d27b146d9e6d992a52e2))
* event status ([33fdb0a](https://github.com/lemonadesocial/web-new/commit/33fdb0ab54320c2f9b2bfb488c8673b924a773b6))
* event status ([0eb3317](https://github.com/lemonadesocial/web-new/commit/0eb33177fd5f78bce510165d92dfed4f50eccae1))
* filter custodial wallet ([568c1e7](https://github.com/lemonadesocial/web-new/commit/568c1e7dcb42e46976247f96e5aae590b940a005))
* float portal ([84dd612](https://github.com/lemonadesocial/web-new/commit/84dd6127171b2eb0e6f0b915cd27ae0795d59a80))
* floating menu ([cf6af55](https://github.com/lemonadesocial/web-new/commit/cf6af550f57338b6e83d68bf07b7fe43148986fd))
* format event start by timezone ([5028396](https://github.com/lemonadesocial/web-new/commit/502839674215461e653131b7b5abbb7358878c7b))
* gesture handle map ([0748f98](https://github.com/lemonadesocial/web-new/commit/0748f986e393a1a6b59b95f4f520b771c0246930))
* get buyer info ([3c81ff9](https://github.com/lemonadesocial/web-new/commit/3c81ff9108289fc1949052712ed4ecbc97acbd02))
* hide cover photo in gallery ([6857683](https://github.com/lemonadesocial/web-new/commit/68576831fcbf4636a6ede72b45c8d4cdf175afb4))
* hide personal space on event ([5d05f12](https://github.com/lemonadesocial/web-new/commit/5d05f1208dbc912c5cb5a18ad7bd47409848706b))
* hide sub events instead empty state ([97d107e](https://github.com/lemonadesocial/web-new/commit/97d107e81f74bfac533288e8409b9bd9d053846d))
* hide tage free ([a623334](https://github.com/lemonadesocial/web-new/commit/a623334aba9ee075c933ba6f8525b81b452c604b))
* hover state btn secondary ([aa87b58](https://github.com/lemonadesocial/web-new/commit/aa87b585d1f1f13a1ccd2b9d58b17983257c6136))
* hover state full container ([a40f32e](https://github.com/lemonadesocial/web-new/commit/a40f32ed37511fe25cff422838f35ec1a87a49ad))
* lens feed ([6b05ec3](https://github.com/lemonadesocial/web-new/commit/6b05ec34ff52315e2fbf15fb38313438dc8cb6b0))
* light mode colors ([ed0d5d1](https://github.com/lemonadesocial/web-new/commit/ed0d5d155371ef967752ec93fd91dd8a28fc18a0))
* lint ([be71b12](https://github.com/lemonadesocial/web-new/commit/be71b1290b13d36ffced8b7f2c2c8db91092b2a8))
* lint ([23d0a43](https://github.com/lemonadesocial/web-new/commit/23d0a438d8e6f10587cba368a80a61eeb6ae2ee6))
* lint code ([0e8c279](https://github.com/lemonadesocial/web-new/commit/0e8c27974ea62bc8acfc5e8c0a126cbf5f0cce36))
* lint code ([5477116](https://github.com/lemonadesocial/web-new/commit/5477116a24a9e53dd280e44db9bda126629ec4a0))
* lint code ([8ceb070](https://github.com/lemonadesocial/web-new/commit/8ceb07075209d9fe958de99d80dd76560298b5d8))
* lint code ([60d1d7c](https://github.com/lemonadesocial/web-new/commit/60d1d7cfa41bc785c9375704d10b591d85007417))
* lint code ([51ba0e4](https://github.com/lemonadesocial/web-new/commit/51ba0e4fd14bb265c6703aa34a129726a859d7fc))
* lint code ([c6af4ee](https://github.com/lemonadesocial/web-new/commit/c6af4ee455fc16f48bcc8101d9f13fdc13765139))
* load post content for comment as post ([62e13d6](https://github.com/lemonadesocial/web-new/commit/62e13d612dc3c7887579744bce3919a87f4059d0))
* lock body scroll mobile ([caf1583](https://github.com/lemonadesocial/web-new/commit/caf15831fe0065182f06668786e92a924f494d8f))
* logged in state ([b49e041](https://github.com/lemonadesocial/web-new/commit/b49e041677cf88d0a5916734be1eee7f36c58926))
* merge default value config builder ([8b2aa73](https://github.com/lemonadesocial/web-new/commit/8b2aa73d7be5a19574d6f72358814d6c6df4678e))
* metadata bio ([1321fbd](https://github.com/lemonadesocial/web-new/commit/1321fbde14d2eb7e5a114b61ee6c3e2126268132))
* miss action manage event ([345bef4](https://github.com/lemonadesocial/web-new/commit/345bef42da509d139e3db287f75a1bd7b4ab80d4))
* miss sub hub at root ([8d2ced9](https://github.com/lemonadesocial/web-new/commit/8d2ced92343354764b576ff7348e8ffd8623e42d))
* missing color picker ([4895528](https://github.com/lemonadesocial/web-new/commit/489552878e719b8863c2b46be78a110632b5876d))
* missing community metadata ([68f2457](https://github.com/lemonadesocial/web-new/commit/68f2457fd95f9297c611e3b177bd05c3406850b3))
* missing condition ([61e3468](https://github.com/lemonadesocial/web-new/commit/61e34681b68ef3c1e1c8e065a55bdd1b25f77cda))
* missing config color on card ([12a4bee](https://github.com/lemonadesocial/web-new/commit/12a4bee58915d931239931d7e88c5b741d04c5ab))
* missing data config ([2c6d9b3](https://github.com/lemonadesocial/web-new/commit/2c6d9b3643d04e53b7129fc09b9ee10436734470))
* missing event props ([3128cb6](https://github.com/lemonadesocial/web-new/commit/3128cb643b90796939f812e992e0d1b0cb773e72))
* missing import ([8bd88a4](https://github.com/lemonadesocial/web-new/commit/8bd88a4b2e59047331e48808d720bd7d89fd95cc))
* missing lens route ([4d46f8a](https://github.com/lemonadesocial/web-new/commit/4d46f8a44e7cdf64aa2186b43352cca7b5b28248))
* missing middleware check for lens route ([e1b4a03](https://github.com/lemonadesocial/web-new/commit/e1b4a03126c4788ba19249047c2261c95ca5212f))
* missing sub hub ([fb26bcf](https://github.com/lemonadesocial/web-new/commit/fb26bcf8c80beab577d78cd17cbadbbc8a94b727))
* missing theme ui ([e2619e5](https://github.com/lemonadesocial/web-new/commit/e2619e5d3e1b035973d21d0229e07893bd7730de))
* mobile modal ([255a7ca](https://github.com/lemonadesocial/web-new/commit/255a7ca7bfdaa4a56831b5862afc758917897375))
* mobile screen ([6108c2d](https://github.com/lemonadesocial/web-new/commit/6108c2d9dfdd347589af487a75259e3a1721764c))
* mobile view ([cd5bb6c](https://github.com/lemonadesocial/web-new/commit/cd5bb6cedf5a41bf354160b7b9935bb9ce545ef5))
* move shader file ([7d019eb](https://github.com/lemonadesocial/web-new/commit/7d019ebda3dfb0936620d52e68011dcaab2acf4a))
* nullable space ([84b9a81](https://github.com/lemonadesocial/web-new/commit/84b9a811b65d259e70e73b92039678139887c037))
* nullable space ([4a343b2](https://github.com/lemonadesocial/web-new/commit/4a343b216a558309373e3dc9c2b5595de6c71437))
* open comment as post ([c61a13d](https://github.com/lemonadesocial/web-new/commit/c61a13d2b8226ffe482cae6765048465719f2018))
* post author name ([d83e556](https://github.com/lemonadesocial/web-new/commit/d83e5562052fad8707648dc0732ff4f5ca0c6bfc))
* query space ([ba7a1a0](https://github.com/lemonadesocial/web-new/commit/ba7a1a0cef9953d4c3c16fd6cf86482fe4970ca0))
* reduce emoji - fps ([625cf50](https://github.com/lemonadesocial/web-new/commit/625cf50208b40199eedf8388ad5b342b12985b0a))
* refactor button variants ([c87a218](https://github.com/lemonadesocial/web-new/commit/c87a218adb4639ce8418a4bc68d3b56271c45023))
* remove button backdrop ([4611355](https://github.com/lemonadesocial/web-new/commit/4611355fe5cfab01199d2b45c1c3ae8774142038))
* remove console ([d78fbef](https://github.com/lemonadesocial/web-new/commit/d78fbef8872847f26428a11f6ab2cdb59cd35b7c))
* remove deps ([93a8457](https://github.com/lemonadesocial/web-new/commit/93a845769a10d165e8408e96a12928f854053f2a))
* remove outline image avatar community ([7ce56a8](https://github.com/lemonadesocial/web-new/commit/7ce56a8badab7d4bcbf6d2ab4b5e4c592455e3d8))
* remove unused ([bbf08e7](https://github.com/lemonadesocial/web-new/commit/bbf08e7c8f230cdf1019cf2b9771df06bc9a0c7b))
* reset class value when switch theme ([50ff1e3](https://github.com/lemonadesocial/web-new/commit/50ff1e39e57174b4e9cb3e40b72a2972361c23ec))
* reset theme ([721e2ea](https://github.com/lemonadesocial/web-new/commit/721e2ea32074eca99c94f8400c7e1461829a25a4))
* resolve issue on safari ([a7b507c](https://github.com/lemonadesocial/web-new/commit/a7b507c41d682927eff7e11aa68c08fe8b3249c1))
* revert ([ff5ccec](https://github.com/lemonadesocial/web-new/commit/ff5ccec14ab100f736fa69463b24c7ffd3c00a6f))
* rollback effect ([63e5e93](https://github.com/lemonadesocial/web-new/commit/63e5e93fc8c48f1e1f14d49558c9c8d2890e4536))
* santize desc ([80ba973](https://github.com/lemonadesocial/web-new/commit/80ba9731a98a340a3353474824be67afce95c2d8))
* show short location ([0664117](https://github.com/lemonadesocial/web-new/commit/0664117545deeb501dbcd2f32bc110683b5f17aa))
* sort color under template ([fe08f0d](https://github.com/lemonadesocial/web-new/commit/fe08f0dc14a2cff6442228dccc529dcb1f0cfbc9))
* sort order ([82d78f2](https://github.com/lemonadesocial/web-new/commit/82d78f2b1a1aaafc2fc7828eb55298179ead23fa))
* styles ([1b3b95a](https://github.com/lemonadesocial/web-new/commit/1b3b95abc258cc6c0c9993781c95e6512e4cb3aa))
* submit answers ([042d575](https://github.com/lemonadesocial/web-new/commit/042d5759d0381ebfe898069d26937e7878836306))
* temp to check path hostname ([a690ff8](https://github.com/lemonadesocial/web-new/commit/a690ff85aeb3d98db75f87b176ace52ad0eb4820))
* testing visible app ([4974601](https://github.com/lemonadesocial/web-new/commit/49746019bff6ee01b5232ca1033bf6a7a1e36e47))
* text wrap ([8e510f4](https://github.com/lemonadesocial/web-new/commit/8e510f4d4d269d309c8e595b31c7e846f50e1d8e))
* truncate location ([26982b5](https://github.com/lemonadesocial/web-new/commit/26982b5b40575d4a190f33392c8b197c14a7f9aa))
* ui issues ([aca884c](https://github.com/lemonadesocial/web-new/commit/aca884ce035406b8c59d27b8f9ab82a80fa97af6))
* ui issues ([b4eefd6](https://github.com/lemonadesocial/web-new/commit/b4eefd6cff536d4bd0b247ecbf0d650c29a11c70))
* uncategorized tickets are shown ([c9cd1af](https://github.com/lemonadesocial/web-new/commit/c9cd1af7db1c782150c5d6967628f96f19739749))
* update accent color when select gradient ([3c3a5d9](https://github.com/lemonadesocial/web-new/commit/3c3a5d9da2a552fee1790329acdb2e6f0dfd5563))
* update address/timezone field ([f1f1776](https://github.com/lemonadesocial/web-new/commit/f1f17761a918a60d297e6d45cce4efa3f20ae2bd))
* update color class ([084108a](https://github.com/lemonadesocial/web-new/commit/084108a634dead11a9cb7e142267580be1519029))
* update color light mode ([050f11e](https://github.com/lemonadesocial/web-new/commit/050f11e67db8c4441ce2ca45a30180116f25edeb))
* update color on pattern menu ([2190986](https://github.com/lemonadesocial/web-new/commit/2190986d4d7ad6caeac1791c2582087874c8a4c7))
* update community theme builder actions ([622be2b](https://github.com/lemonadesocial/web-new/commit/622be2b093ca1429a9896f2e5548daea52e3da22))
* update datetime picker logic ([3665450](https://github.com/lemonadesocial/web-new/commit/36654501416e231ff273ae54ae5d12ef5d291426))
* update default shader when select gradient theme ([5a78baf](https://github.com/lemonadesocial/web-new/commit/5a78bafce4515228b6580ade2fcfd7016aba83d5))
* update effect icon on main builder event ([f26e6aa](https://github.com/lemonadesocial/web-new/commit/f26e6aa9bea2cc5d5f6515cb93c9232ced58f5a4))
* update invert primary color on calendar ([550d166](https://github.com/lemonadesocial/web-new/commit/550d16656be55f32ae20a1b6db101b8ee95bcf1f))
* update mobile view ([f585f3b](https://github.com/lemonadesocial/web-new/commit/f585f3b1ecb512bb4d60ead4d6bfdc4591113d59))
* update modal listing event mobile view ([f9dfca4](https://github.com/lemonadesocial/web-new/commit/f9dfca47219a64ac6ceb72711a1be628def8c465))
* update og image when event updated cover image ([5180880](https://github.com/lemonadesocial/web-new/commit/5180880e22263d92fc7181b36b81c4c966c6b9c0))
* update pattern theme ([31623a3](https://github.com/lemonadesocial/web-new/commit/31623a364d62b162a6bdbeb8b3f200e57f52c748))
* update static path ([432605e](https://github.com/lemonadesocial/web-new/commit/432605e460b4828a082e3c0e0e07e9995e370183))
* update sub hub router ([7369d6b](https://github.com/lemonadesocial/web-new/commit/7369d6b840ffc2498d21cffd6f63c1f78606ccb4))
* update text submit event ([cc54d7f](https://github.com/lemonadesocial/web-new/commit/cc54d7f98b349032b6d005e6fa23fa9f5d7cbb92))
* update theme builder config ([0e64fd6](https://github.com/lemonadesocial/web-new/commit/0e64fd6794c2126db8132e434f209881885f3d57))
* update ui community theme builder mobile ([49e5617](https://github.com/lemonadesocial/web-new/commit/49e5617567fa42ae10f0504ad4c9cb04fd8d88fc))
* use data res directly caching ([aee8a39](https://github.com/lemonadesocial/web-new/commit/aee8a3923c7c8c7ed597f7e1b6778614cd2a3ae7))
* use theme name instead of key ([1ec77a6](https://github.com/lemonadesocial/web-new/commit/1ec77a6b029dd6a553e44e6e1e05ba0b0572145f))
* video autoplay ([58a3d52](https://github.com/lemonadesocial/web-new/commit/58a3d52fd9d638b7051f4911623c2c183e8cbb69))
* wrong ref ([6e45290](https://github.com/lemonadesocial/web-new/commit/6e452909d6281311c4f295dfcd85a5994913d99b))

## [1.35.1](https://github.com/lemonadesocial/web-new/compare/v1.35.0...v1.35.1) (2025-06-06)


### Bug Fixes

* event desc format ([944f9f8](https://github.com/lemonadesocial/web-new/commit/944f9f87590935546d90691dc7bb4e79b2bc3eef))
* missing lens route ([4d46f8a](https://github.com/lemonadesocial/web-new/commit/4d46f8a44e7cdf64aa2186b43352cca7b5b28248))

## [1.35.0](https://github.com/lemonadesocial/web-new/compare/v1.34.0...v1.35.0) (2025-06-06)


### Features

* edit profile menu item ([9cfb233](https://github.com/lemonadesocial/web-new/commit/9cfb2331e5921ce3bb750579f60d0a5f0fa6d986))
* implement lens post fullscreen ([820a953](https://github.com/lemonadesocial/web-new/commit/820a9538a6fe62c1c84cf94da737a725b298b74c))
* lens profile page ([c910fe6](https://github.com/lemonadesocial/web-new/commit/c910fe65244f1966089e58c6e8b1a7eb1d3b7dbe))
* update comment post detail ([fea14d6](https://github.com/lemonadesocial/web-new/commit/fea14d6f0bb19c1495dff686aa89ac06a41060e2))
* update LenProfileCard ([98606dc](https://github.com/lemonadesocial/web-new/commit/98606dcab7f67285301670740b8dcb34921e3a96))
* update lens profile link ([880a453](https://github.com/lemonadesocial/web-new/commit/880a453a7a00b01ca3418610d2c21fc7470efb2d))
* update post state ([cd97f7b](https://github.com/lemonadesocial/web-new/commit/cd97f7ba76654d2638da54a9c80e91e390c987bc))
* user posts ([6b55a9f](https://github.com/lemonadesocial/web-new/commit/6b55a9f08de0cfa7b1df881a21fc16c68d98731c))


### Bug Fixes

* click user profile event ([addea5b](https://github.com/lemonadesocial/web-new/commit/addea5bb98cdbf4a7516e061244b285160ef925a))
* load post content for comment as post ([62e13d6](https://github.com/lemonadesocial/web-new/commit/62e13d612dc3c7887579744bce3919a87f4059d0))
* mobile view ([cd5bb6c](https://github.com/lemonadesocial/web-new/commit/cd5bb6cedf5a41bf354160b7b9935bb9ce545ef5))
* open comment as post ([c61a13d](https://github.com/lemonadesocial/web-new/commit/c61a13d2b8226ffe482cae6765048465719f2018))

## [1.34.0](https://github.com/lemonadesocial/web-new/compare/v1.33.4...v1.34.0) (2025-06-02)


### Features

* empty posts ([f81570f](https://github.com/lemonadesocial/web-new/commit/f81570fa35f880ca9bfd612bbfdfe203494750df))
* **lens:** select profile ([447ff06](https://github.com/lemonadesocial/web-new/commit/447ff06c551ddab58bceb77fdc4559147645ab2b))

## [1.33.4](https://github.com/lemonadesocial/web-new/compare/v1.33.3...v1.33.4) (2025-06-02)


### Bug Fixes

* check alway play control ([2ae6735](https://github.com/lemonadesocial/web-new/commit/2ae673527fc549660a229cc04fa26a7a9cc2aa4e))
* check visibilitychange ([c1e4fa3](https://github.com/lemonadesocial/web-new/commit/c1e4fa3eb4f68d1c383337a0fb838205a2001bbe))
* checking autoplay ([1c9e7bc](https://github.com/lemonadesocial/web-new/commit/1c9e7bcff11cc95acf9e5f869b3d8c4e2837c5ac))
* checking autoplay ([1dfcef4](https://github.com/lemonadesocial/web-new/commit/1dfcef437dbb1966d4c67bd8a9728fd4160df6c6))
* completed ([4e2cbf0](https://github.com/lemonadesocial/web-new/commit/4e2cbf081d421d8c29805a7b0b5654fce151006b))
* remove deps ([93a8457](https://github.com/lemonadesocial/web-new/commit/93a845769a10d165e8408e96a12928f854053f2a))
* testing visible app ([4974601](https://github.com/lemonadesocial/web-new/commit/49746019bff6ee01b5232ca1033bf6a7a1e36e47))
* video autoplay ([58a3d52](https://github.com/lemonadesocial/web-new/commit/58a3d52fd9d638b7051f4911623c2c183e8cbb69))
* wrong ref ([6e45290](https://github.com/lemonadesocial/web-new/commit/6e452909d6281311c4f295dfcd85a5994913d99b))

## [1.33.3](https://github.com/lemonadesocial/web-new/compare/v1.33.2...v1.33.3) (2025-06-01)


### Bug Fixes

* calender menu picker on modal ([8664d51](https://github.com/lemonadesocial/web-new/commit/8664d516cf61d3e62a0140fdd7f00f61ab716f39))

## [1.33.2](https://github.com/lemonadesocial/web-new/compare/v1.33.1...v1.33.2) (2025-06-01)


### Bug Fixes

* float portal ([84dd612](https://github.com/lemonadesocial/web-new/commit/84dd6127171b2eb0e6f0b915cd27ae0795d59a80))

## [1.33.1](https://github.com/lemonadesocial/web-new/compare/v1.33.0...v1.33.1) (2025-06-01)


### Bug Fixes

* adapt existing url ([4f858bf](https://github.com/lemonadesocial/web-new/commit/4f858bf5da9fde34adcce3e89fff89e377b29188))
* reduce emoji - fps ([625cf50](https://github.com/lemonadesocial/web-new/commit/625cf50208b40199eedf8388ad5b342b12985b0a))
* resolve issue on safari ([a7b507c](https://github.com/lemonadesocial/web-new/commit/a7b507c41d682927eff7e11aa68c08fe8b3249c1))
* rollback effect ([63e5e93](https://github.com/lemonadesocial/web-new/commit/63e5e93fc8c48f1e1f14d49558c9c8d2890e4536))

## [1.33.0](https://github.com/lemonadesocial/web-new/compare/v1.32.0...v1.33.0) (2025-06-01)


### Features

* completed location ([326433c](https://github.com/lemonadesocial/web-new/commit/326433cf58c58b3d417d5144e9c629159ddb0b4d))
* update logic external event link on list event ([27aaf8a](https://github.com/lemonadesocial/web-new/commit/27aaf8a0ae575020e1c77f33947b4063efb761b8))


### Bug Fixes

* update datetime picker logic ([3665450](https://github.com/lemonadesocial/web-new/commit/36654501416e231ff273ae54ae5d12ef5d291426))
* update mobile view ([f585f3b](https://github.com/lemonadesocial/web-new/commit/f585f3b1ecb512bb4d60ead4d6bfdc4591113d59))

## [1.32.0](https://github.com/lemonadesocial/web-new/compare/v1.31.0...v1.32.0) (2025-05-31)


### Features

* update comment count ([db82158](https://github.com/lemonadesocial/web-new/commit/db821582bf8c60eaf00c71cfb5c423369a69fb78))


### Bug Fixes

* mobile modal ([255a7ca](https://github.com/lemonadesocial/web-new/commit/255a7ca7bfdaa4a56831b5862afc758917897375))

## [1.31.0](https://github.com/lemonadesocial/web-new/compare/v1.30.0...v1.31.0) (2025-05-31)


### Features

* add comment ([95537e0](https://github.com/lemonadesocial/web-new/commit/95537e072e2928e4516d3bc6cc3e3f6b7c8f42af))


### Bug Fixes

* sort color under template ([fe08f0d](https://github.com/lemonadesocial/web-new/commit/fe08f0dc14a2cff6442228dccc529dcb1f0cfbc9))
* update theme builder config ([0e64fd6](https://github.com/lemonadesocial/web-new/commit/0e64fd6794c2126db8132e434f209881885f3d57))

## [1.30.0](https://github.com/lemonadesocial/web-new/compare/v1.29.0...v1.30.0) (2025-05-30)


### Features

* add effect on top of other theme ([c6e1524](https://github.com/lemonadesocial/web-new/commit/c6e152409ab473a53d443cabe9409a121fed9e08))


### Bug Fixes

* update effect icon on main builder event ([f26e6aa](https://github.com/lemonadesocial/web-new/commit/f26e6aa9bea2cc5d5f6515cb93c9232ced58f5a4))

## [1.29.0](https://github.com/lemonadesocial/web-new/compare/v1.28.0...v1.29.0) (2025-05-30)


### Features

* check lens auth ([379dcb6](https://github.com/lemonadesocial/web-new/commit/379dcb6038e0a78037750abeb5bceaa1fe43f5ee))

## [1.28.0](https://github.com/lemonadesocial/web-new/compare/v1.27.0...v1.28.0) (2025-05-30)


### Features

* community mobile nav ([73d921a](https://github.com/lemonadesocial/web-new/commit/73d921aff7c6ca019190f0e6e64a81698434eb8a))
* **nginx:** proxy Sendgrid open & click tracking ([88d1a92](https://github.com/lemonadesocial/web-new/commit/88d1a922e2ebd02a4f2b3205f29ed85f7a733103))

## [1.27.0](https://github.com/lemonadesocial/web-new/compare/v1.26.3...v1.27.0) (2025-05-30)


### Features

* attach event ([386ae96](https://github.com/lemonadesocial/web-new/commit/386ae9631b401c17d22e68dbe2329da5abccec75))
* post comments ([3e75656](https://github.com/lemonadesocial/web-new/commit/3e75656a2acbab6705db6cd9384ae377da4b192c))
* **temp:** hide comments ([238c6ae](https://github.com/lemonadesocial/web-new/commit/238c6ae6687cbbbad31cc6a5102ccc0d8abd2e4a))
* use upvote status from api ([4ff36d5](https://github.com/lemonadesocial/web-new/commit/4ff36d5e47b9a5f0031bcb2e333e2e31289d3fc0))


### Bug Fixes

* event desc long text ([4237698](https://github.com/lemonadesocial/web-new/commit/423769866f4c8cc7aa3f3e1126af5908a9218f4d))
* lint ([be71b12](https://github.com/lemonadesocial/web-new/commit/be71b1290b13d36ffced8b7f2c2c8db91092b2a8))

## [1.26.3](https://github.com/lemonadesocial/web-new/compare/v1.26.2...v1.26.3) (2025-05-28)


### Bug Fixes

* account picture not showing ([c97c0b8](https://github.com/lemonadesocial/web-new/commit/c97c0b880cb9f3a48dfcfef557f27e9282c11348))
* adapt existing config community ([c267830](https://github.com/lemonadesocial/web-new/commit/c2678306d40892b073f8fdd14d1dc1c6dfd58059))
* remove console ([d78fbef](https://github.com/lemonadesocial/web-new/commit/d78fbef8872847f26428a11f6ab2cdb59cd35b7c))

## [1.26.2](https://github.com/lemonadesocial/web-new/compare/v1.26.1...v1.26.2) (2025-05-28)


### Bug Fixes

* merge default value config builder ([8b2aa73](https://github.com/lemonadesocial/web-new/commit/8b2aa73d7be5a19574d6f72358814d6c6df4678e))

## [1.26.1](https://github.com/lemonadesocial/web-new/compare/v1.26.0...v1.26.1) (2025-05-27)


### Bug Fixes

* logged in state ([b49e041](https://github.com/lemonadesocial/web-new/commit/b49e041677cf88d0a5916734be1eee7f36c58926))
* metadata bio ([1321fbd](https://github.com/lemonadesocial/web-new/commit/1321fbde14d2eb7e5a114b61ee6c3e2126268132))

## [1.26.0](https://github.com/lemonadesocial/web-new/compare/v1.25.0...v1.26.0) (2025-05-27)


### Features

* post actions placeholder ([87ec5d0](https://github.com/lemonadesocial/web-new/commit/87ec5d08d12d7bed652972f5443d26fa34617341))

## [1.25.0](https://github.com/lemonadesocial/web-new/compare/v1.24.7...v1.25.0) (2025-05-27)


### Features

* lens feed ([2913d6c](https://github.com/lemonadesocial/web-new/commit/2913d6c170f6307579a4fc83afbcbbbad1931064))
* post reactions ([9e5db23](https://github.com/lemonadesocial/web-new/commit/9e5db239b5e23ab14f556081bca2e348158c819b))
* refactor community them builder ([d2e8a15](https://github.com/lemonadesocial/web-new/commit/d2e8a15612fd535dd0d92945ce4a2f6daf6aaf4c))
* update default color for event builder ([1ca40bf](https://github.com/lemonadesocial/web-new/commit/1ca40bf1191a449a06a959a4d2003948fd9dd10b))
* update save event theme ([0d9cdcf](https://github.com/lemonadesocial/web-new/commit/0d9cdcfbb7e661c65119a8d26fad9206aebaaec6))


### Bug Fixes

* auto select style for shader/pattern ([25d94d0](https://github.com/lemonadesocial/web-new/commit/25d94d01f9fbe1020ac7ea59ddedc4d3e28bc4e0))
* format event start by timezone ([5028396](https://github.com/lemonadesocial/web-new/commit/502839674215461e653131b7b5abbb7358878c7b))
* hide tage free ([a623334](https://github.com/lemonadesocial/web-new/commit/a623334aba9ee075c933ba6f8525b81b452c604b))
* hover state btn secondary ([aa87b58](https://github.com/lemonadesocial/web-new/commit/aa87b585d1f1f13a1ccd2b9d58b17983257c6136))
* lens feed ([6b05ec3](https://github.com/lemonadesocial/web-new/commit/6b05ec34ff52315e2fbf15fb38313438dc8cb6b0))
* lint ([23d0a43](https://github.com/lemonadesocial/web-new/commit/23d0a438d8e6f10587cba368a80a61eeb6ae2ee6))
* missing config color on card ([12a4bee](https://github.com/lemonadesocial/web-new/commit/12a4bee58915d931239931d7e88c5b741d04c5ab))
* post author name ([d83e556](https://github.com/lemonadesocial/web-new/commit/d83e5562052fad8707648dc0732ff4f5ca0c6bfc))
* update color on pattern menu ([2190986](https://github.com/lemonadesocial/web-new/commit/2190986d4d7ad6caeac1791c2582087874c8a4c7))
* update community theme builder actions ([622be2b](https://github.com/lemonadesocial/web-new/commit/622be2b093ca1429a9896f2e5548daea52e3da22))
* update modal listing event mobile view ([f9dfca4](https://github.com/lemonadesocial/web-new/commit/f9dfca47219a64ac6ceb72711a1be628def8c465))
* update ui community theme builder mobile ([49e5617](https://github.com/lemonadesocial/web-new/commit/49e5617567fa42ae10f0504ad4c9cb04fd8d88fc))

## [1.24.7](https://github.com/lemonadesocial/web-new/compare/v1.24.6...v1.24.7) (2025-05-25)


### Bug Fixes

* accept event non logged in ([751d018](https://github.com/lemonadesocial/web-new/commit/751d018cb28706db0b372773d342a4881bb464a7))
* get buyer info ([3c81ff9](https://github.com/lemonadesocial/web-new/commit/3c81ff9108289fc1949052712ed4ecbc97acbd02))

## [1.24.6](https://github.com/lemonadesocial/web-new/compare/v1.24.5...v1.24.6) (2025-05-22)


### Bug Fixes

* check condition ([63da540](https://github.com/lemonadesocial/web-new/commit/63da540bec0b99a7364faefe2c3744f0dbb1524e))
* crash issue ([6465511](https://github.com/lemonadesocial/web-new/commit/6465511c347fa53b76fbd7a37bd22a2a9f10fd85))

## [1.24.5](https://github.com/lemonadesocial/web-new/compare/v1.24.4...v1.24.5) (2025-05-22)


### Bug Fixes

* missing condition ([61e3468](https://github.com/lemonadesocial/web-new/commit/61e34681b68ef3c1e1c8e065a55bdd1b25f77cda))

## [1.24.4](https://github.com/lemonadesocial/web-new/compare/v1.24.3...v1.24.4) (2025-05-22)


### Bug Fixes

* missing theme ui ([e2619e5](https://github.com/lemonadesocial/web-new/commit/e2619e5d3e1b035973d21d0229e07893bd7730de))
* santize desc ([80ba973](https://github.com/lemonadesocial/web-new/commit/80ba9731a98a340a3353474824be67afce95c2d8))

## [1.24.3](https://github.com/lemonadesocial/web-new/compare/v1.24.2...v1.24.3) (2025-05-22)


### Bug Fixes

* update og image when event updated cover image ([5180880](https://github.com/lemonadesocial/web-new/commit/5180880e22263d92fc7181b36b81c4c966c6b9c0))

## [1.24.2](https://github.com/lemonadesocial/web-new/compare/v1.24.1...v1.24.2) (2025-05-21)


### Bug Fixes

* light mode colors ([ed0d5d1](https://github.com/lemonadesocial/web-new/commit/ed0d5d155371ef967752ec93fd91dd8a28fc18a0))
* lint code ([0e8c279](https://github.com/lemonadesocial/web-new/commit/0e8c27974ea62bc8acfc5e8c0a126cbf5f0cce36))
* refactor button variants ([c87a218](https://github.com/lemonadesocial/web-new/commit/c87a218adb4639ce8418a4bc68d3b56271c45023))
* update color class ([084108a](https://github.com/lemonadesocial/web-new/commit/084108a634dead11a9cb7e142267580be1519029))
* update color light mode ([050f11e](https://github.com/lemonadesocial/web-new/commit/050f11e67db8c4441ce2ca45a30180116f25edeb))

## [1.24.1](https://github.com/lemonadesocial/web-new/compare/v1.24.0...v1.24.1) (2025-05-21)


### Bug Fixes

* text wrap ([8e510f4](https://github.com/lemonadesocial/web-new/commit/8e510f4d4d269d309c8e595b31c7e846f50e1d8e))

## [1.24.0](https://github.com/lemonadesocial/web-new/compare/v1.23.0...v1.24.0) (2025-05-20)


### Features

* adjust font size ([1e62ad0](https://github.com/lemonadesocial/web-new/commit/1e62ad0826299ef4a406bc3d0e8be38d277be16f))


### Bug Fixes

* event list same date ([8734b94](https://github.com/lemonadesocial/web-new/commit/8734b947772a79abf5258c71270d2d00c63c8867))
* lint code ([5477116](https://github.com/lemonadesocial/web-new/commit/5477116a24a9e53dd280e44db9bda126629ec4a0))

## [1.23.0](https://github.com/lemonadesocial/web-new/compare/v1.22.1...v1.23.0) (2025-05-19)


### Features

* update env ([0632ce1](https://github.com/lemonadesocial/web-new/commit/0632ce107208376ed69466460ce12f2b9182f1a9))

## [1.22.1](https://github.com/lemonadesocial/web-new/compare/v1.22.0...v1.22.1) (2025-05-15)


### Bug Fixes

* missing import ([8bd88a4](https://github.com/lemonadesocial/web-new/commit/8bd88a4b2e59047331e48808d720bd7d89fd95cc))
* sort order ([82d78f2](https://github.com/lemonadesocial/web-new/commit/82d78f2b1a1aaafc2fc7828eb55298179ead23fa))

## [1.22.0](https://github.com/lemonadesocial/web-new/compare/v1.21.0...v1.22.0) (2025-05-15)


### Features

* add default avatar ([eab71bd](https://github.com/lemonadesocial/web-new/commit/eab71bd9831aa19c8522b42a1c5e32b6a5823f64))
* event og ([faa6313](https://github.com/lemonadesocial/web-new/commit/faa63137ea2ab5a5dc781f9b4a8197d9b9261882))
* event status ([e7691bf](https://github.com/lemonadesocial/web-new/commit/e7691bf5f6edb427d386e12c2acbf0ba8b85a13a))


### Bug Fixes

* clean linting ([0b87dd6](https://github.com/lemonadesocial/web-new/commit/0b87dd660f689ffdb0dbeb75d8576c329a83846d))
* event status ([cb9f366](https://github.com/lemonadesocial/web-new/commit/cb9f366f4bb011241ba0d27b146d9e6d992a52e2))
* event status ([33fdb0a](https://github.com/lemonadesocial/web-new/commit/33fdb0ab54320c2f9b2bfb488c8673b924a773b6))
* event status ([0eb3317](https://github.com/lemonadesocial/web-new/commit/0eb33177fd5f78bce510165d92dfed4f50eccae1))

## [1.21.0](https://github.com/lemonadesocial/web-new/compare/v1.20.0...v1.21.0) (2025-05-09)


### Features

* polish event details ([2832ca6](https://github.com/lemonadesocial/web-new/commit/2832ca6bc9cedb86abe27f169d248a3bd752e051))
* polish event details ([9d8f594](https://github.com/lemonadesocial/web-new/commit/9d8f594d847bb7692684c9ef1c61b594f0f3f8e0))

## [1.20.0](https://github.com/lemonadesocial/web-new/compare/v1.19.0...v1.20.0) (2025-05-09)


### Features

* check native token ([1e7233e](https://github.com/lemonadesocial/web-new/commit/1e7233e16df68c0b356c82a9448459c670b5d6e6))
* event terms check ([db57c6f](https://github.com/lemonadesocial/web-new/commit/db57c6f0a7ba8e8d150172ed22f9839b5bb6fa43))


### Bug Fixes

* check tickets infinite loop ([a5781a4](https://github.com/lemonadesocial/web-new/commit/a5781a4bc040668a70d324131048d1fb42d29f1b))
* clickable checkbox ([ccab88b](https://github.com/lemonadesocial/web-new/commit/ccab88bd3b1d8e451a131dd6e270ae4262a099ba))
* close rsvp modal ([759cf7e](https://github.com/lemonadesocial/web-new/commit/759cf7e72e54934feccf94775441b95273dc1aa9))
* filter custodial wallet ([568c1e7](https://github.com/lemonadesocial/web-new/commit/568c1e7dcb42e46976247f96e5aae590b940a005))
* submit answers ([042d575](https://github.com/lemonadesocial/web-new/commit/042d5759d0381ebfe898069d26937e7878836306))

## [1.19.0](https://github.com/lemonadesocial/web-new/compare/v1.18.0...v1.19.0) (2025-05-06)


### Features

* update render link ([08f0a60](https://github.com/lemonadesocial/web-new/commit/08f0a606c141ce07b6c1577e178b67c289d22a07))

## [1.18.0](https://github.com/lemonadesocial/web-new/compare/v1.17.0...v1.18.0) (2025-05-06)


### Features

* update render community description ([eeba83c](https://github.com/lemonadesocial/web-new/commit/eeba83cd458e4173601a731cd4cb2894d260340f))
* verify wallet ([36665e4](https://github.com/lemonadesocial/web-new/commit/36665e4fc828a26d42a89b0f0cf3f87ba5c89136))
* verify wallet ([2c793c1](https://github.com/lemonadesocial/web-new/commit/2c793c193b4b096aa86111b2f8aba938e1d9aae1))


### Bug Fixes

* attending name ([90dd1f9](https://github.com/lemonadesocial/web-new/commit/90dd1f957472e724991ed278c08edf91617f8582))

## [1.17.0](https://github.com/lemonadesocial/web-new/compare/v1.16.4...v1.17.0) (2025-05-05)


### Features

* update shader with mode theme ([81270a7](https://github.com/lemonadesocial/web-new/commit/81270a72c9c1f99ea637256c898721ba6c7be3c5))


### Bug Fixes

* event new ([83c3614](https://github.com/lemonadesocial/web-new/commit/83c361437614b65a58955b1481ffd39d1f859f6b))
* hide personal space on event ([5d05f12](https://github.com/lemonadesocial/web-new/commit/5d05f1208dbc912c5cb5a18ad7bd47409848706b))
* remove outline image avatar community ([7ce56a8](https://github.com/lemonadesocial/web-new/commit/7ce56a8badab7d4bcbf6d2ab4b5e4c592455e3d8))
* ui issues ([b4eefd6](https://github.com/lemonadesocial/web-new/commit/b4eefd6cff536d4bd0b247ecbf0d650c29a11c70))

## [1.16.4](https://github.com/lemonadesocial/web-new/compare/v1.16.3...v1.16.4) (2025-05-02)


### Bug Fixes

* remove button backdrop ([4611355](https://github.com/lemonadesocial/web-new/commit/4611355fe5cfab01199d2b45c1c3ae8774142038))

## [1.16.3](https://github.com/lemonadesocial/web-new/compare/v1.16.2...v1.16.3) (2025-05-02)


### Bug Fixes

* styles ([1b3b95a](https://github.com/lemonadesocial/web-new/commit/1b3b95abc258cc6c0c9993781c95e6512e4cb3aa))

## [1.16.2](https://github.com/lemonadesocial/web-new/compare/v1.16.1...v1.16.2) (2025-05-02)


### Bug Fixes

* collectibles per ticket ([9c3d6c7](https://github.com/lemonadesocial/web-new/commit/9c3d6c706240a9a45d946cf777268410615ed0e7))

## [1.16.1](https://github.com/lemonadesocial/web-new/compare/v1.16.0...v1.16.1) (2025-05-02)


### Bug Fixes

* copy ([d2fc4af](https://github.com/lemonadesocial/web-new/commit/d2fc4af4a1aa7dd60a693ed704690c607be1c764))

## [1.16.0](https://github.com/lemonadesocial/web-new/compare/v1.15.0...v1.16.0) (2025-05-02)


### Features

* event collectible ([94b4535](https://github.com/lemonadesocial/web-new/commit/94b45358d2760fc487a0def93558827dc2470901))

## [1.15.0](https://github.com/lemonadesocial/web-new/compare/v1.14.0...v1.15.0) (2025-05-02)


### Features

* add access to event pane ([a341967](https://github.com/lemonadesocial/web-new/commit/a34196760c213e7ead7b0b4b9f1b38b8999cd6d7))
* add appkit ([44a4738](https://github.com/lemonadesocial/web-new/commit/44a473839331c1a59ebd27c60bead86520548577))
* add approval card ([723f9fc](https://github.com/lemonadesocial/web-new/commit/723f9fcfbcacbaf674b2c096fff8d25c9a3011d0))
* add asset prefix ([a80b6f6](https://github.com/lemonadesocial/web-new/commit/a80b6f6996179d615033a3bd627b3f17c9070b5e))
* add attendees section ([4f8af81](https://github.com/lemonadesocial/web-new/commit/4f8af81f628070ed069b1cf3e0688aa65441ddd4))
* add build output ([c1dd896](https://github.com/lemonadesocial/web-new/commit/c1dd89632de341cfe21c6ca728db2fdbefe52826))
* add connect modal ([a7abc3c](https://github.com/lemonadesocial/web-new/commit/a7abc3c7e4e4fd62e1f125d34290e49c02795417))
* add coupon ([cb05e0a](https://github.com/lemonadesocial/web-new/commit/cb05e0ac1eaa083135c95b7643bb0d1469e9b7b4))
* add default active event type ([8bb78b9](https://github.com/lemonadesocial/web-new/commit/8bb78b95b2c2dfb4c5624819da3cdf70f9854f1e))
* add dice avatar ([1ec735d](https://github.com/lemonadesocial/web-new/commit/1ec735d05d30e3dc3d6a687ad6fe3add45858689))
* add doc ([87da503](https://github.com/lemonadesocial/web-new/commit/87da5035c1d5568a8437f1edd7f0357a35335e14))
* add drawer component ([6c3f26c](https://github.com/lemonadesocial/web-new/commit/6c3f26c0da25d26c0cd3819d64e334dce5019d58))
* add empty state event list ([9121955](https://github.com/lemonadesocial/web-new/commit/9121955ea390f02a0b741f5d3bffc6c39164fc0c))
* add event route for proxy ([288d2a0](https://github.com/lemonadesocial/web-new/commit/288d2a0cdfc63377696f47f59739e66858375c50))
* add form handles ([d070f3f](https://github.com/lemonadesocial/web-new/commit/d070f3fb22c714b80c5ae4c08724ccfc4c8669f1))
* add list chains and correct price format ([19fa723](https://github.com/lemonadesocial/web-new/commit/19fa7230e1a2221bbb60ab474c2d40f495d6c217))
* add multi select component ([c587d10](https://github.com/lemonadesocial/web-new/commit/c587d10f4b1854e292a09eb9f6f25395761c1705))
* add shader styles ([8ce7e4a](https://github.com/lemonadesocial/web-new/commit/8ce7e4aa70d398ff4a1a88bfca24d47860f82883))
* add starts in ([d3b8637](https://github.com/lemonadesocial/web-new/commit/d3b8637f1b1065068156cdb5a21d3576e0483b90))
* add stripe card ([576636a](https://github.com/lemonadesocial/web-new/commit/576636a36d9b853981a891c2f30767aa94ae39ea))
* add ticket card ([2d2db70](https://github.com/lemonadesocial/web-new/commit/2d2db701d71aa284f48f23bd9b16381effa2e50a))
* add to calendar ([3426057](https://github.com/lemonadesocial/web-new/commit/34260574fc7b9b4926d6a759bf665c525339193b))
* add user form ([58817b0](https://github.com/lemonadesocial/web-new/commit/58817b0b51b6f09ebf5b57f95a0ac2246bc1efb3))
* button state ([14acd4b](https://github.com/lemonadesocial/web-new/commit/14acd4b76e90be2700685d0ab27964813d9300f0))
* card payment ([a28f69e](https://github.com/lemonadesocial/web-new/commit/a28f69ebbb5dd07c98193727486d1ac986c350fc))
* check allow domain can access path ([4191897](https://github.com/lemonadesocial/web-new/commit/419189729539dc42e1ddce022684a1d8bb080733))
* check assets source ([0a28f14](https://github.com/lemonadesocial/web-new/commit/0a28f14cced685cc4bb7fb229cc58208eb15aa26))
* check can select color pick ([18766e0](https://github.com/lemonadesocial/web-new/commit/18766e0243cf8777241618b8e541f399f60756ac))
* check static path ([ca7c353](https://github.com/lemonadesocial/web-new/commit/ca7c3536a8279c6f1e711c619cf1b6e7de9c1144))
* checking app ([bbe657e](https://github.com/lemonadesocial/web-new/commit/bbe657eccaf63f651d5b965802bf0777a88ed91d))
* checking pass proxy ([5692a0e](https://github.com/lemonadesocial/web-new/commit/5692a0e4c515d9499f2b2d8359658ba8ff119ebb))
* checking static build ([fe60930](https://github.com/lemonadesocial/web-new/commit/fe609304082894d67aac8b8651806f3df4bc059c))
* checking static path ([3d74700](https://github.com/lemonadesocial/web-new/commit/3d747009b110f2cae5dbe961bc5bf26df7deaa3a))
* convert providers to hooks ([d1ce300](https://github.com/lemonadesocial/web-new/commit/d1ce300399e93396118e8143b99806d649f56356))
* crypto payment ([2a34e23](https://github.com/lemonadesocial/web-new/commit/2a34e23afe2c427b894021ce863b92f5042e3bf5))
* **deploy:** add deployment workflows ([abca7e6](https://github.com/lemonadesocial/web-new/commit/abca7e67851b07e1a48fd5a372c34ffe22f001e5))
* **deploy:** inject GitHub variables to env ([fbe969a](https://github.com/lemonadesocial/web-new/commit/fbe969ab102f66144f6429ed83205d943dca2826))
* direct transfer ([9477b03](https://github.com/lemonadesocial/web-new/commit/9477b031c9d3a4bb2c4508582f9699aeeddf4907))
* disable map gesture ([ceda157](https://github.com/lemonadesocial/web-new/commit/ceda157ca5e6c3717c1d366577e5d1f7d1305809))
* disable next img lint rule ([b1470ac](https://github.com/lemonadesocial/web-new/commit/b1470ac2bb89ad3d02cdcef1d92720d637cf53c7))
* disable root page ([830899a](https://github.com/lemonadesocial/web-new/commit/830899a81beee470ee548ec6323cbce63681ffa6))
* **docker:** remove public read acl when sync files ([6b2a523](https://github.com/lemonadesocial/web-new/commit/6b2a5238e82c9074f32bf6db93c14fa535915d44))
* event registration ([77ffd4a](https://github.com/lemonadesocial/web-new/commit/77ffd4a03c7e557febaab728a19bc05c6802b6b9))
* fetch ticket price ([3c72eab](https://github.com/lemonadesocial/web-new/commit/3c72eaba2265aaca53d6d0c557e28f31559656e8))
* graphql subscription ([eadce29](https://github.com/lemonadesocial/web-new/commit/eadce293b66a97e863f7d82f3a9004d16e7c751d))
* handle relay payment ([c502e13](https://github.com/lemonadesocial/web-new/commit/c502e139c79b00c049bc40a1d38c0d79193710ca))
* hide card payment ([03851f9](https://github.com/lemonadesocial/web-new/commit/03851f95ed8668d746af7eb224689474d2ad94ec))
* host view of event guest ([20228c3](https://github.com/lemonadesocial/web-new/commit/20228c3ebfb39fae6b2fe1e6eaa80350d3c5f6c0))
* implement full page event guest side ([81d4c8c](https://github.com/lemonadesocial/web-new/commit/81d4c8c65aeb63b6d215d1dfb0b3a99f92522d88))
* invite friends ([050e29b](https://github.com/lemonadesocial/web-new/commit/050e29b52c85a6527a8f92ca27701022ba6de6d0))
* merge master ([6dce3bf](https://github.com/lemonadesocial/web-new/commit/6dce3bf82f0c6ab7d601508a7beca87c69a35690))
* my ticket ([266a5d4](https://github.com/lemonadesocial/web-new/commit/266a5d44ae5028496dd06693f331cfcfb4068e9f))
* new modal instance ([14ae0c6](https://github.com/lemonadesocial/web-new/commit/14ae0c6ca0bfed2d18e1937b49395b5552ed1738))
* oauth2 ([ffe967b](https://github.com/lemonadesocial/web-new/commit/ffe967b978a1d092479bf4255860c533cbf0372d))
* open multiple modals ([8cedbfa](https://github.com/lemonadesocial/web-new/commit/8cedbfa3e04c5d6da4b06ea21cf487195840d560))
* order summary ([4da16ec](https://github.com/lemonadesocial/web-new/commit/4da16ec07445aea9bc56775cd647f992073a64ae))
* pay by saved cards ([cb2c81a](https://github.com/lemonadesocial/web-new/commit/cb2c81a70a031a9cc7df28db97e1fb7e6afad1f2))
* pre-rsvp ([822bd04](https://github.com/lemonadesocial/web-new/commit/822bd046570d2128fd66eaee7a9e56e2f0994b74))
* redeem tickets ([21db7ff](https://github.com/lemonadesocial/web-new/commit/21db7ff57b27d85ac2ff6d2fe27f71e9f2d56c65))
* refactor pattern theming ([697e478](https://github.com/lemonadesocial/web-new/commit/697e478c89582c78dda196a4ab43c7bb94f5e620))
* rename env ([eb485bb](https://github.com/lemonadesocial/web-new/commit/eb485bbe4d2049a954c7b0897fba1075d5e1f268))
* request sent modal ([8a06aac](https://github.com/lemonadesocial/web-new/commit/8a06aac6814329cd0cf91424dd1a36d3fb8a4005))
* resolve feedback ([d8c02e1](https://github.com/lemonadesocial/web-new/commit/d8c02e12e03701936ca37ee76144e68d5c24d484))
* rsvp flow ([8c3ab7b](https://github.com/lemonadesocial/web-new/commit/8c3ab7b38d9406bc7839904f261b50851eb65b4a))
* save card ([9fff09f](https://github.com/lemonadesocial/web-new/commit/9fff09f4cdbb1124b2ea78c3639b4170c4dca42d))
* select random pattern ([5bd83e0](https://github.com/lemonadesocial/web-new/commit/5bd83e0e4f63f64f5a49d0e3a400d889e89f7242))
* select tickets ([70a9d91](https://github.com/lemonadesocial/web-new/commit/70a9d9197801722cab11120b65a06b795de54eae))
* setup project ([b6e90c7](https://github.com/lemonadesocial/web-new/commit/b6e90c71d6d43e6ce02e54738d6a82cfd587e129))
* setup test ([0f3b5ae](https://github.com/lemonadesocial/web-new/commit/0f3b5aeff43d59b9ae1062171108a5d39bea8daf))
* staking ([cc282f7](https://github.com/lemonadesocial/web-new/commit/cc282f78f2f7c1d704a806c2905c308208fb2c99))
* submit application form ([6986cea](https://github.com/lemonadesocial/web-new/commit/6986cea8d90e9aeef7914cd831feda3887a57de4))
* updat favicon and metadata ([537c850](https://github.com/lemonadesocial/web-new/commit/537c850304606b6f56614250f34f996d5eb39acc))
* update accordion component ([9cc493a](https://github.com/lemonadesocial/web-new/commit/9cc493a8dd0be25acdef4971911c0b78c116b176))
* update auth controller ([c0099ef](https://github.com/lemonadesocial/web-new/commit/c0099efca21d1abdab6d4704d3324d74391d8f7f))
* update auth flow ([200f453](https://github.com/lemonadesocial/web-new/commit/200f453c960c22674de6c98b78076e08d101868b))
* update avatar size - event info ([ae23a98](https://github.com/lemonadesocial/web-new/commit/ae23a989a2074a7e0c27de7f01c76167c982dfcf))
* update basic default light theme ([5e54f7f](https://github.com/lemonadesocial/web-new/commit/5e54f7fce56e959f567f2d541ae6f999d57ab884))
* update blur on button, card, and menu components ([1bcead0](https://github.com/lemonadesocial/web-new/commit/1bcead0aede2d994c2f6bcac12db859ffc8c68b4))
* update branch ([892ca61](https://github.com/lemonadesocial/web-new/commit/892ca61aeb8b79712c191e87dfbef50b06fde2e2))
* update card action ([89bb1d7](https://github.com/lemonadesocial/web-new/commit/89bb1d719a9f0c1d30dded95186b6ee14573ea1d))
* update color based on dark or light ([7c4d540](https://github.com/lemonadesocial/web-new/commit/7c4d540eca0c4ae1f266290bc184494603324924))
* update color vars ([b117d96](https://github.com/lemonadesocial/web-new/commit/b117d96fa04a40103e2042b9e7bd1e4fc03b57cf))
* update commnuity root ([183af91](https://github.com/lemonadesocial/web-new/commit/183af91daed84b0d08e06f6a7be25dfa6c2305cc))
* update env ([3802325](https://github.com/lemonadesocial/web-new/commit/3802325619628f008f93ee50e9ee0e79f8952ff8))
* update env ([a8b5310](https://github.com/lemonadesocial/web-new/commit/a8b5310c658532644d6faaafa3f63fd2edd1298c))
* update env ([986eb62](https://github.com/lemonadesocial/web-new/commit/986eb622f57ac04e0bb77fc8da74b585d1774394))
* update event pane ([c0b4ce6](https://github.com/lemonadesocial/web-new/commit/c0b4ce6965fcc36abd8b7976b64f3828c099c8c0))
* update event pane ([29c7779](https://github.com/lemonadesocial/web-new/commit/29c777974c3473af96ee87e1bb86b73d4352598e))
* update font scale full page event detail ([4b9ee9b](https://github.com/lemonadesocial/web-new/commit/4b9ee9b7ed10e3157374b7a81afb1284bd0a4c5e))
* update fonts, colors, apply theming ([e35f2df](https://github.com/lemonadesocial/web-new/commit/e35f2df08332123aba34d07e6a80b8999beb4a4b))
* update form title ([ea2092d](https://github.com/lemonadesocial/web-new/commit/ea2092ddfdd2bf2c1bc3c4cad9de40e4bdc0db86))
* update gradient theming ([af6ca90](https://github.com/lemonadesocial/web-new/commit/af6ca9083315e6ad74fc86bb4b2e4914198511e4))
* update graphql client ([adbc7e8](https://github.com/lemonadesocial/web-new/commit/adbc7e892072fc1cc45fb98d0ab25abf8b7f6f09))
* update health check ([37b7ad4](https://github.com/lemonadesocial/web-new/commit/37b7ad49795b7b9d713fcc3932f58bab4fdd22cc))
* update hover state top profile ([2c72ca2](https://github.com/lemonadesocial/web-new/commit/2c72ca288628ac8b96220188928381a10cfbe4fd))
* update hover state when had action on MenuItem ([0bb0436](https://github.com/lemonadesocial/web-new/commit/0bb0436d6322b01a00a7348db480510a194026a4))
* update inputs ([8d5acaa](https://github.com/lemonadesocial/web-new/commit/8d5acaac57b36b3662f3e32296bf1c5c61eb0910))
* update lint rule ([128a851](https://github.com/lemonadesocial/web-new/commit/128a851b7350862fe42792e86313c7c6ad9365f9))
* update listing event ([1b93262](https://github.com/lemonadesocial/web-new/commit/1b93262704a561ec3d53de2950625cbf8a460e9d))
* update menu content style ([496f996](https://github.com/lemonadesocial/web-new/commit/496f9968c5175d0c866a773a2bc33867bec81e95))
* update menu items ([386307d](https://github.com/lemonadesocial/web-new/commit/386307d3229dc0ff3c2407a067c5eecebdd901dd))
* update metadata for community ([ca48009](https://github.com/lemonadesocial/web-new/commit/ca480095247a07080beb2c1e8e890185bdeeff7d))
* update mobile rsvp ([97637e6](https://github.com/lemonadesocial/web-new/commit/97637e697285c1c1d660501205e358cabc3d9f6c))
* update mobile view main hub ([3aba955](https://github.com/lemonadesocial/web-new/commit/3aba9553bb004ac2df7408f35d994760eb5d3722))
* update modal styles ([469a846](https://github.com/lemonadesocial/web-new/commit/469a846fcb1af95fd2873b6878578584d91ac7b7))
* update my event requests ([4e24951](https://github.com/lemonadesocial/web-new/commit/4e2495155d135df7a717e09e0016db835c0696cf))
* update options - rm unused ([21d021d](https://github.com/lemonadesocial/web-new/commit/21d021d7f7a669a6a90850d265bf4263d490fa93))
* update preset colors ([6ee5def](https://github.com/lemonadesocial/web-new/commit/6ee5defa083d4a540a6b9b96afda58583b93e131))
* update process tickets ([1779276](https://github.com/lemonadesocial/web-new/commit/177927690bbd5cf13c196373dff2e68ab656ea7e))
* update router ([54b4a9d](https://github.com/lemonadesocial/web-new/commit/54b4a9d35a24186b4978c5a4e427b7b81b727092))
* update shader ([93b67e3](https://github.com/lemonadesocial/web-new/commit/93b67e3df9293fa3be1eb9740d60841a88c315af))
* update shader config ([64c2757](https://github.com/lemonadesocial/web-new/commit/64c275705374c3e5b1e289b72b8dce0849305852))
* update signed out state ([b589d4b](https://github.com/lemonadesocial/web-new/commit/b589d4b0985278d4094d85dd6aab79d384f487ed))
* update theme builder ([3990ff3](https://github.com/lemonadesocial/web-new/commit/3990ff35513b5a5ab51c47168418cfa0c51b7c0f))
* update theme pattern ([75fe234](https://github.com/lemonadesocial/web-new/commit/75fe2344b76b05522fca071e0e8d8f594939a89a))
* update theming ([5908b1e](https://github.com/lemonadesocial/web-new/commit/5908b1eab6e9df17f2aba19d4564d668972256a0))
* update timezone ([741c9eb](https://github.com/lemonadesocial/web-new/commit/741c9ebb21b760b0447a3a2d9f469c3a8e191ca1))
* update toast component ([390fdb8](https://github.com/lemonadesocial/web-new/commit/390fdb8af739ba7d5448897f61ea2de77f615e2a))
* update toggle date ([5772bc6](https://github.com/lemonadesocial/web-new/commit/5772bc62a4b6228a34f6551aea521d5af6f41ec0))
* update UI listing event ([613d11c](https://github.com/lemonadesocial/web-new/commit/613d11c2431abe5073d7591aaa576451113131de))
* write query ([b8a332b](https://github.com/lemonadesocial/web-new/commit/b8a332b0feebfd0ca1b5b011791e51c83ad1b42c))


### Bug Fixes

* add blur segment container ([464618e](https://github.com/lemonadesocial/web-new/commit/464618e620a580a81d7a5e11350569f05996cb48))
* add host and cohosts info to event ([8de7095](https://github.com/lemonadesocial/web-new/commit/8de70958520bc32ed74885ee00461db30395b0df))
* allow only guest can subcribe hub ([fec01b4](https://github.com/lemonadesocial/web-new/commit/fec01b40159f9b71ef27d245d6f3ee38372ab5c6))
* approval status ([77a65c0](https://github.com/lemonadesocial/web-new/commit/77a65c03216861f1c21841c00309b838610caa15))
* asset prefix ([35dc70a](https://github.com/lemonadesocial/web-new/commit/35dc70a60319d5f479cf51d92427a27dbacecd7f))
* asset prefix ([58be5eb](https://github.com/lemonadesocial/web-new/commit/58be5eb2423ef2778a02ae6729f9d95949b5ce91))
* assign tickets not updating tickets data ([ec17b3d](https://github.com/lemonadesocial/web-new/commit/ec17b3d74cdb58850d194cde82afcdc47217d932))
* avatar ([dc3ae2f](https://github.com/lemonadesocial/web-new/commit/dc3ae2f0bec3bbf0e9c6dd5e2efc8d7c99d2f130))
* avatar image style event detail ([38568e5](https://github.com/lemonadesocial/web-new/commit/38568e5c9e2d4d4b42b3cdcb5a9e04bb99d083ef))
* blend black color ([fd827bc](https://github.com/lemonadesocial/web-new/commit/fd827bc1a253945f4bf340c5089accb069be559c))
* border button ([52fc421](https://github.com/lemonadesocial/web-new/commit/52fc4213f3950cc1bf0f01f515acc035e8c9a5a9))
* buy free and stripe tickets ([763e358](https://github.com/lemonadesocial/web-new/commit/763e358389cb96693c61e1259ee2172b6805242d))
* can not resolve client module ([3baa6a1](https://github.com/lemonadesocial/web-new/commit/3baa6a1f54ea01ad67e40ccb5094e2a843a27896))
* cannot apply code 100% ([23ac6ba](https://github.com/lemonadesocial/web-new/commit/23ac6bacd6b0691a6657be68f2a3978ef30f8a9f))
* change multi instance client from ssr ([6fc2850](https://github.com/lemonadesocial/web-new/commit/6fc28501636900278d82456def18c84fa5a16cdd))
* change tertiary to primary ([237368e](https://github.com/lemonadesocial/web-new/commit/237368edb3f7802a89ce95326a6ed7b71bda11c7))
* chech http2 ([c4912de](https://github.com/lemonadesocial/web-new/commit/c4912debdbda04020fb52881033177068297b6f5))
* check block time with tz ([7b3b734](https://github.com/lemonadesocial/web-new/commit/7b3b7344b7ab47ed390a095aff2e32735b257a6c))
* check empty theme ([c9b1258](https://github.com/lemonadesocial/web-new/commit/c9b12587aafdd97a2eaf44af67ad15abcf69416f))
* check env build flow ([ac30c70](https://github.com/lemonadesocial/web-new/commit/ac30c70bdc6a0170399b118994e3d0fc98ffca01))
* check missing context ([967028d](https://github.com/lemonadesocial/web-new/commit/967028da444595ffa790fc14167f92ad907a2cd5))
* check missing theme data when init load ([b31d9f7](https://github.com/lemonadesocial/web-new/commit/b31d9f7f17c1100e56a827ce32c3b5c66857f720))
* check reset correct theme ([06a3975](https://github.com/lemonadesocial/web-new/commit/06a39753c5c5f185d379cd02ba63146879a7e037))
* check size avatar ([9ec00c5](https://github.com/lemonadesocial/web-new/commit/9ec00c5e2a1cffb06df6f70a70a86e27eaaa3386))
* check wrong req ([e7832e7](https://github.com/lemonadesocial/web-new/commit/e7832e7ebefa3f63c701dd57be8e2ecc306b8329))
* checking host req ([936a635](https://github.com/lemonadesocial/web-new/commit/936a635e23726f205ec8ae7c51eac4da2e239274))
* click on modal close dialog ([fd3da72](https://github.com/lemonadesocial/web-new/commit/fd3da72bf19e4d3a7f184e0c9d5a5c9247011344))
* content menu item ([12bf338](https://github.com/lemonadesocial/web-new/commit/12bf338cb3f8bd46f3ddc06b017eb2618b5a2cdb))
* correct payment account ([74dec5a](https://github.com/lemonadesocial/web-new/commit/74dec5ac64a050650a3fa1e7a24f3ce9879e79bd))
* cover blend background ([99071b3](https://github.com/lemonadesocial/web-new/commit/99071b3ec6d6f80ab25509ce8c194a3e7f953093))
* create portal for modal ([7b1ca79](https://github.com/lemonadesocial/web-new/commit/7b1ca796c0b0bb74ea796588c802f13792f00dd8))
* **deploy:** add missing Docker file & docker bake config ([166fc71](https://github.com/lemonadesocial/web-new/commit/166fc711ce8582c94e784828d694baeb005bbcb5))
* **deploy:** fix getting env values from GitHub vars ([d499b66](https://github.com/lemonadesocial/web-new/commit/d499b66cd818e4aaa6bb745f476be1823257de3f))
* disable drag on content bottomsheet ([9c72b38](https://github.com/lemonadesocial/web-new/commit/9c72b383bd0488375ea4de11277b3080c077ab97))
* discount application ([616f679](https://github.com/lemonadesocial/web-new/commit/616f67933146f644e0f00819cd8b9c96935914eb))
* drawer bg ([3d10365](https://github.com/lemonadesocial/web-new/commit/3d10365f8937dea994d76d2e9b2fedf7b9faff57))
* error state theming ([d90100b](https://github.com/lemonadesocial/web-new/commit/d90100b1e2920b1e059359abd6023540708a50c2))
* event issues ([5930930](https://github.com/lemonadesocial/web-new/commit/593093084d38a4445a29b2fe54bfee929f8bc3d1))
* gesture handle map ([0748f98](https://github.com/lemonadesocial/web-new/commit/0748f986e393a1a6b59b95f4f520b771c0246930))
* get ticket types args cache ([1644250](https://github.com/lemonadesocial/web-new/commit/16442502788b48394daf360064b701f78cfc0b60))
* get ticket types network only ([31c511c](https://github.com/lemonadesocial/web-new/commit/31c511c8efce5f19437933809ed11353ff5a10bd))
* group image ([6a57990](https://github.com/lemonadesocial/web-new/commit/6a57990a3d587c1adc9e60cf46c8bf3e80acfa2d))
* group image ([fa5e897](https://github.com/lemonadesocial/web-new/commit/fa5e8972e7289c13b6c16e699e82a24049753a7e))
* handle signin ([b2a4d40](https://github.com/lemonadesocial/web-new/commit/b2a4d40fb0f166b36bc4361847c2485c1ed4df36))
* hide cover photo in gallery ([6857683](https://github.com/lemonadesocial/web-new/commit/68576831fcbf4636a6ede72b45c8d4cdf175afb4))
* hide event access for host ([deaa651](https://github.com/lemonadesocial/web-new/commit/deaa651506df038e0935e6d480e880412c675155))
* hide location when unknow ([bac9143](https://github.com/lemonadesocial/web-new/commit/bac9143ce1722241eb0e6346e664673ebc7d997d))
* hide sub events instead empty state ([97d107e](https://github.com/lemonadesocial/web-new/commit/97d107e81f74bfac533288e8409b9bd9d053846d))
* hover state full container ([a40f32e](https://github.com/lemonadesocial/web-new/commit/a40f32ed37511fe25cff422838f35ec1a87a49ad))
* increase image resolution image avatar ([fe822a0](https://github.com/lemonadesocial/web-new/commit/fe822a0737f05120b27ea9a0ac8a17066fc465f7))
* infinite get whoami ([176809e](https://github.com/lemonadesocial/web-new/commit/176809e28a8706d0340fc8bb76e680ccb9fbb70e))
* init appkit after chains loaded ([a5155d4](https://github.com/lemonadesocial/web-new/commit/a5155d4019a0f8ed416249aaf13ca6a328aa7c34))
* lint code ([8ceb070](https://github.com/lemonadesocial/web-new/commit/8ceb07075209d9fe958de99d80dd76560298b5d8))
* lint code ([60d1d7c](https://github.com/lemonadesocial/web-new/commit/60d1d7cfa41bc785c9375704d10b591d85007417))
* lint code ([51ba0e4](https://github.com/lemonadesocial/web-new/commit/51ba0e4fd14bb265c6703aa34a129726a859d7fc))
* lint code ([c6af4ee](https://github.com/lemonadesocial/web-new/commit/c6af4ee455fc16f48bcc8101d9f13fdc13765139))
* lint code ([58e7e4b](https://github.com/lemonadesocial/web-new/commit/58e7e4b211f67abc03d4420507baf7dbacbfbd7c))
* lint code ([8e28d5b](https://github.com/lemonadesocial/web-new/commit/8e28d5bd44809783562192d67d2c6a7b4de5ba7e))
* lint code ([ac6451d](https://github.com/lemonadesocial/web-new/commit/ac6451db496c2c8bda2e37be45f72368383b00fd))
* lint code ([318a029](https://github.com/lemonadesocial/web-new/commit/318a029c8ab6e0d3a0da91c2c228e33b5fd2751b))
* load default custom color ([03ac128](https://github.com/lemonadesocial/web-new/commit/03ac1284db1bdc17739b058340e5dbb5c6392002))
* lock body scroll mobile ([caf1583](https://github.com/lemonadesocial/web-new/commit/caf15831fe0065182f06668786e92a924f494d8f))
* merge default config theme_data ([46a2545](https://github.com/lemonadesocial/web-new/commit/46a254541cc63fd715912bed3d08176f947f9803))
* middleware rewrites assets path ([e47f371](https://github.com/lemonadesocial/web-new/commit/e47f37155c4e24f4eccd3b2ce8ee58074da07ad4))
* miss action manage event ([345bef4](https://github.com/lemonadesocial/web-new/commit/345bef42da509d139e3db287f75a1bd7b4ab80d4))
* miss sub hub at root ([8d2ced9](https://github.com/lemonadesocial/web-new/commit/8d2ced92343354764b576ff7348e8ffd8623e42d))
* missing close sheet after save ([31a26a4](https://github.com/lemonadesocial/web-new/commit/31a26a48b233762704ef3daf1d18a19b326cdfd0))
* missing code merge ([d605674](https://github.com/lemonadesocial/web-new/commit/d6056740ceaa72e044d946585f621499d409cfd4))
* missing community metadata ([68f2457](https://github.com/lemonadesocial/web-new/commit/68f2457fd95f9297c611e3b177bd05c3406850b3))
* missing config ([b21e2a2](https://github.com/lemonadesocial/web-new/commit/b21e2a2051bc80e4c01b5331db708803fb2cf579))
* missing data config ([2c6d9b3](https://github.com/lemonadesocial/web-new/commit/2c6d9b3643d04e53b7129fc09b9ee10436734470))
* missing entity key ([7fde7eb](https://github.com/lemonadesocial/web-new/commit/7fde7eb0f385e02ed584833affd6a6fdedf84228))
* missing envs ([8259435](https://github.com/lemonadesocial/web-new/commit/8259435469f05ed206fcffa4cc20c432c16ad049))
* missing event field codegen ([00e2505](https://github.com/lemonadesocial/web-new/commit/00e2505323047c20af9bd1f4627802f4d95ed600))
* missing event props ([3128cb6](https://github.com/lemonadesocial/web-new/commit/3128cb643b90796939f812e992e0d1b0cb773e72))
* missing sub hub ([fb26bcf](https://github.com/lemonadesocial/web-new/commit/fb26bcf8c80beab577d78cd17cbadbbc8a94b727))
* missing variables ([6e6aa45](https://github.com/lemonadesocial/web-new/commit/6e6aa459dce879306e2d91dc894332fc26434601))
* mobile screen ([6108c2d](https://github.com/lemonadesocial/web-new/commit/6108c2d9dfdd347589af487a75259e3a1721764c))
* mobile width on community ([e12538f](https://github.com/lemonadesocial/web-new/commit/e12538fa39b5b924c8793ae940eb48ef4f881dc1))
* move shader file ([7d019eb](https://github.com/lemonadesocial/web-new/commit/7d019ebda3dfb0936620d52e68011dcaab2acf4a))
* nullable space ([84b9a81](https://github.com/lemonadesocial/web-new/commit/84b9a811b65d259e70e73b92039678139887c037))
* nullable space ([4a343b2](https://github.com/lemonadesocial/web-new/commit/4a343b216a558309373e3dc9c2b5595de6c71437))
* number input button color ([52d1d96](https://github.com/lemonadesocial/web-new/commit/52d1d963e055a790b222aa47b8e1855d3663ab81))
* optimize load fonts ([63ff535](https://github.com/lemonadesocial/web-new/commit/63ff535c450135ae839caa0573af2805a9730572))
* overlap cover image ([998e2bd](https://github.com/lemonadesocial/web-new/commit/998e2bdaa32a382fd6ea3ddb2df74b0383d0247c))
* query space ([ba7a1a0](https://github.com/lemonadesocial/web-new/commit/ba7a1a0cef9953d4c3c16fd6cf86482fe4970ca0))
* remove hover date cannot select ([f531dae](https://github.com/lemonadesocial/web-new/commit/f531daebb132e9148241e8fcdd9a6ab5ef5234c1))
* remove unused ([bbf08e7](https://github.com/lemonadesocial/web-new/commit/bbf08e7c8f230cdf1019cf2b9771df06bc9a0c7b))
* remove unused ([b8751f9](https://github.com/lemonadesocial/web-new/commit/b8751f9bad5fe40ea09794c8461d328753592ff6))
* remove unused ([7114c75](https://github.com/lemonadesocial/web-new/commit/7114c752c31c85f67af92b9355f4cec2a2c8101b))
* remove unused ([e0a43e5](https://github.com/lemonadesocial/web-new/commit/e0a43e5077a4b8296673eb5ec3fac4a3b89d67dd))
* remove unused styling ([9e60531](https://github.com/lemonadesocial/web-new/commit/9e605317aa43e2c3ed1ecf1e70c483ee48c9add3))
* request subscribe issue ([096db4c](https://github.com/lemonadesocial/web-new/commit/096db4cf0770de02a51577464544eb75a1d04642))
* reset class value when switch theme ([50ff1e3](https://github.com/lemonadesocial/web-new/commit/50ff1e39e57174b4e9cb3e40b72a2972361c23ec))
* reset theme ([721e2ea](https://github.com/lemonadesocial/web-new/commit/721e2ea32074eca99c94f8400c7e1461829a25a4))
* resolve feedback ([fb58009](https://github.com/lemonadesocial/web-new/commit/fb580093490422032626212029cddd54967f2f27))
* revert ([ff5ccec](https://github.com/lemonadesocial/web-new/commit/ff5ccec14ab100f736fa69463b24c7ffd3c00a6f))
* revert ([a45b681](https://github.com/lemonadesocial/web-new/commit/a45b681f1c291a6284194063cffcd4270d3d6c68))
* revert ([bde032d](https://github.com/lemonadesocial/web-new/commit/bde032d68161009cae3ce8743886037023a7ae1b))
* revert middleware after merge ([d753ff4](https://github.com/lemonadesocial/web-new/commit/d753ff4766d948ec78fc9e4feb814490419a6de9))
* rounded community avatar - hide location rsvp ([ef6d29f](https://github.com/lemonadesocial/web-new/commit/ef6d29fb5d757faed8046b0bf0b680a93fd0ce9e))
* rsvp flow ([f2796b5](https://github.com/lemonadesocial/web-new/commit/f2796b551676e65e16b6f5fcff9f83eeab32fbd2))
* set default font menu component ([46dd0e3](https://github.com/lemonadesocial/web-new/commit/46dd0e38c4c8f47eb398748870918b9a26bf73c2))
* show short location ([0664117](https://github.com/lemonadesocial/web-new/commit/0664117545deeb501dbcd2f32bc110683b5f17aa))
* sticky right col ([bd19c4b](https://github.com/lemonadesocial/web-new/commit/bd19c4bbd47451b494dec9e4b453a5e173a6305c))
* success color ([05e13fa](https://github.com/lemonadesocial/web-new/commit/05e13fa0056c6e6de276f934fe6c23f1a0f050d3))
* temp prevent sheet ([aae7547](https://github.com/lemonadesocial/web-new/commit/aae7547fa492849ec595522fe36f17890ef9d964))
* temp to check path hostname ([a690ff8](https://github.com/lemonadesocial/web-new/commit/a690ff85aeb3d98db75f87b176ace52ad0eb4820))
* truncate location ([26982b5](https://github.com/lemonadesocial/web-new/commit/26982b5b40575d4a190f33392c8b197c14a7f9aa))
* typo ([aa1fa67](https://github.com/lemonadesocial/web-new/commit/aa1fa67ef3fb0edcb183a80c13688415429dae3b))
* ui theme builder ([47e1830](https://github.com/lemonadesocial/web-new/commit/47e1830f3baed99fb2c4cbd0428ba9114f416e30))
* uncategorized tickets are shown ([c9cd1af](https://github.com/lemonadesocial/web-new/commit/c9cd1af7db1c782150c5d6967628f96f19739749))
* update accent color when select gradient ([3c3a5d9](https://github.com/lemonadesocial/web-new/commit/3c3a5d9da2a552fee1790329acdb2e6f0dfd5563))
* update bg bottomsheet ([836898d](https://github.com/lemonadesocial/web-new/commit/836898dc23463509e4187ac9c465def73fc17318))
* update bg color menu ([1b31454](https://github.com/lemonadesocial/web-new/commit/1b31454da5f385f3fa31fabccfaac1f57e690d53))
* update button signin style ([4531591](https://github.com/lemonadesocial/web-new/commit/45315911a31cc580700e0adda36babace21e2334))
* update default shader when select gradient theme ([5a78baf](https://github.com/lemonadesocial/web-new/commit/5a78bafce4515228b6580ade2fcfd7016aba83d5))
* update env ([5e2119a](https://github.com/lemonadesocial/web-new/commit/5e2119af5859cc6bb1919cc0e9a3caa38010dd76))
* update form theme builder ([a5092d7](https://github.com/lemonadesocial/web-new/commit/a5092d7fddd0d6246c674015df77b04860f2ccd1))
* update icons link social ([27386d1](https://github.com/lemonadesocial/web-new/commit/27386d1ba6ce72e237456d1bdeb25c14f1260d77))
* update image avatar community ([0e7edd9](https://github.com/lemonadesocial/web-new/commit/0e7edd9409131ccb4add600c156c1011fe93f0e5))
* update invert primary color on calendar ([550d166](https://github.com/lemonadesocial/web-new/commit/550d16656be55f32ae20a1b6db101b8ee95bcf1f))
* update layout bottom sheet mobile view ([e72b959](https://github.com/lemonadesocial/web-new/commit/e72b95945b905e4a03465ba5734569a366b5c143))
* update loading state event right pane ([d2f1ae8](https://github.com/lemonadesocial/web-new/commit/d2f1ae8424209cb6781e009ef951b8abf10f4411))
* update loading state event right pane ([7d1545d](https://github.com/lemonadesocial/web-new/commit/7d1545d082d21cc810ade65d55618a50550e6fa7))
* update menu strategy ([0d003e2](https://github.com/lemonadesocial/web-new/commit/0d003e2e7cebdcebb33d9fd7def8f92e1072f032))
* update pattern theme ([31623a3](https://github.com/lemonadesocial/web-new/commit/31623a364d62b162a6bdbeb8b3f200e57f52c748))
* update size event photo ([8b5200e](https://github.com/lemonadesocial/web-new/commit/8b5200e225f6ce92da2f9311d8f2c1ef50336e12))
* update static path ([432605e](https://github.com/lemonadesocial/web-new/commit/432605e460b4828a082e3c0e0e07e9995e370183))
* update sub hub router ([7369d6b](https://github.com/lemonadesocial/web-new/commit/7369d6b840ffc2498d21cffd6f63c1f78606ccb4))
* update text submit event ([cc54d7f](https://github.com/lemonadesocial/web-new/commit/cc54d7f98b349032b6d005e6fa23fa9f5d7cbb92))
* update tooltip icon social ([7b5c930](https://github.com/lemonadesocial/web-new/commit/7b5c930374c8c34d2b7859d75649c8e09530961b))
* update width on datetime/location event blocks ([575fa43](https://github.com/lemonadesocial/web-new/commit/575fa435c2810717f8317bcf5c5726e2e81e439b))
* use theme name instead of key ([1ec77a6](https://github.com/lemonadesocial/web-new/commit/1ec77a6b029dd6a553e44e6e1e05ba0b0572145f))
* write wrong data ([f73f1ed](https://github.com/lemonadesocial/web-new/commit/f73f1ed1fbfac03b6d4e6948133dcefc363a1e36))
* wrong check admins ([956a781](https://github.com/lemonadesocial/web-new/commit/956a781d6fcd0f0ab51ca15ed2018b53203fa351))
* wrong color footer calendar ([9741a92](https://github.com/lemonadesocial/web-new/commit/9741a9219159a2261be61934f163a829fcabfb2b))
* wrong color vars calendar ([ff281f1](https://github.com/lemonadesocial/web-new/commit/ff281f14ba1ea0ffb5a03c51ba7642268172f15d))

## [1.14.0](https://github.com/lemonadesocial/web-new/compare/v1.13.1...v1.14.0) (2025-05-02)


### Features

* disable map gesture ([ceda157](https://github.com/lemonadesocial/web-new/commit/ceda157ca5e6c3717c1d366577e5d1f7d1305809))


### Bug Fixes

* drawer bg ([3d10365](https://github.com/lemonadesocial/web-new/commit/3d10365f8937dea994d76d2e9b2fedf7b9faff57))
* gesture handle map ([0748f98](https://github.com/lemonadesocial/web-new/commit/0748f986e393a1a6b59b95f4f520b771c0246930))
* hide cover photo in gallery ([6857683](https://github.com/lemonadesocial/web-new/commit/68576831fcbf4636a6ede72b45c8d4cdf175afb4))

## [1.14.0](https://github.com/lemonadesocial/web-new/compare/v1.13.1...v1.14.0) (2025-05-02)


### Features

* disable map gesture ([ceda157](https://github.com/lemonadesocial/web-new/commit/ceda157ca5e6c3717c1d366577e5d1f7d1305809))


### Bug Fixes

* drawer bg ([3d10365](https://github.com/lemonadesocial/web-new/commit/3d10365f8937dea994d76d2e9b2fedf7b9faff57))

## [1.13.1](https://github.com/lemonadesocial/web-new/compare/v1.13.0...v1.13.1) (2025-05-02)


### Bug Fixes

* lock body scroll mobile ([caf1583](https://github.com/lemonadesocial/web-new/commit/caf15831fe0065182f06668786e92a924f494d8f))

## [1.13.0](https://github.com/lemonadesocial/web-new/compare/v1.12.2...v1.13.0) (2025-04-29)


### Features

* add starts in ([d3b8637](https://github.com/lemonadesocial/web-new/commit/d3b8637f1b1065068156cdb5a21d3576e0483b90))
* graphql subscription ([eadce29](https://github.com/lemonadesocial/web-new/commit/eadce293b66a97e863f7d82f3a9004d16e7c751d))
* update shader config ([64c2757](https://github.com/lemonadesocial/web-new/commit/64c275705374c3e5b1e289b72b8dce0849305852))


### Bug Fixes

* assign tickets not updating tickets data ([ec17b3d](https://github.com/lemonadesocial/web-new/commit/ec17b3d74cdb58850d194cde82afcdc47217d932))
* cannot apply code 100% ([23ac6ba](https://github.com/lemonadesocial/web-new/commit/23ac6bacd6b0691a6657be68f2a3978ef30f8a9f))
* show short location ([0664117](https://github.com/lemonadesocial/web-new/commit/0664117545deeb501dbcd2f32bc110683b5f17aa))

## [1.12.2](https://github.com/lemonadesocial/web-new/compare/v1.12.1...v1.12.2) (2025-04-25)


### Bug Fixes

* check reset correct theme ([06a3975](https://github.com/lemonadesocial/web-new/commit/06a39753c5c5f185d379cd02ba63146879a7e037))

## [1.12.1](https://github.com/lemonadesocial/web-new/compare/v1.12.0...v1.12.1) (2025-04-25)


### Bug Fixes

* remove unused ([bbf08e7](https://github.com/lemonadesocial/web-new/commit/bbf08e7c8f230cdf1019cf2b9771df06bc9a0c7b))
* update text submit event ([cc54d7f](https://github.com/lemonadesocial/web-new/commit/cc54d7f98b349032b6d005e6fa23fa9f5d7cbb92))
* use theme name instead of key ([1ec77a6](https://github.com/lemonadesocial/web-new/commit/1ec77a6b029dd6a553e44e6e1e05ba0b0572145f))

## [1.12.0](https://github.com/lemonadesocial/web-new/compare/v1.11.1...v1.12.0) (2025-04-25)


### Features

* host view of event guest ([20228c3](https://github.com/lemonadesocial/web-new/commit/20228c3ebfb39fae6b2fe1e6eaa80350d3c5f6c0))
* my ticket ([266a5d4](https://github.com/lemonadesocial/web-new/commit/266a5d44ae5028496dd06693f331cfcfb4068e9f))


### Bug Fixes

* mobile screen ([6108c2d](https://github.com/lemonadesocial/web-new/commit/6108c2d9dfdd347589af487a75259e3a1721764c))

## [1.11.1](https://github.com/lemonadesocial/web-new/compare/v1.11.0...v1.11.1) (2025-04-24)


### Bug Fixes

* miss sub hub at root ([8d2ced9](https://github.com/lemonadesocial/web-new/commit/8d2ced92343354764b576ff7348e8ffd8623e42d))

## [1.11.0](https://github.com/lemonadesocial/web-new/compare/v1.10.1...v1.11.0) (2025-04-23)


### Features

* add doc ([87da503](https://github.com/lemonadesocial/web-new/commit/87da5035c1d5568a8437f1edd7f0357a35335e14))
* invite friends ([050e29b](https://github.com/lemonadesocial/web-new/commit/050e29b52c85a6527a8f92ca27701022ba6de6d0))
* staking ([cc282f7](https://github.com/lemonadesocial/web-new/commit/cc282f78f2f7c1d704a806c2905c308208fb2c99))


### Bug Fixes

* allow only guest can subcribe hub ([fec01b4](https://github.com/lemonadesocial/web-new/commit/fec01b40159f9b71ef27d245d6f3ee38372ab5c6))
* hover state full container ([a40f32e](https://github.com/lemonadesocial/web-new/commit/a40f32ed37511fe25cff422838f35ec1a87a49ad))
* lint code ([60d1d7c](https://github.com/lemonadesocial/web-new/commit/60d1d7cfa41bc785c9375704d10b591d85007417))
* lint code ([51ba0e4](https://github.com/lemonadesocial/web-new/commit/51ba0e4fd14bb265c6703aa34a129726a859d7fc))
* missing event props ([3128cb6](https://github.com/lemonadesocial/web-new/commit/3128cb643b90796939f812e992e0d1b0cb773e72))
* temp to check path hostname ([a690ff8](https://github.com/lemonadesocial/web-new/commit/a690ff85aeb3d98db75f87b176ace52ad0eb4820))
* update sub hub router ([7369d6b](https://github.com/lemonadesocial/web-new/commit/7369d6b840ffc2498d21cffd6f63c1f78606ccb4))

## [1.10.1](https://github.com/lemonadesocial/web-new/compare/v1.10.0...v1.10.1) (2025-04-21)


### Bug Fixes

* miss action manage event ([345bef4](https://github.com/lemonadesocial/web-new/commit/345bef42da509d139e3db287f75a1bd7b4ab80d4))

## [1.10.0](https://github.com/lemonadesocial/web-new/compare/v1.9.1...v1.10.0) (2025-04-21)


### Features

* add to calendar ([3426057](https://github.com/lemonadesocial/web-new/commit/34260574fc7b9b4926d6a759bf665c525339193b))
* check allow domain can access path ([4191897](https://github.com/lemonadesocial/web-new/commit/419189729539dc42e1ddce022684a1d8bb080733))
* check static path ([ca7c353](https://github.com/lemonadesocial/web-new/commit/ca7c3536a8279c6f1e711c619cf1b6e7de9c1144))
* checking static path ([3d74700](https://github.com/lemonadesocial/web-new/commit/3d747009b110f2cae5dbe961bc5bf26df7deaa3a))
* update router ([54b4a9d](https://github.com/lemonadesocial/web-new/commit/54b4a9d35a24186b4978c5a4e427b7b81b727092))


### Bug Fixes

* revert ([ff5ccec](https://github.com/lemonadesocial/web-new/commit/ff5ccec14ab100f736fa69463b24c7ffd3c00a6f))

## [1.9.1](https://github.com/lemonadesocial/web-new/compare/v1.9.0...v1.9.1) (2025-04-17)


### Bug Fixes

* check empty theme ([c9b1258](https://github.com/lemonadesocial/web-new/commit/c9b12587aafdd97a2eaf44af67ad15abcf69416f))

## [1.9.0](https://github.com/lemonadesocial/web-new/compare/v1.8.1...v1.9.0) (2025-04-17)


### Features

* oauth2 ([ffe967b](https://github.com/lemonadesocial/web-new/commit/ffe967b978a1d092479bf4255860c533cbf0372d))
* rename env ([eb485bb](https://github.com/lemonadesocial/web-new/commit/eb485bbe4d2049a954c7b0897fba1075d5e1f268))


### Bug Fixes

* correct payment account ([74dec5a](https://github.com/lemonadesocial/web-new/commit/74dec5ac64a050650a3fa1e7a24f3ce9879e79bd))
* error state theming ([d90100b](https://github.com/lemonadesocial/web-new/commit/d90100b1e2920b1e059359abd6023540708a50c2))
* lint code ([c6af4ee](https://github.com/lemonadesocial/web-new/commit/c6af4ee455fc16f48bcc8101d9f13fdc13765139))
* nullable space ([84b9a81](https://github.com/lemonadesocial/web-new/commit/84b9a811b65d259e70e73b92039678139887c037))
* query space ([ba7a1a0](https://github.com/lemonadesocial/web-new/commit/ba7a1a0cef9953d4c3c16fd6cf86482fe4970ca0))
* uncategorized tickets are shown ([c9cd1af](https://github.com/lemonadesocial/web-new/commit/c9cd1af7db1c782150c5d6967628f96f19739749))

## [1.8.1](https://github.com/lemonadesocial/web-new/compare/v1.8.0...v1.8.1) (2025-04-16)


### Bug Fixes

* hide sub events instead empty state ([97d107e](https://github.com/lemonadesocial/web-new/commit/97d107e81f74bfac533288e8409b9bd9d053846d))

## [1.8.0](https://github.com/lemonadesocial/web-new/compare/v1.7.0...v1.8.0) (2025-04-15)


### Features

* add coupon ([cb05e0a](https://github.com/lemonadesocial/web-new/commit/cb05e0ac1eaa083135c95b7643bb0d1469e9b7b4))
* add dice avatar ([1ec735d](https://github.com/lemonadesocial/web-new/commit/1ec735d05d30e3dc3d6a687ad6fe3add45858689))
* update signed out state ([b589d4b](https://github.com/lemonadesocial/web-new/commit/b589d4b0985278d4094d85dd6aab79d384f487ed))


### Bug Fixes

* init appkit after chains loaded ([a5155d4](https://github.com/lemonadesocial/web-new/commit/a5155d4019a0f8ed416249aaf13ca6a328aa7c34))
* lint code ([58e7e4b](https://github.com/lemonadesocial/web-new/commit/58e7e4b211f67abc03d4420507baf7dbacbfbd7c))
* missing envs ([8259435](https://github.com/lemonadesocial/web-new/commit/8259435469f05ed206fcffa4cc20c432c16ad049))
* remove unused ([b8751f9](https://github.com/lemonadesocial/web-new/commit/b8751f9bad5fe40ea09794c8461d328753592ff6))
* request subscribe issue ([096db4c](https://github.com/lemonadesocial/web-new/commit/096db4cf0770de02a51577464544eb75a1d04642))

## [1.7.0](https://github.com/lemonadesocial/web-new/compare/v1.6.1...v1.7.0) (2025-04-13)


### Features

* update env ([3802325](https://github.com/lemonadesocial/web-new/commit/3802325619628f008f93ee50e9ee0e79f8952ff8))


### Bug Fixes

* handle signin ([b2a4d40](https://github.com/lemonadesocial/web-new/commit/b2a4d40fb0f166b36bc4361847c2485c1ed4df36))

## [1.6.1](https://github.com/lemonadesocial/web-new/compare/v1.6.0...v1.6.1) (2025-04-11)


### Bug Fixes

* missing code merge ([d605674](https://github.com/lemonadesocial/web-new/commit/d6056740ceaa72e044d946585f621499d409cfd4))

## [1.6.0](https://github.com/lemonadesocial/web-new/compare/v1.5.0...v1.6.0) (2025-04-11)


### Features

* add appkit ([44a4738](https://github.com/lemonadesocial/web-new/commit/44a473839331c1a59ebd27c60bead86520548577))
* add connect modal ([a7abc3c](https://github.com/lemonadesocial/web-new/commit/a7abc3c7e4e4fd62e1f125d34290e49c02795417))
* add empty state event list ([9121955](https://github.com/lemonadesocial/web-new/commit/9121955ea390f02a0b741f5d3bffc6c39164fc0c))
* crypto payment ([2a34e23](https://github.com/lemonadesocial/web-new/commit/2a34e23afe2c427b894021ce863b92f5042e3bf5))
* direct transfer ([9477b03](https://github.com/lemonadesocial/web-new/commit/9477b031c9d3a4bb2c4508582f9699aeeddf4907))
* handle relay payment ([c502e13](https://github.com/lemonadesocial/web-new/commit/c502e139c79b00c049bc40a1d38c0d79193710ca))
* update env ([a8b5310](https://github.com/lemonadesocial/web-new/commit/a8b5310c658532644d6faaafa3f63fd2edd1298c))
* update mobile rsvp ([97637e6](https://github.com/lemonadesocial/web-new/commit/97637e697285c1c1d660501205e358cabc3d9f6c))


### Bug Fixes

* overlap cover image ([998e2bd](https://github.com/lemonadesocial/web-new/commit/998e2bdaa32a382fd6ea3ddb2df74b0383d0247c))
* rounded community avatar - hide location rsvp ([ef6d29f](https://github.com/lemonadesocial/web-new/commit/ef6d29fb5d757faed8046b0bf0b680a93fd0ce9e))
* update bg bottomsheet ([836898d](https://github.com/lemonadesocial/web-new/commit/836898dc23463509e4187ac9c465def73fc17318))

## [1.5.0](https://github.com/lemonadesocial/web-new/compare/v1.4.0...v1.5.0) (2025-04-10)


### Features

* update font scale full page event detail ([4b9ee9b](https://github.com/lemonadesocial/web-new/commit/4b9ee9b7ed10e3157374b7a81afb1284bd0a4c5e))
* update mobile view main hub ([3aba955](https://github.com/lemonadesocial/web-new/commit/3aba9553bb004ac2df7408f35d994760eb5d3722))


### Bug Fixes

* add blur segment container ([464618e](https://github.com/lemonadesocial/web-new/commit/464618e620a580a81d7a5e11350569f05996cb48))
* add host and cohosts info to event ([8de7095](https://github.com/lemonadesocial/web-new/commit/8de70958520bc32ed74885ee00461db30395b0df))
* approval status ([77a65c0](https://github.com/lemonadesocial/web-new/commit/77a65c03216861f1c21841c00309b838610caa15))
* buy free and stripe tickets ([763e358](https://github.com/lemonadesocial/web-new/commit/763e358389cb96693c61e1259ee2172b6805242d))
* click on modal close dialog ([fd3da72](https://github.com/lemonadesocial/web-new/commit/fd3da72bf19e4d3a7f184e0c9d5a5c9247011344))
* content menu item ([12bf338](https://github.com/lemonadesocial/web-new/commit/12bf338cb3f8bd46f3ddc06b017eb2618b5a2cdb))
* hide event access for host ([deaa651](https://github.com/lemonadesocial/web-new/commit/deaa651506df038e0935e6d480e880412c675155))
* lint code ([8e28d5b](https://github.com/lemonadesocial/web-new/commit/8e28d5bd44809783562192d67d2c6a7b4de5ba7e))
* missing event field codegen ([00e2505](https://github.com/lemonadesocial/web-new/commit/00e2505323047c20af9bd1f4627802f4d95ed600))
* mobile width on community ([e12538f](https://github.com/lemonadesocial/web-new/commit/e12538fa39b5b924c8793ae940eb48ef4f881dc1))
* revert middleware after merge ([d753ff4](https://github.com/lemonadesocial/web-new/commit/d753ff4766d948ec78fc9e4feb814490419a6de9))
* sticky right col ([bd19c4b](https://github.com/lemonadesocial/web-new/commit/bd19c4bbd47451b494dec9e4b453a5e173a6305c))
* ui theme builder ([47e1830](https://github.com/lemonadesocial/web-new/commit/47e1830f3baed99fb2c4cbd0428ba9114f416e30))
* update button signin style ([4531591](https://github.com/lemonadesocial/web-new/commit/45315911a31cc580700e0adda36babace21e2334))
* update icons link social ([27386d1](https://github.com/lemonadesocial/web-new/commit/27386d1ba6ce72e237456d1bdeb25c14f1260d77))
* update tooltip icon social ([7b5c930](https://github.com/lemonadesocial/web-new/commit/7b5c930374c8c34d2b7859d75649c8e09530961b))
* update width on datetime/location event blocks ([575fa43](https://github.com/lemonadesocial/web-new/commit/575fa435c2810717f8317bcf5c5726e2e81e439b))
* wrong color footer calendar ([9741a92](https://github.com/lemonadesocial/web-new/commit/9741a9219159a2261be61934f163a829fcabfb2b))
* wrong color vars calendar ([ff281f1](https://github.com/lemonadesocial/web-new/commit/ff281f14ba1ea0ffb5a03c51ba7642268172f15d))

## [1.4.0](https://github.com/lemonadesocial/web-new/compare/v1.3.0...v1.4.0) (2025-04-08)


### Features

* card payment ([a28f69e](https://github.com/lemonadesocial/web-new/commit/a28f69ebbb5dd07c98193727486d1ac986c350fc))
* order summary ([4da16ec](https://github.com/lemonadesocial/web-new/commit/4da16ec07445aea9bc56775cd647f992073a64ae))
* pay by saved cards ([cb2c81a](https://github.com/lemonadesocial/web-new/commit/cb2c81a70a031a9cc7df28db97e1fb7e6afad1f2))
* request sent modal ([8a06aac](https://github.com/lemonadesocial/web-new/commit/8a06aac6814329cd0cf91424dd1a36d3fb8a4005))
* save card ([9fff09f](https://github.com/lemonadesocial/web-new/commit/9fff09f4cdbb1124b2ea78c3639b4170c4dca42d))
* update form title ([ea2092d](https://github.com/lemonadesocial/web-new/commit/ea2092ddfdd2bf2c1bc3c4cad9de40e4bdc0db86))
* update process tickets ([1779276](https://github.com/lemonadesocial/web-new/commit/177927690bbd5cf13c196373dff2e68ab656ea7e))


### Bug Fixes

* typo ([aa1fa67](https://github.com/lemonadesocial/web-new/commit/aa1fa67ef3fb0edcb183a80c13688415429dae3b))

## [1.3.0](https://github.com/lemonadesocial/web-new/compare/v1.2.0...v1.3.0) (2025-04-04)


### Features

* select random pattern ([5bd83e0](https://github.com/lemonadesocial/web-new/commit/5bd83e0e4f63f64f5a49d0e3a400d889e89f7242))
* updat favicon and metadata ([537c850](https://github.com/lemonadesocial/web-new/commit/537c850304606b6f56614250f34f996d5eb39acc))
* update blur on button, card, and menu components ([1bcead0](https://github.com/lemonadesocial/web-new/commit/1bcead0aede2d994c2f6bcac12db859ffc8c68b4))
* update theme pattern ([75fe234](https://github.com/lemonadesocial/web-new/commit/75fe2344b76b05522fca071e0e8d8f594939a89a))


### Bug Fixes

* avatar image style event detail ([38568e5](https://github.com/lemonadesocial/web-new/commit/38568e5c9e2d4d4b42b3cdcb5a9e04bb99d083ef))
* get ticket types args cache ([1644250](https://github.com/lemonadesocial/web-new/commit/16442502788b48394daf360064b701f78cfc0b60))
* get ticket types network only ([31c511c](https://github.com/lemonadesocial/web-new/commit/31c511c8efce5f19437933809ed11353ff5a10bd))
* increase image resolution image avatar ([fe822a0](https://github.com/lemonadesocial/web-new/commit/fe822a0737f05120b27ea9a0ac8a17066fc465f7))
* lint code ([ac6451d](https://github.com/lemonadesocial/web-new/commit/ac6451db496c2c8bda2e37be45f72368383b00fd))
* missing entity key ([7fde7eb](https://github.com/lemonadesocial/web-new/commit/7fde7eb0f385e02ed584833affd6a6fdedf84228))
* update image avatar community ([0e7edd9](https://github.com/lemonadesocial/web-new/commit/0e7edd9409131ccb4add600c156c1011fe93f0e5))
* update size event photo ([8b5200e](https://github.com/lemonadesocial/web-new/commit/8b5200e225f6ce92da2f9311d8f2c1ef50336e12))

## [1.2.0](https://github.com/lemonadesocial/web-new/compare/v1.1.0...v1.2.0) (2025-04-04)


### Features

* add multi select component ([c587d10](https://github.com/lemonadesocial/web-new/commit/c587d10f4b1854e292a09eb9f6f25395761c1705))
* add stripe card ([576636a](https://github.com/lemonadesocial/web-new/commit/576636a36d9b853981a891c2f30767aa94ae39ea))
* add user form ([58817b0](https://github.com/lemonadesocial/web-new/commit/58817b0b51b6f09ebf5b57f95a0ac2246bc1efb3))
* hide card payment ([03851f9](https://github.com/lemonadesocial/web-new/commit/03851f95ed8668d746af7eb224689474d2ad94ec))
* submit application form ([6986cea](https://github.com/lemonadesocial/web-new/commit/6986cea8d90e9aeef7914cd831feda3887a57de4))
* update inputs ([8d5acaa](https://github.com/lemonadesocial/web-new/commit/8d5acaac57b36b3662f3e32296bf1c5c61eb0910))


### Bug Fixes

* can not resolve client module ([3baa6a1](https://github.com/lemonadesocial/web-new/commit/3baa6a1f54ea01ad67e40ccb5094e2a843a27896))
* create portal for modal ([7b1ca79](https://github.com/lemonadesocial/web-new/commit/7b1ca796c0b0bb74ea796588c802f13792f00dd8))
* lint code ([318a029](https://github.com/lemonadesocial/web-new/commit/318a029c8ab6e0d3a0da91c2c228e33b5fd2751b))
* number input button color ([52d1d96](https://github.com/lemonadesocial/web-new/commit/52d1d963e055a790b222aa47b8e1855d3663ab81))
* rsvp flow ([f2796b5](https://github.com/lemonadesocial/web-new/commit/f2796b551676e65e16b6f5fcff9f83eeab32fbd2))

## [1.1.0](https://github.com/lemonadesocial/web-new/compare/v1.0.0...v1.1.0) (2025-04-03)


### Features

* add access to event pane ([a341967](https://github.com/lemonadesocial/web-new/commit/a34196760c213e7ead7b0b4b9f1b38b8999cd6d7))
* add approval card ([723f9fc](https://github.com/lemonadesocial/web-new/commit/723f9fcfbcacbaf674b2c096fff8d25c9a3011d0))
* add form handles ([d070f3f](https://github.com/lemonadesocial/web-new/commit/d070f3fb22c714b80c5ae4c08724ccfc4c8669f1))
* add ticket card ([2d2db70](https://github.com/lemonadesocial/web-new/commit/2d2db701d71aa284f48f23bd9b16381effa2e50a))
* disable root page ([830899a](https://github.com/lemonadesocial/web-new/commit/830899a81beee470ee548ec6323cbce63681ffa6))
* new modal instance ([14ae0c6](https://github.com/lemonadesocial/web-new/commit/14ae0c6ca0bfed2d18e1937b49395b5552ed1738))
* redeem tickets ([21db7ff](https://github.com/lemonadesocial/web-new/commit/21db7ff57b27d85ac2ff6d2fe27f71e9f2d56c65))
* update graphql client ([adbc7e8](https://github.com/lemonadesocial/web-new/commit/adbc7e892072fc1cc45fb98d0ab25abf8b7f6f09))
* write query ([b8a332b](https://github.com/lemonadesocial/web-new/commit/b8a332b0feebfd0ca1b5b011791e51c83ad1b42c))


### Bug Fixes

* revert ([a45b681](https://github.com/lemonadesocial/web-new/commit/a45b681f1c291a6284194063cffcd4270d3d6c68))
* update bg color menu ([1b31454](https://github.com/lemonadesocial/web-new/commit/1b31454da5f385f3fa31fabccfaac1f57e690d53))
* update loading state event right pane ([d2f1ae8](https://github.com/lemonadesocial/web-new/commit/d2f1ae8424209cb6781e009ef951b8abf10f4411))
* update loading state event right pane ([7d1545d](https://github.com/lemonadesocial/web-new/commit/7d1545d082d21cc810ade65d55618a50550e6fa7))

## 1.0.0 (2025-04-01)


### Features

* add build output ([c1dd896](https://github.com/lemonadesocial/web-new/commit/c1dd89632de341cfe21c6ca728db2fdbefe52826))
* add default active event type ([8bb78b9](https://github.com/lemonadesocial/web-new/commit/8bb78b95b2c2dfb4c5624819da3cdf70f9854f1e))
* add drawer component ([6c3f26c](https://github.com/lemonadesocial/web-new/commit/6c3f26c0da25d26c0cd3819d64e334dce5019d58))
* add list chains and correct price format ([19fa723](https://github.com/lemonadesocial/web-new/commit/19fa7230e1a2221bbb60ab474c2d40f495d6c217))
* button state ([14acd4b](https://github.com/lemonadesocial/web-new/commit/14acd4b76e90be2700685d0ab27964813d9300f0))
* check assets source ([0a28f14](https://github.com/lemonadesocial/web-new/commit/0a28f14cced685cc4bb7fb229cc58208eb15aa26))
* checking app ([bbe657e](https://github.com/lemonadesocial/web-new/commit/bbe657eccaf63f651d5b965802bf0777a88ed91d))
* convert providers to hooks ([d1ce300](https://github.com/lemonadesocial/web-new/commit/d1ce300399e93396118e8143b99806d649f56356))
* **deploy:** add deployment workflows ([abca7e6](https://github.com/lemonadesocial/web-new/commit/abca7e67851b07e1a48fd5a372c34ffe22f001e5))
* **deploy:** inject GitHub variables to env ([fbe969a](https://github.com/lemonadesocial/web-new/commit/fbe969ab102f66144f6429ed83205d943dca2826))
* disable next img lint rule ([b1470ac](https://github.com/lemonadesocial/web-new/commit/b1470ac2bb89ad3d02cdcef1d92720d637cf53c7))
* **docker:** remove public read acl when sync files ([6b2a523](https://github.com/lemonadesocial/web-new/commit/6b2a5238e82c9074f32bf6db93c14fa535915d44))
* event registration ([77ffd4a](https://github.com/lemonadesocial/web-new/commit/77ffd4a03c7e557febaab728a19bc05c6802b6b9))
* fetch ticket price ([3c72eab](https://github.com/lemonadesocial/web-new/commit/3c72eaba2265aaca53d6d0c557e28f31559656e8))
* implement full page event guest side ([81d4c8c](https://github.com/lemonadesocial/web-new/commit/81d4c8c65aeb63b6d215d1dfb0b3a99f92522d88))
* merge master ([6dce3bf](https://github.com/lemonadesocial/web-new/commit/6dce3bf82f0c6ab7d601508a7beca87c69a35690))
* open multiple modals ([8cedbfa](https://github.com/lemonadesocial/web-new/commit/8cedbfa3e04c5d6da4b06ea21cf487195840d560))
* pre-rsvp ([822bd04](https://github.com/lemonadesocial/web-new/commit/822bd046570d2128fd66eaee7a9e56e2f0994b74))
* resolve feedback ([d8c02e1](https://github.com/lemonadesocial/web-new/commit/d8c02e12e03701936ca37ee76144e68d5c24d484))
* rsvp flow ([8c3ab7b](https://github.com/lemonadesocial/web-new/commit/8c3ab7b38d9406bc7839904f261b50851eb65b4a))
* select tickets ([70a9d91](https://github.com/lemonadesocial/web-new/commit/70a9d9197801722cab11120b65a06b795de54eae))
* setup project ([b6e90c7](https://github.com/lemonadesocial/web-new/commit/b6e90c71d6d43e6ce02e54738d6a82cfd587e129))
* setup test ([0f3b5ae](https://github.com/lemonadesocial/web-new/commit/0f3b5aeff43d59b9ae1062171108a5d39bea8daf))
* update auth controller ([c0099ef](https://github.com/lemonadesocial/web-new/commit/c0099efca21d1abdab6d4704d3324d74391d8f7f))
* update auth flow ([200f453](https://github.com/lemonadesocial/web-new/commit/200f453c960c22674de6c98b78076e08d101868b))
* update avatar size - event info ([ae23a98](https://github.com/lemonadesocial/web-new/commit/ae23a989a2074a7e0c27de7f01c76167c982dfcf))
* update basic default light theme ([5e54f7f](https://github.com/lemonadesocial/web-new/commit/5e54f7fce56e959f567f2d541ae6f999d57ab884))
* update branch ([892ca61](https://github.com/lemonadesocial/web-new/commit/892ca61aeb8b79712c191e87dfbef50b06fde2e2))
* update card action ([89bb1d7](https://github.com/lemonadesocial/web-new/commit/89bb1d719a9f0c1d30dded95186b6ee14573ea1d))
* update color vars ([b117d96](https://github.com/lemonadesocial/web-new/commit/b117d96fa04a40103e2042b9e7bd1e4fc03b57cf))
* update commnuity root ([183af91](https://github.com/lemonadesocial/web-new/commit/183af91daed84b0d08e06f6a7be25dfa6c2305cc))
* update env ([986eb62](https://github.com/lemonadesocial/web-new/commit/986eb622f57ac04e0bb77fc8da74b585d1774394))
* update event pane ([c0b4ce6](https://github.com/lemonadesocial/web-new/commit/c0b4ce6965fcc36abd8b7976b64f3828c099c8c0))
* update event pane ([29c7779](https://github.com/lemonadesocial/web-new/commit/29c777974c3473af96ee87e1bb86b73d4352598e))
* update fonts, colors, apply theming ([e35f2df](https://github.com/lemonadesocial/web-new/commit/e35f2df08332123aba34d07e6a80b8999beb4a4b))
* update health check ([37b7ad4](https://github.com/lemonadesocial/web-new/commit/37b7ad49795b7b9d713fcc3932f58bab4fdd22cc))
* update hover state top profile ([2c72ca2](https://github.com/lemonadesocial/web-new/commit/2c72ca288628ac8b96220188928381a10cfbe4fd))
* update hover state when had action on MenuItem ([0bb0436](https://github.com/lemonadesocial/web-new/commit/0bb0436d6322b01a00a7348db480510a194026a4))
* update lint rule ([128a851](https://github.com/lemonadesocial/web-new/commit/128a851b7350862fe42792e86313c7c6ad9365f9))
* update listing event ([1b93262](https://github.com/lemonadesocial/web-new/commit/1b93262704a561ec3d53de2950625cbf8a460e9d))
* update menu content style ([496f996](https://github.com/lemonadesocial/web-new/commit/496f9968c5175d0c866a773a2bc33867bec81e95))
* update menu items ([386307d](https://github.com/lemonadesocial/web-new/commit/386307d3229dc0ff3c2407a067c5eecebdd901dd))
* update metadata for community ([ca48009](https://github.com/lemonadesocial/web-new/commit/ca480095247a07080beb2c1e8e890185bdeeff7d))
* update modal styles ([469a846](https://github.com/lemonadesocial/web-new/commit/469a846fcb1af95fd2873b6878578584d91ac7b7))
* update options - rm unused ([21d021d](https://github.com/lemonadesocial/web-new/commit/21d021d7f7a669a6a90850d265bf4263d490fa93))
* update preset colors ([6ee5def](https://github.com/lemonadesocial/web-new/commit/6ee5defa083d4a540a6b9b96afda58583b93e131))
* update shader ([93b67e3](https://github.com/lemonadesocial/web-new/commit/93b67e3df9293fa3be1eb9740d60841a88c315af))
* update theme builder ([3990ff3](https://github.com/lemonadesocial/web-new/commit/3990ff35513b5a5ab51c47168418cfa0c51b7c0f))
* update theming ([5908b1e](https://github.com/lemonadesocial/web-new/commit/5908b1eab6e9df17f2aba19d4564d668972256a0))
* update timezone ([741c9eb](https://github.com/lemonadesocial/web-new/commit/741c9ebb21b760b0447a3a2d9f469c3a8e191ca1))
* update toast component ([390fdb8](https://github.com/lemonadesocial/web-new/commit/390fdb8af739ba7d5448897f61ea2de77f615e2a))
* update toggle date ([5772bc6](https://github.com/lemonadesocial/web-new/commit/5772bc62a4b6228a34f6551aea521d5af6f41ec0))
* update UI listing event ([613d11c](https://github.com/lemonadesocial/web-new/commit/613d11c2431abe5073d7591aaa576451113131de))


### Bug Fixes

* asset prefix ([35dc70a](https://github.com/lemonadesocial/web-new/commit/35dc70a60319d5f479cf51d92427a27dbacecd7f))
* asset prefix ([58be5eb](https://github.com/lemonadesocial/web-new/commit/58be5eb2423ef2778a02ae6729f9d95949b5ce91))
* avatar ([dc3ae2f](https://github.com/lemonadesocial/web-new/commit/dc3ae2f0bec3bbf0e9c6dd5e2efc8d7c99d2f130))
* border button ([52fc421](https://github.com/lemonadesocial/web-new/commit/52fc4213f3950cc1bf0f01f515acc035e8c9a5a9))
* change multi instance client from ssr ([6fc2850](https://github.com/lemonadesocial/web-new/commit/6fc28501636900278d82456def18c84fa5a16cdd))
* change tertiary to primary ([237368e](https://github.com/lemonadesocial/web-new/commit/237368edb3f7802a89ce95326a6ed7b71bda11c7))
* chech http2 ([c4912de](https://github.com/lemonadesocial/web-new/commit/c4912debdbda04020fb52881033177068297b6f5))
* check block time with tz ([7b3b734](https://github.com/lemonadesocial/web-new/commit/7b3b7344b7ab47ed390a095aff2e32735b257a6c))
* check env build flow ([ac30c70](https://github.com/lemonadesocial/web-new/commit/ac30c70bdc6a0170399b118994e3d0fc98ffca01))
* check missing context ([967028d](https://github.com/lemonadesocial/web-new/commit/967028da444595ffa790fc14167f92ad907a2cd5))
* check size avatar ([9ec00c5](https://github.com/lemonadesocial/web-new/commit/9ec00c5e2a1cffb06df6f70a70a86e27eaaa3386))
* check wrong req ([e7832e7](https://github.com/lemonadesocial/web-new/commit/e7832e7ebefa3f63c701dd57be8e2ecc306b8329))
* checking host req ([936a635](https://github.com/lemonadesocial/web-new/commit/936a635e23726f205ec8ae7c51eac4da2e239274))
* **deploy:** add missing Docker file & docker bake config ([166fc71](https://github.com/lemonadesocial/web-new/commit/166fc711ce8582c94e784828d694baeb005bbcb5))
* **deploy:** fix getting env values from GitHub vars ([d499b66](https://github.com/lemonadesocial/web-new/commit/d499b66cd818e4aaa6bb745f476be1823257de3f))
* disable drag on content bottomsheet ([9c72b38](https://github.com/lemonadesocial/web-new/commit/9c72b383bd0488375ea4de11277b3080c077ab97))
* group image ([6a57990](https://github.com/lemonadesocial/web-new/commit/6a57990a3d587c1adc9e60cf46c8bf3e80acfa2d))
* group image ([fa5e897](https://github.com/lemonadesocial/web-new/commit/fa5e8972e7289c13b6c16e699e82a24049753a7e))
* hide location when unknow ([bac9143](https://github.com/lemonadesocial/web-new/commit/bac9143ce1722241eb0e6346e664673ebc7d997d))
* infinite get whoami ([176809e](https://github.com/lemonadesocial/web-new/commit/176809e28a8706d0340fc8bb76e680ccb9fbb70e))
* load default custom color ([03ac128](https://github.com/lemonadesocial/web-new/commit/03ac1284db1bdc17739b058340e5dbb5c6392002))
* merge default config theme_data ([46a2545](https://github.com/lemonadesocial/web-new/commit/46a254541cc63fd715912bed3d08176f947f9803))
* middleware rewrites assets path ([e47f371](https://github.com/lemonadesocial/web-new/commit/e47f37155c4e24f4eccd3b2ce8ee58074da07ad4))
* missing close sheet after save ([31a26a4](https://github.com/lemonadesocial/web-new/commit/31a26a48b233762704ef3daf1d18a19b326cdfd0))
* missing config ([b21e2a2](https://github.com/lemonadesocial/web-new/commit/b21e2a2051bc80e4c01b5331db708803fb2cf579))
* missing variables ([6e6aa45](https://github.com/lemonadesocial/web-new/commit/6e6aa459dce879306e2d91dc894332fc26434601))
* optimize load fonts ([63ff535](https://github.com/lemonadesocial/web-new/commit/63ff535c450135ae839caa0573af2805a9730572))
* remove hover date cannot select ([f531dae](https://github.com/lemonadesocial/web-new/commit/f531daebb132e9148241e8fcdd9a6ab5ef5234c1))
* remove unused ([7114c75](https://github.com/lemonadesocial/web-new/commit/7114c752c31c85f67af92b9355f4cec2a2c8101b))
* remove unused ([e0a43e5](https://github.com/lemonadesocial/web-new/commit/e0a43e5077a4b8296673eb5ec3fac4a3b89d67dd))
* remove unused styling ([9e60531](https://github.com/lemonadesocial/web-new/commit/9e605317aa43e2c3ed1ecf1e70c483ee48c9add3))
* resolve feedback ([fb58009](https://github.com/lemonadesocial/web-new/commit/fb580093490422032626212029cddd54967f2f27))
* revert ([bde032d](https://github.com/lemonadesocial/web-new/commit/bde032d68161009cae3ce8743886037023a7ae1b))
* set default font menu component ([46dd0e3](https://github.com/lemonadesocial/web-new/commit/46dd0e38c4c8f47eb398748870918b9a26bf73c2))
* success color ([05e13fa](https://github.com/lemonadesocial/web-new/commit/05e13fa0056c6e6de276f934fe6c23f1a0f050d3))
* temp prevent sheet ([aae7547](https://github.com/lemonadesocial/web-new/commit/aae7547fa492849ec595522fe36f17890ef9d964))
* update env ([5e2119a](https://github.com/lemonadesocial/web-new/commit/5e2119af5859cc6bb1919cc0e9a3caa38010dd76))
* update form theme builder ([a5092d7](https://github.com/lemonadesocial/web-new/commit/a5092d7fddd0d6246c674015df77b04860f2ccd1))
* update layout bottom sheet mobile view ([e72b959](https://github.com/lemonadesocial/web-new/commit/e72b95945b905e4a03465ba5734569a366b5c143))
* update menu strategy ([0d003e2](https://github.com/lemonadesocial/web-new/commit/0d003e2e7cebdcebb33d9fd7def8f92e1072f032))
* write wrong data ([f73f1ed](https://github.com/lemonadesocial/web-new/commit/f73f1ed1fbfac03b6d4e6948133dcefc363a1e36))
* wrong check admins ([956a781](https://github.com/lemonadesocial/web-new/commit/956a781d6fcd0f0ab51ca15ed2018b53203fa351))
