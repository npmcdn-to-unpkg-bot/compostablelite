/**
 * Created by Sohail on 7/17/16.
 */

var Map = (function(){
   const  ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw',
    MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN,
    OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    function initMap() {
        var target = document.getElementById('leaflet-container');
        target.style.height = '500px';
        target.style.width  = '500px';
        var mymap = L.map('leaflet-container').setView([38.56, -121.44], 13);
        L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'mapbox.streets'}).addTo(mymap);
        return mymap;
    }
    

    
   document.addEventListener('DOMContentLoaded', function() {
        var mymap = initMap();

       var updated = false;

       // responsible for getting out of update cycle
       function checkForUpdatedData() {
          if (this.readyState === XMLHttpRequest.DONE) {
              if (this.status === 200) {
                  // check for data
                  var data = JSON.parse(this.responseText);
                  if (data.updated === true) {
                      updated = true;
                      L.marker([38.5646, -121.4443]).addTo(mymap).bindPopup("<b>Pickup at Suzi's</b><br />4:PM, Today.").openPopup();
                  }
              } else {
                  console.error("couldnt pull");
              }
          } 
       }

       // poll every 10 seconds
       var poller = setInterval(pollForData, 3 * 1000)
        function pollForData() {
            if (!updated) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = checkForUpdatedData;
                xhr.open('GET', '/update-check', true);
                xhr.send(null);
            } else {
               clearInterval(poller);
            }
        }
   });

})();