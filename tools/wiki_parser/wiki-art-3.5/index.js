function satisfy_variants(art) {
    return art.wikipedia_url.includes('en.wikipedia.org') && art.levenshtein_distance > 70;
}

$(document).ready(function () {
    console.log("ready!");
    $.getJSON("http://127.0.0.1:3000/wiki-art_2-3.json", function (data) {
        var items = [];
        const status = {};

        $.each(data, function (key, val) {
            if (satisfy_variants(val)) {
                status[val.username] = 0;
                items.push(`
                    <tr>
                        <td width="10%">
                            ${val.title}
                        </td>
                        <td width="5%">
                            ${val.artist}
                        </td>
                        <td width="20%">
                            <img src="${val.image_url}">
                        </td>
                        <td width="60%">
                            <iframe width="100%" height="100%" src="${val.wikipedia_url}"></iframe>
                        </td>
                        <td width="5%">
                            <input username="${val.username}" type="radio" name="${val.username}" value="0" checked> 0<br>
                            <input username="${val.username}" type="radio" name="${val.username}" value="1"> 1<br>
                            <input username="${val.username}" type="radio" name="${val.username}" value="2"> 2
                        </td>
                    </tr>
                `);
            }
        });

        $("<table/>", {
            html: items.join("")
        }).appendTo("body");


        $('input[type=radio]').change(function () {
            status[$(this).attr('username')] = parseInt(this.value);
            $('#result').html(JSON.stringify(status));
            console.log(status);
        });
    });
});
