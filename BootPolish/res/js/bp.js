$(document).ready(function(e) {
    var $lenses;
    function addLens(node, pos) {
        var lens = $("<div>").addClass("lens");
        switch (pos) {
            case -1:
                $(node).before(lens);
                break;
            case 0:
                $(node).append(lens);
                break;
            case 1:
                $(node).after(lens);
                break;
        }
    }
    $("#bp-root").append($("<div>").addClass("lens"));
    $lenses = $(".lens");
    $lenses.first().addClass("focus");
    Mousetrap.bind(["left", "right"], function(e, key) {
        var pos = $lenses.index($(".lens.focus").removeClass("focus"));
        $($lenses.get((pos + (key === "left" ? -1 : 1)) % $lenses.length)).addClass("focus");
    }).bind("\\", function(e, key) {
        $lenses.hide();
    }).bind("\\", function(e, key) {
        $lenses.show();
    }, "keyup").bind("backspace", function(e, key) {
        e.preventDefault();
        $(".lens.focus").prevUntil(".lens").prev().andSelf().remove();
        $lenses = $(".lens");
    }).bind("shift+backspace", function(e, key) {
        if (!confirm("Clear all sibling nodes?")) return;
        var parent = $(".lens.focus").parent().empty().append($("<div>").addClass("lens focus"));
        $lenses = $(".lens");
    }).bind("enter", function(e, key) {
        var text = prompt("Raw text:", "");
        if (!text) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before(text);
        $lenses = $(".lens");
    }).bind("h", function(e, key) {
        var header = prompt("Page header:", "");
        if (!header) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<div>").addClass("page-header").append($("<h1>").html(header)));
        $lenses = $(".lens");
    }).bind(["1", "2", "3", "4", "5", "6"], function(e, key) {
        var title = prompt("Title (level " + key + "):", "");
        if (!title) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<h" + key + ">").html(title));
        $lenses = $(".lens");
    }).bind(["p", "shift+p"], function(e, key) {
        var para = prompt((key === "p" ? "P" : "Lead p") + "aragraph:", "");
        if (!para) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<p>").toggleClass("lead", key === "shift+p").html(para));
        $lenses = $(".lens");
    }).bind("a", function(e, key) {
        var colour = prompt("Alert colour (success/info/warning/danger):", "info");
        if (["success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<div>").addClass("alert alert-" + colour).append($("<div>").addClass("lens focus"))).removeClass("focus");
        $lenses = $(".lens");
    }).bind(["w", "shift+w", "shift+alt+w"], function(e, key) {
        var size = (key === "w" ? "" : (key === "shift+w" ? " well-lg" : " well-sm"));
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<div>").addClass("well" + size).append($("<div>").addClass("lens focus"))).removeClass("focus");
        $lenses = $(".lens");
    }).bind(["l"], function(e, key) {
        var title = prompt("Panel heading (prefix '!' for title, blank for none):", "");
        if (title === null) return;
        var footer = confirm("Add footer?");
        var colour = prompt("Panel colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var $panel = $("<div>").addClass("panel panel-" + colour);
        if (title) {
            var $heading = $("<div>").addClass("panel-heading").text(title);
            if (title[0] === "!") $heading.empty().append($("<h3>").addClass("panel-title").text(title.substr(1)));
            $panel.append($heading);
        }
        $panel.append($("<div>").addClass("panel-body").append($("<div>").addClass("lens focus")));
        if (footer) $panel.append($("<div>").addClass("panel-footer").append($("<div>").addClass("lens")));
        $(".lens.focus").before($("<div>").addClass("lens")).before($panel).removeClass("focus");
        $lenses = $(".lens");
    }).bind(["d", "shift+d"], function(e, key) {
        var label = prompt("Button label:", "");
        if (label === null) return;
        var colour = prompt("Button colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var up = (key === "shift+d");
        var opts = [];
        while (true) {
            var opt = prompt("Add option ('--' for separator, prefix '!' for heading, blank to end):", "");
            if (opt === null) return;
            if (opt === "") break;
            if (opt === "--") {
                opts.push($("<li>").addClass("divider").attr("role", "separator"));
            } else if (opt[0] === "!") {
                opts.push($("<li>").addClass("dropdown-header").text(opt.substr(1)));
            } else {
                opts.push($("<li>").append($("<a>").text(opt)));
            }
        }
        var $dropdown = $("<ul>").addClass("dropdown-menu").append(opts);
        var $button = $("<button>").addClass("btn btn-" + colour + " dropdown-toggle").attr("data-toggle", "dropdown").text(label + " ").append($("<span>").addClass("caret"));
        var $root = $("<div>").addClass("drop" + (up ? "up" : "down")).append($button).append($dropdown);
        $(".lens.focus").before($("<div>").addClass("lens")).before($root);
        $lenses = $(".lens");
    }).bind("t", function(e, key) {
        var rows = parseInt(prompt("Rows:", ""));
        if (!rows || rows < 0) return;
        var cols = parseInt(prompt("Columns:", ""));
        if (!cols || cols < 0) return;
        var header = rows > 1 && confirm("First row as header?");
        var $table = $("<table>").addClass("table table-bordered");
        if (header) {
            $row = $("<tr>");
            for (var j = 0; j < cols; j++) {
                var $cell = $("<th>");
                $cell.append($("<div>").addClass("lens"));
                $row.append($cell);
            }
            $table.append($("<thead>").append($row));
            rows--;
        }
        var $tbody = $("<tbody>");
        for (var i = 0; i < rows; i++) {
            var $row = $("<tr>");
            for (var j = 0; j < cols; j++) {
                var $cell = $("<td>");
                $cell.append($("<div>").addClass("lens"));
                $row.append($cell);
            }
            $tbody.append($row);
        }
        $table.append($tbody);
        $(".lens.focus").before($("<div>").addClass("lens")).before($table);
        $lenses = $(".lens");
    }).bind("f f", function(e, key) {
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<form>").append($("<div>").addClass("lens focus"))).removeClass("focus");
        $lenses = $(".lens");
    }).bind(["f i", "f e", "f n", "f p"], function(e, key) {
        var placeholder = prompt("Placeholder:", "");
        if (placeholder === null) return;
        var type = (key === "f i" ? "text" : (key === "f e" ? "email" : (key === "f n" ? "number" : "password")));
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<input>").attr("type", type).attr("placeholder", placeholder || undefined).addClass("form-control"));
        $lenses = $(".lens");
    }).bind("f d", function(e, key) {
        var opts = [];
        while (true) {
            var opt = prompt("Add option (blank to end):", "");
            if (opt === null) return;
            if (opt === "") break;
            opts.push(opt);
        }
        var $select = $("<select>").addClass("form-control");
        for (var i in opts) {
            $select.append($("<option>").text(opts[i]));
        }
        $(".lens.focus").before($("<div>").addClass("lens")).before($select);
        $lenses = $(".lens");
    }).bind("f s", function(e, key) {
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<input>").attr("type", "submit").addClass("btn btn-primary").text("Submit"));
        $lenses = $(".lens");
    });
});
