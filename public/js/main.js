$(document).ready(function () {
    var $audio, $box, $progress, $list;

    $audio    = $('#audio');
    $list     = $('#list');

    $audio.attr({
        controls : true,
        autoplay : true
    });

    client.on('open', function () {
        audio.list(setupList);
    });

    client.on('stream', function (stream) {
        audio.download(stream, function (err, src) {
            $audio.attr('src', src);
            $audio.on('ended', function(e){
                var tags = document.getElementsByTagName('a');
                var total = tags.length
                var number = Math.floor(Math.random() * total) 

                var tag = tags[number];
                tag.click();


            })
        });
    });

    function setupList(err, files) {
        var $ul, $li;

        $list.empty();
        $ul   = $('<ul>').appendTo($list);

        files.forEach(function (file) {
            $li = $('<li>').appendTo($ul);
            $a  = $('<a>').appendTo($li);

            $a.attr('href', '#').text(file).click(function (e) {
                fizzle(e);

                var name = $(this).text();
                audio.request(name);
            });
        });
    }

});
