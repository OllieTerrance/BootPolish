$(document).ready(function(e) {
    var $lenses;
    function addLens(node) {
        $(node).append($("<div>").addClass("lens"));
        $lenses = $(".lens");
    }
    addLens("#bp-root");
    $lenses.first().addClass("focus");
    Mousetrap.bind(["left", "right"], function(e, key) {
        var pos = $lenses.index($(".lens.focus").removeClass("focus"));
        $($lenses.get((pos + (key === "left" ? -1 : 1)) % $lenses.length)).addClass("focus");
    });
});
