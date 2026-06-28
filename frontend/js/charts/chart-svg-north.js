(function(APP){
  'use strict';

  function esc(v){ return APP.utils.escapeHTML(v == null ? '' : String(v)); }

  var PLANET_HINDI = {
  Sun:'सूर्य',
  Moon:'चंद्र',
  Mercury:'बुध',
  Venus:'शुक्र',
  Mars:'मंगल',
  Jupiter:'गुरु',
  Saturn:'शनि',
  Rahu:'राहु',
  Ketu:'केतु'
};
  var COLOR = { Su:'#ff8a3d', Mo:'#8ec5ff', Me:'#34d399', Ve:'#f0abfc', Ma:'#ff6b6b', Ju:'#facc15', Sa:'#a78bfa', Ra:'#22d3ee', Ke:'#e5e7eb' };

  var HOUSE_LAYOUT = {
    1:{s:[200,82], p:[200,116], a:'center', l:[200,142], box:{x:158,y:81,w:84,h:54}},
    2:{s:[116,40], p:[118,112], a:'center', box:{x:64,y:48,w:80,h:40}},
    3:{s:[82,136], p:[98,168], a:'center', box:{x:60,y:142,w:76,h:58}},
    4:{s:[116,202], p:[118,232], a:'center', box:{x:76,y:198,w:84,h:58}},
    5:{s:[92,275], p:[122,286], a:'center', box:{x:55,y:212,w:80,h:40}},
    6:{s:[55,360], p:[126,338], a:'center', box:{x:64,y:330,w:96,h:48}},
    7:{s:[200,310], p:[200,334], a:'center', box:{x:152,y:312,w:96,h:52}},
    8:{s:[286,326], p:[280,338], a:'center', box:{x:232,y:318,w:96,h:48}},
    9:{s:[318,260], p:[286,286], a:'center', box:{x:236,y:262,w:92,h:58}},
    10:{s:[284,202], p:[284,232], a:'center', box:{x:238,y:206,w:92,h:58}},
    11:{s:[304,136], p:[286,168], a:'center', box:{x:244,y:142,w:84,h:58}},
    12:{s:[284,72], p:[282,112], a:'center', box:{x:240,y:86,w:84,h:62}}
  };

  function signForHouse(lagnaNum, house){
    return ((Number(lagnaNum) + house - 2) % 12) + 1;
  }

  function codes(items){
    return (items || []).map(function(p){ return PLANET_HINDI[p.name] || String(p.name || ''); }).filter(Boolean);
  }

  function renderPlanets(layout, list){
      if (!layout || !list || !list.length) return '';

      var box = layout.box || {
        x: layout.p[0] - 42,
        y: layout.p[1] - 26,
        w: 84,
        h: 52
      };

      var cx = box.x + box.w / 2;
      var cy = box.y + box.h / 2;
      var count = list.length;
      var svg = '';

      function textAt(name, x, y, fontSize){
        svg += '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="middle" class="planet-code" style="font-size:'+fontSize+'px" fill="#e5edf8">'+esc(name)+'</text>';
      }

      if (count === 1) {
        textAt(list[0], cx, cy, 12.5);
        return svg;
      }

      if (count === 2) {
        textAt(list[0], cx, cy - 8, 12);
        textAt(list[1], cx, cy + 8, 12);
        return svg;
      }

      if (count === 3) {
        textAt(list[0], cx, cy - 12, 11.3);
        textAt(list[1], cx - 19, cy + 8, 10.8);
        textAt(list[2], cx + 19, cy + 8, 10.8);
        return svg;
      }

      if (count === 4) {
        textAt(list[0], cx - 20, cy - 9, 10.0);
        textAt(list[1], cx + 20, cy - 9, 10.0);
        textAt(list[2], cx - 20, cy + 9, 10.0);
        textAt(list[3], cx + 20, cy + 9, 10.0);
        return svg;
      }

      if (count === 5) {
        textAt(list[0], cx - 17, cy - 13, 9.8);
        textAt(list[1], cx + 17, cy - 13, 9.8);
        textAt(list[2], cx - 17, cy + 2, 9.8);
        textAt(list[3], cx + 17, cy + 2, 9.8);
        textAt(list[4], cx, cy + 16, 9.8);
        return svg;
      }

      var max = Math.min(count, 6);
      for (var i = 0; i < max; i++) {
        var col = i % 2;
        var row = Math.floor(i / 2);
        textAt(list[i], cx + (col === 0 ? -17 : 17), cy - 16 + row * 15, 9.2);
      }

      if (count > 6) {
        textAt('+' + (count - 6), cx, cy + 24, 9);
      }

      return svg;
    }


  function renderNorth(engineData){
    if (!engineData || !engineData.lagna || !engineData.lagna.rashi_num) {
      return '<div class="empty">चार्ट डेटा उपलब्ध नहीं है।</div>';
    }

    var lagna = Number(engineData.lagna.rashi_num);
    var signs = engineData.signs || {};
    var svg = '';

    svg += '<svg class="kundli-svg north-chart" viewBox="0 0 400 400" role="img" aria-label="North Indian Kundli">';
    svg += '<style>';
    svg += '.north-chart{background:radial-gradient(circle at center,#0f172a 0%,#06111f 76%);border-radius:12px;color:#e5edf8}';
    svg += '.north-chart line,.north-chart rect{stroke:#e5edf8}';
    svg += '.north-chart .sign-num{font-size:20px;font-weight:900;fill:#facc15;paint-order:stroke;stroke:#020617;stroke-width:3px}';
    svg += '.north-chart .planet-code{font-size:12px;font-weight:900;paint-order:stroke;stroke:#020617;stroke-width:3px}.north-chart .planet-code-small{font-size:10.5px}';
    svg += '.north-chart .lagna-mark{font-size:10px;font-weight:900;fill:#ffffff;paint-order:stroke;stroke:#020617;stroke-width:3px}';
    svg += '</style>';

    svg += '<rect x="8" y="8" width="384" height="384" rx="10" fill="none" stroke-width="2.2"/>';
    svg += '<line x1="8" y1="8" x2="392" y2="392" stroke-width="1.55"/>';
    svg += '<line x1="392" y1="8" x2="8" y2="392" stroke-width="1.55"/>';
    svg += '<line x1="200" y1="8" x2="392" y2="200" stroke-width="1.55"/>';
    svg += '<line x1="392" y1="200" x2="200" y2="392" stroke-width="1.55"/>';
    svg += '<line x1="200" y1="392" x2="8" y2="200" stroke-width="1.55"/>';
    svg += '<line x1="8" y1="200" x2="200" y2="8" stroke-width="1.55"/>';

    for (var h=1; h<=12; h++) {
      var sNum = signForHouse(lagna, h);
      var layout = HOUSE_LAYOUT[h];
      svg += '<text x="'+layout.s[0]+'" y="'+layout.s[1]+'" text-anchor="middle" class="sign-num">'+esc(sNum)+'</text>';
      svg += renderPlanets(layout, codes((signs[sNum] || {}).planets));
      if (h === 1 && layout.l) {
        svg += '<text x="'+layout.l[0]+'" y="'+layout.l[1]+'" text-anchor="middle" class="lagna-mark">लग्न</text>';
      }
    }

    svg += '</svg>';
    return svg;
  }

  APP.chartSVGNorth = { renderNorth: renderNorth };

})(window.APP);
