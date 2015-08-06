var BootPolish = function(root) {
    this.$root = $(root);
    this.$root.append(this.newLens(true));
    this.syncLenses();
};
$.extend(BootPolish.prototype, {
    newLens: function(focus) {
        if (focus) this.focus().removeClass("focus");
        var $root = this.$root;
        return $("<div>").addClass("lens").toggleClass("focus", !!focus).click(function(e) {
            $(".lens.focus", $root).removeClass("focus");
            $(this).addClass("focus");
        });
    },
    syncLenses: function() {
        this.$lenses = $(".lens", this.$root);
    },
    focus: function() {
        return $(".lens.focus", this.$root);
    },
    showEdit: function(show) {
        this.$root.toggleClass("edit", show);
    },
    nav: function(fwd) {
        var pos = this.$lenses.index(this.focus().removeClass("focus"));
        $(this.$lenses.get((pos + fwd) % this.$lenses.length)).addClass("focus");
    },
    del: function() {
        var $focus = this.focus();
        if ($focus.prev().is(".lens")) {
            var $contents = $focus.parent().contents();
            $contents.slice($contents.index($focus.prev()), $contents.index($focus)).remove();
        } else {
            $focus.prevUntil(".lens").prev().andSelf().remove();
        }
        this.syncLenses();
    },
    delSiblings: function() {
        this.focus().parent().empty().append(this.newLens(true));
        this.syncLenses();
    },
    insert: function(obj) {
        this.focus().before(this.newLens()).before(obj);
        if ($(".lens", obj).length) {
            this.focus().removeClass("focus");
            $(".lens", obj).first().addClass("focus");
        }
        this.syncLenses();
    },
    createHeading: function(block, size, text) {
        var $title = $("<h" + size + ">").html(text);
        this.insert(block ? $("<div>").addClass("page-header").append($title) : $title);
    },
    createParagraph: function(lead, text) {
        this.insert($("<p>").toggleClass("lead", lead).html(text));
    },
    createJumbotron: function() {
        this.insert($("<div>").addClass("jumbotron").append(this.newLens()));
    },
    createAlert: function(dismissable, colour) {
        var $alert = $("<div>").addClass("alert alert-" + colour);
        if (dismissable) {
            $alert.addClass("alert-dismissable")
                .append($("<button>").addClass("close").attr("type", "button").attr("data-dismiss", "alert")
                    .append($("<span>").html("&times;")));
        }
        this.insert($alert.append(this.newLens()));
    },
    createWell: function(size) {
        this.insert($("<div>").addClass("well" + (size ? " well-" + size : "")).append(this.newLens()));
    }
});
$(document).ready(function(e) {
    window.bp = new BootPolish("#bp-root");
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
        var text = prompt("Title (level " + size + "):", "");
        if (!text) return;
        bp.createHeading(block, size, text);
    }).bind(["p", "shift+p"], function(e, key) {
        var text = prompt((key === "p" ? "P" : "Lead p") + "aragraph:", "");
        if (!text) return;
        bp.createParagraph(key === "shift+p", text);
    }).bind("a", function(e, key) {
        var colour = prompt("Alert colour (success/info/warning/danger):", "info");
        if (["success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var dismissable = confirm("Dismissable?");
        bp.createAlert(dismissable, colour);
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
        var $panel = $("<div>").addClass("panel panel-" + colour);
        if (title) {
            var $heading = $("<div>").addClass("panel-heading").text(title);
            if (title[0] === "!") $heading.empty().append($("<h3>").addClass("panel-title").text(title.substr(1)));
            $panel.append($heading);
        }
        $panel.append($("<div>").addClass("panel-body").append($("<div>").addClass("lens focus")));
        if (footer) $panel.append($("<div>").addClass("panel-footer").append($("<div>").addClass("lens")));
        $(".lens.focus").before($("<div>").addClass("lens")).before($panel).removeClass("focus");
        bp.syncLenses();
    }).bind("b b", function(e, key) {
        var label = prompt("Button label:", "");
        if (!label) return;
        var size = prompt("Button size (lg/sm/xs, blank for normal):", "");
        if (["lg", "sm", "xs", ""].indexOf(size) === -1) return;
        var colour = prompt("Button colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<button>").addClass("btn" + (size ? " btn-" + size : "") + " btn-" + colour).text(label));
        bp.syncLenses();
    }).bind(["b d", "b shift+d"], function(e, key) {
        var label = prompt("Button label:", "");
        if (label === null) return;
        var size = prompt("Button size (lg/sm/xs, blank for normal):", "");
        if (["lg", "sm", "xs", ""].indexOf(size) === -1) return;
        var colour = prompt("Button colour (default/primary/success/info/warning/danger):", "default");
        if (["default", "primary", "success", "info", "warning", "danger"].indexOf(colour) === -1) return;
        var up = (key === "b shift+d");
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
        var $button = $("<button>").addClass("btn" + (size ? " btn-" + size : "") + " btn-" + colour + " dropdown-toggle").attr("data-toggle", "dropdown").text(label + " ").append($("<span>").addClass("caret"));
        var $root = $("<div>").addClass("drop" + (up ? "up" : "down")).append($button).append($dropdown);
        $(".lens.focus").before($("<div>").addClass("lens")).before($root);
        bp.syncLenses();
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
        bp.syncLenses();
    }).bind("f f", function(e, key) {
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<form>").append($("<div>").addClass("lens focus"))).removeClass("focus");
        bp.syncLenses();
    }).bind(["f i", "f e", "f n", "f p"], function(e, key) {
        var placeholder = prompt("Placeholder:", "");
        if (placeholder === null) return;
        var type = (key === "f i" ? "text" : (key === "f e" ? "email" : (key === "f n" ? "number" : "password")));
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<input>").attr("type", type).attr("placeholder", placeholder || undefined).addClass("form-control"));
        bp.syncLenses();
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
        bp.syncLenses();
    }).bind("f l", function(e, key) {
        var label = prompt("Label:", "");
        if (!label) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<label>").text(label));
        bp.syncLenses();
    }).bind("f s", function(e, key) {
        var label = prompt("Submit label:", "Submit");
        if (!label) return;
        $(".lens.focus").before($("<div>").addClass("lens")).before($("<input>").attr("type", "submit").addClass("btn btn-primary").val(label));
        bp.syncLenses();
    });
});
