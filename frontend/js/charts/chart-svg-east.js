(function(APP){
  'use strict';

  function renderEast(engineData){
    if (!engineData || !engineData.lagna || !engineData.lagna.rashi_num) {
      return '<div class="empty">पूर्व भारतीय चार्ट डेटा उपलब्ध नहीं है।</div>';
    }

    return '<div class="empty">पूर्व भारतीय चार्ट renderer skeleton ready है।</div>';
  }

  APP.chartSVGEast = { renderEast: renderEast };

})(window.APP);
