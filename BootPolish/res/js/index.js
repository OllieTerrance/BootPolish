"use strict";
$(document).ready(function(e) {
    window.bp = new BootPolish("#bp-root", true);
    Mousetrap.bind(["left", "right"], function(e, key) {
        bp.nav(key === "left" ? -1 : 1);
    }).bind("\\", function(e, key) {
        bp.showEdit(false);
    }).bind("\\", function(e, key) {
        bp.showEdit(true);
    }, "keyup").bind("backspace", function(e, key) {
        e.preventDefault();
        bp.del();
    }).bind("shift+backspace", function(e, key) {
        if (confirm("Clear all sibling nodes?")) bp.delSiblings();
    }).bind("enter", function(e, key) {
        var text = prompt("Raw text:", "");
        if (!text) return;
        bp.insert(text);
    }).bind("j", function(e, key) {
        bp.createJumbotron();
    }).bind(["1", "2", "3", "4", "5", "6", "shift+1", "shift+2", "shift+3", "shift+4", "shift+5", "shift+6"], function(e, key) {
        var parts = key.split("+");
        var block = (parts.length === 2);
        if (block) parts.shift();
        var size = parts[0];
        var text = prompt((block ? "Block t" : "T") + "itle (level " + size + "):", "");
        if (!text) return;
        bp.createHeading(text, size, block);
    }).bind(["p", "shift+p"], function(e, key) {
        var text = prompt((key === "p" ? "P" : "Lead p") + "aragraph:", "");
        if (!text) return;
        bp.createParagraph(text, key === "shift+p");
    }).bind("a", function(e, key) {
        var colour = prompt("Alert colour (success/info/warning/danger):", "info");
        if (["success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var dismissable = confirm("Dismissable?");
        bp.createAlert(colour, dismissable);
    }).bind(["w", "shift+w", "alt+w"], function(e, key) {
        var size = prompt("Well size (lg/sm, blank for normal):", "");
        if (["lg", "sm", ""].indexOf(size) === -1) return;
        bp.createWell(size);
    }).bind("l", function(e, key) {
        var title = prompt("Panel heading (prefix '!' for title, blank for none):", "");
        if (title === null) return;
        var footer = confirm("Add footer?");
        var colour = prompt("Panel colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        bp.createPanel(title.substr(title[0] === "!" ? 1 : 0), title[0] === "!", footer, colour);
    }).bind(["b b", "b d", "b shift+d"], function(e, key) {
        var label = prompt("Button label:", "");
        if (label === null) return;
        var size = prompt("Button size (lg/sm/xs, blank for normal):", "");
        if (["lg", "sm", "xs", ""].indexOf(size) === -1) return;
        var colour = prompt("Button colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var dropdown;
        if (key !== "b b") {
            dropdown = new BootPolish.Dropdown(false);
            dropdown.setDropup(key === "b shift+d");
            while (true) {
                var opt = prompt("Add option ('--' for separator, prefix '!' for heading, blank to end):", "");
                if (opt === null) return;
                if (opt === "") break;
                if (opt === "--") {
                    dropdown.addSeparator();
                } else if (opt[0] === "!") {
                    dropdown.addHeading(opt.substr(1));
                } else {
                    dropdown.addOption(opt);
                }
            }
        }
        bp.createButton(label, colour, size, dropdown);
    }).bind("t", function(e, key) {
        var rows = parseInt(prompt("Rows:", ""));
        if (!rows || rows < 0) return;
        var cols = parseInt(prompt("Columns:", ""));
        if (!cols || cols < 0) return;
        bp.createTable(rows, cols, (rows > 1 && confirm("First row as header?")));
    }).bind("f f", function(e, key) {
        bp.createForm(confirm("Horizontal?"));
    }).bind("f g", function(e, key) {
        bp.createFormGroup();
    }).bind("f l", function(e, key) {
        var label = prompt("Label:", "");
        if (!label) return;
        bp.createFormLabel(label);
    }).bind("f i", function(e, key) {
        var type = prompt("Input type (text/password/email/number/date/time):", "text");
        if (["text", "password", "email", "number", "date", "time"].indexOf(type) === -1) return;
        var placeholder;
        if (["text", "password", "email", "number"].indexOf(type) >= 0) {
            placeholder = prompt("Placeholder:", "");
            if (placeholder === null) return;
        }
        bp.createFormInput(type, placeholder);
    }).bind("f d", function(e, key) {
        var dropdown = new BootPolish.Dropdown(true);
        while (true) {
            var opt = prompt("Add option (blank to end):", "");
            if (opt === null) return;
            if (opt === "") break;
            dropdown.addOption(opt);
        }
        bp.createFormDropdown(dropdown);
    }).bind("f b", function(e, key) {
        var type = prompt("Input type (submit/reset/button):", "submit");
        if (["submit", "reset", "button"].indexOf(type) === -1) return;
        var label = prompt("Button label:", "");
        if (label === null) return;
        var size = prompt("Button size (lg/sm/xs, blank for normal):", "");
        if (["lg", "sm", "xs", ""].indexOf(size) === -1) return;
        var colour = prompt("Button colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        bp.createFormButton(type, label, colour, size);
    });
});
