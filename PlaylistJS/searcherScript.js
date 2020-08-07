var CLIENT_ID = '';
var CLIENT_SECRET = '';
var accessToken = '';

var searchOffset = 0;
var playlistArray = [];

// Get access token first
var getToken = function() {
    $.post({
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: "Basic " + btoa(CLIENT_ID+":"+CLIENT_SECRET),
        },
        data: {
            grant_type: 'client_credentials'
        },
        success: function (response) {
            accessToken = response.access_token;
            console.log("Token is: " + accessToken);
        }
    });
}
getToken();

//Other setup
$("#tableBody").on('click', 'tr', function() {
    var playlist = playlistArray[$(this).index()];

    // Save stuff
    sessionStorage.setItem("playlistID", playlist.id);
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("playlistName", playlist.name);
    sessionStorage.setItem("playlistOwner", playlist.owner.display_name);
    sessionStorage.setItem("playlistNumSongs", playlist.tracks.total);
    window.location.href = "Redirects/Create.html";
});
$("#tableFoot").on('click', 'td', function() {
    //Load more
    searchOffset += 50;
    searchForPlaylist(document.getElementById('nameQuery').value, searchOffset);
});

// Spotify API stuff
var loadTable = function(data) {
    // Clear table
    $("#tableBody").empty();
    $("#tableFoot").empty();

    // Clear playlist IDs
    playlistArray = [];

    // Add new playlists to table
    for (var i=0; i<data.length; i++) {
        var playlist = data[i];
        var newRow = document.getElementById('resultsTable').getElementsByTagName('tbody')[0].insertRow();
        newRow.insertCell().innerHTML = playlist.name;
        newRow.insertCell().innerHTML = playlist.owner.display_name;
        newRow.insertCell().innerHTML = playlist.tracks.total;

        // Add playlists
        playlistArray.push(playlist);
    }
}

var DevinPlaylists = function() {
    $.get({
        url: 'https://api.spotify.com/v1/users/1256474325/playlists',
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        data: {
            limit: 50
        },
        success: function (response) {
            console.log(response);
            loadTable(response.items);
        }
    });
};

var searchForPlaylist = function(name, offset) {
    $.get({
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        data: {
            q: name,
            type: 'playlist',
            limit: 50,
            offset: offset,
        },
        success: function (response) {
            console.log(response);
            loadTable(response.playlists.items);

            if (response.playlists.items.length == 50) {
                var newRow = $("#tableFoot")[0].insertRow();
                var newCell = newRow.insertCell();
                newCell.innerHTML = "Show next page...";
                newCell.style.color = "blue";
                newRow.style.textDecoration = "underline";
            }
        }
    })
};

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Submit pressed.");
    searchOffset = 0;
    searchForPlaylist(document.getElementById('nameQuery').value, searchOffset);
});
