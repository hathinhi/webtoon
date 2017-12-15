/**
 * 랭킹
 */
var Ranking = new jindo.$Class({
	$autoBind : true,

	$init : function(htOption) {
		this._initVars(htOption);
		if (this._wel != null) {
			this._setEvent();
		}
	},

	_initVars : function(htOption) {
		this._oTemplate = jindo.$Template(htOption.sTemplateId);
		this._htGenre = htOption.htGenre;
		this._htApiInfo = htOption.htApiInfo;

		this._wel = jindo.$Element(htOption.sId);
		if (this._wel != null) {
			this._welFilterArea = this._wel.query('._filterArea');
			this._welFilterLayer = this._welFilterArea.query('._filterLayer');
			this._welTitleListArea = this._wel.query('._titleListArea');

			this._oFilterLayerManager = new jindo.LayerManager(this._welFilterLayer.$value(), {
				sCheckEvent : 'click'
			});
			this._oFilterLayerManager.link(this._welFilterArea.query('a.checked')).link(this._welFilterLayer.$value());
		}
	},

	/**
	 * 이벤트 핸들러 지정
	 */
	_setEvent : function() {
		this._welFilterArea.attach({
			'click@a.checked' : this._openFilterLayer,
			'click@._filterItem' : this._onClickFilterItem
		});
	},

	/**
	 * 필터 레이어 보이기
	 *
	 * @param oEvent {Wrapping Event} jindo Event
	 */
	_openFilterLayer : function(oEvent) {
		oEvent.stopDefault();
		this._welFilterLayer.show();
	},

	/**
	 * 필터 클릭 이벤트 처리
	 *
	 * @param oEvent {Wrapping Event} jindo Event
	 */
	_onClickFilterItem : function(oEvent) {
		oEvent.stopDefault();

		var elSelectedFilter = oEvent.element;
		var self = this;
		var oAjax = jindo.$Ajax(this._htApiInfo.sUrl, {
			type : 'xhr',
			timeout : 5,
			onload : function(oRes) {
				self._refresh(oRes.json());
				self._setFilterSelect(elSelectedFilter);
			}
		});

		var sFilter = jindo.$Element(elSelectedFilter).data('filter');
		var sParamName = this._htApiInfo.sParamName;
		var htParam = {};
		htParam[sParamName] = sFilter;
		htParam['count'] = this._htApiInfo.nCount;
		oAjax.request(htParam);

		this._welFilterLayer.hide();
	},

	/**
	 * 목록 갱신
	 *
	 * @param aTitleList {Array} 타이틀 json 배열
	 */
	_refresh : function(aTitleList) {
		if (!aTitleList || aTitleList.length == 0) {
			return;
		}

		var aHtml = [];
		for (var i = 0, n = aTitleList.length; i < n; i++) {
			var oTitle = aTitleList[i];
			oTitle['ranking'] = i + 1;
			if (this._htGenre) {
				oTitle['genreName'] = this._htGenre[oTitle.representGenre];
			}
			oTitle['cssGenreName'] = oTitle.representGenre.toLowerCase();
			var sHtml = this._oTemplate.process(oTitle);
			aHtml.push(sHtml);
		}
		this._welTitleListArea.html(aHtml.join('\n'));
	},

	/**
	 * 필터 선택 변경
	 *
	 * @param el {Element} 선택한 필터
	 */
	_setFilterSelect : function(el) {
		// 이전 선택 해제
        var welCheckIcon = this._welFilterLayer.query('.ico_chk');
        welCheckIcon.leave();

        // 신규 선택
        var wel = jindo.$Element(el);
		wel.append(welCheckIcon);
		this._welFilterArea.query('a.checked').html(wel.html());
	},

	/**
	 * 현재 선택된 필터 조회
	 *
	 * @return {String} 선택된 필터 파라미터
	 */
	getSelectedFilter : function() {
        return this._welFilterLayer.query('span.ico_chk').query('! ._filterItem').data('filter');
	}
});