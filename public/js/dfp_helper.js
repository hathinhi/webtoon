/**
 * Created by sungsu Park on 2017-04-12.
 */
var DFPHelper = DFPHelper || {
       /**
         * 광고 생성
         * @param slotId
         * @param wrapperId
         * @param adDIvId
         * @params sizes ([[100,100], [200, 200] ...], [100,100])
         */
        createAd : function(slotId, wrapperId, adDIvId, sizes, targetings, criteoOptions) {
           $.when(this._init(wrapperId, adDIvId))
           .then(function() {
               return CriteoHelper.init(adDIvId, criteoOptions);
           })
           .then($.proxy(function() {
               this._create(adDIvId, slotId, sizes, targetings);
           },this));
        },

        /**
         * DFP 관련 스크립트 로딩(초기화)
         * @returns {Deferred}
         * @private
         */
        _init : function(wrapperId, adDIvId) {
            var promise = $.Deferred();
            var script = document.createElement('script');
            script.id = "_googleAdScript";
            script.src = "https://www.googletagservices.com/tag/js/gpt.js";

            script.onload = function(e) {
                window.googletag = window.googletag || {};
                googletag.cmd = googletag.cmd || [];
                promise.resolve();
            };

            document.getElementsByTagName('head')[0].appendChild(script);

            var div = document.createElement('div');
            div.setAttribute("id", adDIvId);
            document.getElementById(wrapperId).appendChild(div);

            return promise;
        },

        /**
         * 광고 생성
         *  - script를 삽입하는 코드가 있는 이유는 구글에서 광고 노출관련 스크립트를 <div> 하위에서 호출하도록 가이드 주었기 떄문.
         * @param adDIvId
         * @param slotId
         * @param sizes
         * @param targetings
         * @private
         */
        _create: function (adDIvId, slotId, sizes, targetings) {
            googletag.cmd.push(function () {
                var googletagSlot = googletag.defineSlot(slotId, sizes, adDIvId)
                    .addService(googletag.pubads())
                    .setCollapseEmptyDiv(true, true);

                DFPHelper._addTargeting(googletagSlot, targetings);

                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
            });

            var script = document.createElement('script');
            script.innerHTML = "googletag.cmd.push(function() { googletag.display('" + adDIvId + "'); })";
            document.getElementById(adDIvId).appendChild(script);
        },

        /**
         * 타겟팅 추가
         * @param googletagSlot
         * @param targetings
         * @private
         */
        _addTargeting : function(googletagSlot, targetings) {
            for(var key in targetings) {
                googletagSlot.setTargeting(key, targetings[key]);
            }
        }
};

/**
 * 크리테오 광고 설정 도구
 * @type {{init: CriteoHelper.init, _getPlacements: CriteoHelper._getPlacements, _launchAdServer: CriteoHelper._launchAdServer}}
 */
var CriteoHelper = CriteoHelper || {
        /**
         * Criteo 관련 스크립트 로딩(초기화)
         * @returns {Deferred}
         * @private
         */
        init : function(slotDivId, options) {
            var promise = $.Deferred();
            var script = document.createElement('script');
            script.id = "_criteoAdScript";
            script.src = "https://static.criteo.net/js/ld/publishertag.js";

            script.onload = function(e) {
                var placements = CriteoHelper._getPlacements(slotDivId, options.criteoZoneIds);
                window.CriteoAdUnits = { "placements": placements};
                window.Criteo = window.Criteo || {};
                window.Criteo.events = window.Criteo.events || [];
                googletag.cmd.push(function() {
                    googletag.pubads().disableInitialLoad();
                });

                Criteo.events.push(function() {
                    Criteo.SetLineItemRanges(options.lineItemRanges);
                    Criteo.RequestBids(CriteoAdUnits, CriteoHelper._launchAdServer, 2000);
                });

                promise.resolve();
            };

            document.getElementsByTagName('head')[0].appendChild(script);

            return promise;
        },

        _getPlacements : function (slotDivId, criteoZoneIds) {
            var placements = [];
            for(var i=0;i<criteoZoneIds.length;i++) {
                placements.push({
                    "slotid" : slotDivId,
                    "zoneid" : criteoZoneIds[i]
                });
            };

            return placements;
        },

        _launchAdServer : function () {
            googletag.cmd.push(function () {
                Criteo.SetDFPKeyValueTargeting();
                googletag.pubads().refresh();
            });
        }
    };
