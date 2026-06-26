(function(APP){
  'use strict';

  APP.chartSVG = {
    renderNorth:function(engineData){
      if(!APP.chartSVGNorth || !APP.chartSVGNorth.renderNorth){
        return '<div class="card">North renderer not loaded.</div>';
      }
      return APP.chartSVGNorth.renderNorth(engineData);
    },
    renderSouth:function(engineData){
      if(!APP.chartSVGSouth || !APP.chartSVGSouth.renderSouth){
        return '<div class="card">South renderer not loaded.</div>';
      }
      return APP.chartSVGSouth.renderSouth(engineData);
    },
    renderEast:function(engineData){
      if(!APP.chartSVGEast || !APP.chartSVGEast.renderEast){
        return '<div class="card">East renderer not loaded.</div>';
      }
      return APP.chartSVGEast.renderEast(engineData);
    }
  };

})(window.APP);
