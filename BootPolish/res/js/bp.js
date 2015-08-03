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
        $lenses = $(".lens");
    }
    addLens("#bp-root", 0);
    $lenses.first().addClass("focus");
    Mousetrap.bind(["left", "right"], function(e, key) {
        var pos = $lenses.index($(".lens.focus").removeClass("focus"));
        $($lenses.get((pos + (key === "left" ? -1 : 1)) % $lenses.length)).addClass("focus");
    }).bind("backspace", function(e, key) {
        var pos = $lenses.index($(".lens.focus"));
        if (pos === 0) return;
        var $all = $("#bp-root *");
        var start = $all.index($lenses.get(pos - 1));
        var end = $all.index($lenses.get(pos));
        $all.slice(start, end).remove();
        $lenses = $(".lens");
    }).bind(["1", "2", "3", "4", "5", "6"], function(e, key) {
        var title = prompt("Title:", "");
        if (title === null) return;
        addLens(".lens.focus", -1);
        $("<h" + key + ">").html(title).insertBefore(".lens.focus");
    }).bind("p", function(e, key) {
        var para = prompt("Paragraph:", "");
        if (para === null) return;
        addLens(".lens.focus", -1);
        $("<p>").html(para).insertBefore(".lens.focus");
    });
});
