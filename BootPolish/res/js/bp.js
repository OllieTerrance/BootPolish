"use strict";
var BootPolish = function(root, visible) {
    this.$root = $(root).toggleClass("bp-edit", !!visible);
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
        return this;
    },
    focus: function() {
        return $(".lens.focus", this.$root);
    },
    showEdit: function(show) {
        this.$root.toggleClass("bp-edit", show);
        return this;
    },
    nav: function(fwd) {
        var pos = this.$lenses.index(this.focus().removeClass("focus"));
        $(this.$lenses.get((pos + fwd) % this.$lenses.length)).addClass("focus");
        return this;
    },
    del: function() {
        var $focus = this.focus();
        if ($focus.prev().is(".lens")) {
            var $contents = $focus.parent().contents();
            $contents.slice($contents.index($focus.prev()), $contents.index($focus)).remove();
        } else {
            $focus.prevUntil(".lens").prev().andSelf().remove();
        }
        return this.syncLenses();
    },
    delSiblings: function() {
        this.focus().parent().empty().append(this.newLens(true));
        return this.syncLenses();
    },
    insert: function(obj) {
        this.focus().before(this.newLens()).before(obj);
        if ($(".lens", obj).length) {
            this.focus().removeClass("focus");
            $(".lens", obj).first().addClass("focus");
        }
        return this.syncLenses();
    },
    createHeading: function(text, size, block) {
        var $title = $("<h" + size + ">").html(text);
        return this.insert(block ? $("<div>").addClass("page-header").append($title) : $title);
    },
    createParagraph: function(text, lead) {
        return this.insert($("<p>").toggleClass("lead", !!lead).html(text));
    },
    createJumbotron: function() {
        return this.insert($("<div>").addClass("jumbotron").append(this.newLens()));
    },
    createAlert: function(colour, dismissable) {
        var $alert = $("<div>").addClass("alert alert-" + colour);
        if (dismissable) {
            $alert.addClass("alert-dismissable")
                .append($("<button>").addClass("close").attr("type", "button").attr("data-dismiss", "alert")
                    .append($("<span>").html("&times;")));
        }
        return this.insert($alert.append(this.newLens()));
    },
    createPanel: function(title, asHeading, footer, colour) {
        var $panel = $("<div>").addClass("panel panel-" + colour);
        if (title) {
            var $heading = $("<div>").addClass("panel-heading");
            $heading.append(asHeading ? $("<h3>").addClass("panel-title").text(title) : title);
            $panel.append($heading);
        }
        $panel.append($("<div>").addClass("panel-body").append(this.newLens()));
        if (footer) $panel.append($("<div>").addClass("panel-footer").append(this.newLens()));
        return this.insert($panel);
    },
    createWell: function(size) {
        return this.insert($("<div>").addClass("well" + (size ? " well-" + size : "")).append(this.newLens()));
    },
    createButtonToolbar: function() {
        return this.insert($("<div>").addClass("btn-toolbar").attr("role", "toolbar").append(this.newLens()));
    },
    createButtonGroup: function(horiz) {
        return this.insert($("<div>").addClass("btn-group" + (horiz ? "" : "-vertical")).attr("role", "group").append(this.newLens()));
    },
    createButton: function(label, colour, size, dropdown) {
        if (dropdown) {
            var $menu = $("<ul>").addClass("dropdown-menu").append(dropdown.elements);
            var $button = $("<button>").addClass("btn" + (size ? " btn-" + size : "") + " btn-" + colour + " dropdown-toggle").attr("data-toggle", "dropdown")
                    .text(label + " ").append($("<span>").addClass("caret"));
            return this.insert($("<div>").addClass("drop" + dropdown.direction).append($button).append($menu));
        } else {
            return this.insert($("<button>").addClass("btn" + (size ? " btn-" + size : "") + " btn-" + colour).text(label));
        }
    },
    createTable: function(rows, cols, asHeader) {
        var $table = $("<table>").addClass("table table-bordered");
        if (asHeader) {
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
        return this.insert($table.append($tbody));
    },
    createForm: function(horiz) {
        return this.insert($("<form>").toggleClass("form-horizontal", horiz).append(this.newLens()));
    },
    createFormGroup: function() {
        return this.insert($("<div>").addClass("form-group").append(this.newLens()));
    },
    createFormLabel: function(label) {
        return this.insert($("<label>").text(label));
    },
    createFormInput: function(type, placeholder) {
        return this.insert($("<input>").attr("type", type).addClass("form-control").attr("placeholder", placeholder));
    },
    createFormDropdown: function(dropdown) {
        return this.insert($("<select>").addClass("form-control").append(dropdown.elements));
    },
    createFormButton: function(type, label, colour, size) {
        return this.insert($("<input>").attr("type", type).addClass("btn" + (size ? " btn-" + size : "") + " btn-" + colour).val(label));
    }
});
BootPolish.Dropdown = function(native) {
    this.elements = [];
    this.direction = "down";
    this.native = native;
}
$.extend(BootPolish.Dropdown.prototype, {
    setDropup: function(up) {
        this.direction = (up ? "up" : "down");
        return this;
    },
    addSeparator: function() {
        if (!this.native) this.elements.push($("<li>").addClass("divider").attr("role", "separator"));
        return this;
    },
    addHeading: function(text) {
        if (!this.native) this.elements.push($("<li>").addClass("dropdown-header").text(text));
        return this;
    },
    addOption: function(text, url) {
        if (this.native) {
            this.elements.push($("<option>").text(text));
        } else {
            this.elements.push($("<li>").append($("<a>").attr("href", url).text(text)));
        }
        return this;
    }
});
