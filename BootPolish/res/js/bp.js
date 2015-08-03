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
    addLens("#bp-root", 0);
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
        var pos = $lenses.index($(".lens.focus"));
        if (pos === 0) return;
        var $all = $("#bp-root *");
        var start = $all.index($lenses.get(pos - 1));
        var end = $all.index($lenses.get(pos));
        $all.slice(start, end).remove();
        $lenses = $(".lens");
    }).bind(["1", "2", "3", "4", "5", "6"], function(e, key) {
        var title = prompt("Title (level " + key + "):", "");
        if (!title) return;
        addLens(".lens.focus", -1);
        $("<h" + key + ">").html(title).insertBefore(".lens.focus");
        $lenses = $(".lens");
    }).bind(["p", "shift+p"], function(e, key) {
        var para = prompt((key === "p" ? "P" : "Lead p") + "aragraph:", "");
        if (!para) return;
        addLens(".lens.focus", -1);
        $("<p>").toggleClass("lead", key === "shift+p").html(para).insertBefore(".lens.focus");
        $lenses = $(".lens");
    }).bind("x", function(e, key) {
        var text = prompt("Plain text:", "");
        if (!text) return;
        addLens(".lens.focus", -1);
        $(".lens.focus").before(text);
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
                addLens($cell, 0);
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
                addLens($cell, 0);
                $row.append($cell);
            }
            $tbody.append($row);
        }
        $table.append($tbody);
        addLens(".lens.focus", -1);
        $table.insertBefore(".lens.focus");
        $lenses = $(".lens");
        console.log($lenses.length);
    });
});
