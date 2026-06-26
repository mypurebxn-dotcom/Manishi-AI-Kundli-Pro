(function(APP){
  'use strict';

  function qs(sel){ return APP.utils && APP.utils.qs ? APP.utils.qs(sel) : document.querySelector(sel); }

  function bindPlaceAutocomplete(){
    var input = qs('#profilePlace');
    var box = qs('#placeSuggestions');

    if (!input || !box || !APP.geocoder || !APP.geocoder.search) return false;
    if (input.getAttribute('data-autocomplete-bound') === '1') return true;

    input.setAttribute('data-autocomplete-bound', '1');

    input.addEventListener('input', function(){
      var rows = APP.geocoder.search(input.value, 8);
      box.innerHTML = '';

      if (!input.value.trim() || !rows.length) return;

      rows.forEach(function(r){
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'place-item';
        d.textContent = r.place;
        d.setAttribute('data-place', r.place);

        d.addEventListener('click', function(){
          input.value = r.place;

          var lat = qs('#profileLat');
          var lon = qs('#profileLon');
          var tz  = qs('#profileTzOffset');

          if (lat) lat.value = r.lat;
          if (lon) lon.value = r.lon;
          if (tz) tz.value = '5.5';

          box.innerHTML = '';
        });

        box.appendChild(d);
      });
    });

    document.addEventListener('click', function(e){
      if (!box.contains(e.target) && e.target !== input) box.innerHTML = '';
    });

    return true;
  }

  APP.autocomplete = {
    bindPlaceAutocomplete: bindPlaceAutocomplete
  };

})(window.APP);
