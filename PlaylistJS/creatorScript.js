// Retrieve
var playlistID = sessionStorage.getItem("playlistID");
var accessToken = sessionStorage.getItem("accessToken");
var offset = 0;

var setupText = function() {
    document.getElementById('playlistName').innerHTML = "Name: " + sessionStorage.getItem("playlistName");
    document.getElementById('playlistOwner').innerHTML = "Made By: " + sessionStorage.getItem("playlistOwner");
    document.getElementById('playlistNumSongs').innerHTML = "No. Songs: " + sessionStorage.getItem("playlistNumSongs");
}

var getTracksFromPlaylist = function(ID, offset) {
    var url = 'https://api.spotify.com/v1/playlists/' + ID + '/tracks';
    $.get({
        url: url,
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        data: {
            limit: 100,
            offset: offset,
        },
        success: function (response) {
            console.log(response);

            var data = response.items;
            // Add all tracks to table
            for (var i=0; i<data.length; i++) {
                var track = data[i].track;
                var newRow = document.getElementById('songTable').getElementsByTagName('tbody')[0].insertRow();
                newRow.insertCell().innerHTML = track.name;
                newRow.insertCell().innerHTML = track.album.name;
                newRow.insertCell().innerHTML = track.artists[0].name;
            }

            if (data.length == 100) {
                getTracksFromPlaylist(ID, offset+100);
            }
        }
    });
}

setupText();
offset = 0;
getTracksFromPlaylist(playlistID, offset);
