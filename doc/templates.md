# Templates

hs-client uses iCanHaz.js, which uses mustache.js.

## Loading

Any file in the js tree with a `.tmpl` file extension is considered a template. These should just be mustache HTML snipits.

They are loaded into the DOM in script tags, as per iCanHaz. They are `id`d according to thier file name. For example, the file `js/auth/tmpl/loginForm.tmpl` is made available via `ich.loginForm` which also enables it as a View field `tmpl: 'loginForm'`.
