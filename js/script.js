
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Google Street View Picture
    var streetName = $( "#street" ).val();
    var cityName = $( "#city" ).val();
    var address = streetName +  ', ' + cityName

    $greeting.text('So, you want to live at ' + address + '?');

    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '">'); 


    // NYTIMES Search API
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytimesUrl += '?' + $.param({
        'api-key': "9ee70048d785412695a0a4a4a9db7ec2",
        'q': cityName,
        'sort': "newest"
    });

    $.getJSON(nytimesUrl, function (data) {
        
        $nytHeaderElem.text('New York Times Articles about ' + address);

        articles = data.response.docs;

        for (i=0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        }

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    });

    // WIKI
    var wikiUrl = "https://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
        'action': "opensearch",
        'search': cityName,
        'format': "json",
        'callback': "wikiCallback"
    });

    // Remember to delete!
    console.log(wikiUrl);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data) {
            var articleList = data[1];
            var urlList = data[3];

            for (i=0; i < articleList.length; i++) {
                var article = articleList[i];
                var url = urlList[i];
                $wikiElem.append('<li><a href="' + url + '">' + article + '</a></li>');
            };
        }
    });

    return false;
};

$('#form-container').submit(loadData);
