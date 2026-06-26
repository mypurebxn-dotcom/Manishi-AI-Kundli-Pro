(function(APP){
  'use strict';

  APP.chartSVG = {
    renderNorth:function(engineData){
      if(!APP.chartSVGNorth || !APP.chartSVGNorth.renderNorth){
        return '<div class="card">North renderer not loaded.</div>';
      }
      return APP.chartSVGNorth.renderNorth(engineData);
    }
  };

})(window.APP);
