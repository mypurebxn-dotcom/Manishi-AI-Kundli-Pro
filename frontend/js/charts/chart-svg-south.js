(function(APP){
  'use strict';

  function renderSouth(engineData){
    if (!engineData || !engineData.lagna || !engineData.lagna.rashi_num) {
      return '<div class="empty">दक्षिण भारतीय चार्ट डेटा उपलब्ध नहीं है।</div>';
    }

    return '<div class="empty">दक्षिण भारतीय चार्ट renderer skeleton ready है।</div>';
  }

  APP.chartSVGSouth = { renderSouth: renderSouth };

})(window.APP);
