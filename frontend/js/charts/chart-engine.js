(function(APP){
  'use strict';

  var RASHI_HI = {
    1:'मेष', 2:'वृषभ', 3:'मिथुन', 4:'कर्क',
    5:'सिंह', 6:'कन्या', 7:'तुला', 8:'वृश्चिक',
    9:'धनु', 10:'मकर', 11:'कुंभ', 12:'मीन'
  };

  function emptySigns(){
    var out = {};
    for (var i = 1; i <= 12; i++) {
      out[i] = {
        rashi_num: i,
        rashi_hi: RASHI_HI[i],
        planets: [],
        is_lagna: false
      };
    }
    return out;
  }

  function bySign(chartData){
    if (!chartData) return null;

    var signs = emptySigns();

    if (chartData.lagna && chartData.lagna.rashi_num) {
      var l = Number(chartData.lagna.rashi_num);
      if (signs[l]) signs[l].is_lagna = true;
    }

    (chartData.planets || []).forEach(function(p){
      var r = Number(p.rashi_num);
      if (signs[r]) {
        signs[r].planets.push({
          name: p.name,
          rashi_num: r,
          rashi_hi: p.rashi_hi || RASHI_HI[r],
          degree: p.degree,
          nakshatra: p.nakshatra,
          source: p.source || p
        });
      }
    });

    return {
      type: chartData.type,
      title: chartData.title,
      signs: signs,
      lagna: chartData.lagna,
      meta: chartData.meta || {}
    };
  }

  function build(type){
    if (!APP.chartData || !APP.chartData.build) return null;
    var data = APP.chartData.build(type || 'D1');
    return bySign(data);
  }

  APP.chartEngine = {
    bySign: bySign,
    build: build,
    rashiHi: RASHI_HI
  };

})(window.APP);
