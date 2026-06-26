(function(APP){
  'use strict';

  function esc(v){
    return v == null ? '' : String(v);
  }

  function getResult(){
    return APP.state ? APP.state.get('lastResult') : null;
  }

  function getCalculation(result){
    result = result || getResult();
    if (!result) return null;
    if (result.calculation) return result.calculation;
    if (result.backend && result.backend.calculation) return result.backend.calculation;
    return null;
  }

  function getLagna(calc){
    return calc && calc.lagna ? calc.lagna : null;
  }

  function getPlanets(calc){
    return calc && Array.isArray(calc.planets) ? calc.planets : [];
  }

  function getHouses(calc){
    return calc && Array.isArray(calc.houses) ? calc.houses : [];
  }

  function buildD1(calc){
    calc = calc || getCalculation();
    if (!calc) return null;

    return {
      type: 'D1',
      title: 'D1 राशि चार्ट',
      lagna: getLagna(calc),
      planets: getPlanets(calc),
      houses: getHouses(calc),
      meta: calc.meta || {}
    };
  }

  function buildD9(calc){
    calc = calc || getCalculation();
    if (!calc) return null;

    var planets = getPlanets(calc).map(function(p){
      return {
        name: p.name,
        rashi: p.d9_rashi,
        rashi_hi: p.d9_rashi_hi,
        rashi_num: p.d9_rashi_num,
        source: p
      };
    });

    return {
      type: 'D9',
      title: 'D9 नवांश चार्ट',
      lagna: calc.lagna ? {
        rashi: calc.lagna.d9_rashi,
        rashi_hi: calc.lagna.d9_rashi_hi,
        rashi_num: calc.lagna.d9_rashi_num,
        source: calc.lagna
      } : null,
      planets: planets,
      houses: [],
      meta: calc.meta || {}
    };
  }


  function buildDivisional(calc, type, label, fieldPrefix){
    calc = calc || getCalculation();
    if (!calc) return null;

    var numKey = fieldPrefix + '_rashi_num';
    var hiKey = fieldPrefix + '_rashi_hi';
    var rawKey = fieldPrefix + '_rashi';

    var planets = getPlanets(calc)
      .filter(function(p){ return p && p[numKey]; })
      .map(function(p){
        return {
          name: p.name,
          rashi: p[rawKey],
          rashi_hi: p[hiKey],
          rashi_num: p[numKey],
          source: p
        };
      });

    var lagna = null;
    if (calc.lagna && calc.lagna[numKey]) {
      lagna = {
        rashi: calc.lagna[rawKey],
        rashi_hi: calc.lagna[hiKey],
        rashi_num: calc.lagna[numKey],
        source: calc.lagna
      };
    }

    return {
      type: type,
      title: type + ' ' + label + ' चार्ट',
      lagna: lagna,
      planets: planets,
      houses: [],
      meta: calc.meta || {}
    };
  }

  function buildD10(calc){
    return buildDivisional(calc, 'D10', 'दशमांश', 'd10');
  }

  function buildD60(calc){
    return buildDivisional(calc, 'D60', 'षष्ट्यांश', 'd60');
  }

  var BUILDERS = {
    D1: buildD1,
    D9: buildD9,
    D10: buildD10,
    D60: buildD60
  };

  function build(type, calc){
    type = esc(type || 'D1').toUpperCase();
    var builder = BUILDERS[type] || null;
    return builder ? builder(calc) : null;
  }

  APP.chartData = {
    getCalculation: getCalculation,
    build: build,
    builders: BUILDERS,
    buildD1: buildD1,
    buildD9: buildD9,
    buildD10: buildD10,
    buildD60: buildD60
  };

})(window.APP);
