# Introduction

**Boot Polish** is a synchronous, visual web page builder for Bootstrap.  It is navigated entirely by keyboard, with key bindings to insert and navigate between nodes.

# Keyboard controls

* `left`, `right`: navigate through lenses
* `\` (hold): hide lenses
* `backspace`: delete element before lens
* `shift+backspace`: delete all siblings
* `enter`: insert raw text/HTML
* `j`: insert jumbotron
* `1`, `2`, `3`, `4`, `5`, `6`: insert heading (`shift` for block heading)
* `p`: insert paragraph (`shift` for lead)
* `a`: insert alert
* `w`: insert well
* `l`: insert panel
* `b`: buttons...
  - `b b`: insert button
  - `b d`: insert button dropdown (`shift` for dropup)
* `t`: insert table
* `f`: forms...
  - `f f`: insert form
  - `f g`: insert form group
  - `f l`: insert label
  - `f i`: insert text input
  - `f d`: insert dropdown/select
  - `f b`: insert input button

# JavaScript API

All methods are exposed in the `BootPolish` class, which can be used to automate the creation of pages.

```js
var bp = new BootPolish("#root-node");
bp.createHeading("Block Heading", 1, true);
// Lens focus moves under the new element.
bp.createHeading("Subtitle", 2);
bp.createParagraph("Some words.");
bp.createAlert("info");
// Lens focus is now inside the alert.
bp.createParagraph("Some raw text.");
bp.nav(1);
// Lens focus is now below the alert.
bp.createParagraph("Some more words.");
```
