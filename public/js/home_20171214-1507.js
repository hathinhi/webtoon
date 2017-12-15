var Home=jindo.$Class({$autoBind:true,$init:function(){this._initVars();this._changeWeekday(this._getCurrentWeekdayIndex());this._initFavoriteGenre();this._initHotAndNew();this._instance.layerNoticePopup.checkNotice();var self=this;setTimeout(function(){self._changeWeekday(self._getCurrentWeekdayIndex())},150);this._welDailyTab.attach("click@.btn_daily",this._onClickWeekdayTab);this._welWeekdayList.attach({"mouseover@.card_front":this._onMouseOverCard,"click@.btn_more":this._onClickMoreBtn})},_initVars:function(){this._welWeekdayList=jindo.$Element("weekdayList");this._welDailyTab=jindo.$Element("dailyTab");this._welBlind=this._welWeekdayList.query("h2.blind");this._sBlindSurfix=this._welBlind.text().split(" ")[1];this._welFavoriteGenreTitleList=jindo.$Element("favoriteGenreTitleList");this._welHotAndNew=jindo.$Element("hotAndNew");this._instance={layerNoticePopup:new LayerNoticePopup()}},_initFavoriteGenre:function(){var MIN_TITLE_COUNT=4;var aGenreList=this._extractFavoriteGenreList(4);var aHtml=[];var bUnderCount=false;for(var i=0;i<aGenreList.length;i++){var sCurrentGenre=aGenreList[i];new jindo.$Ajax("/"+gsContentLanguage+"/getFavoriteGenreTitleList",{type:"xhr",method:"get",async:false,timeout:5,onload:function(oRes){var oJson=oRes.json();bUnderCount=(oJson.length<MIN_TITLE_COUNT);var htParam={genre:sCurrentGenre,genreName:ghtGenreList[sCurrentGenre].sName,genreSeoCode:ghtGenreList[sCurrentGenre].sSeoCode,genreInstruction:ghtGenreList[sCurrentGenre].sIntoduction,titleList:oJson};var sHtml=jindo.$Template("tplFavoriteGenre").process(htParam);aHtml.push(sHtml)}}).request({genre:sCurrentGenre});if(bUnderCount){aHtml.pop();bUnderCount=false}if(aHtml.length==2){break}}this._welFavoriteGenreTitleList.html(aHtml.join("\n"));this._welFavoriteGenreTitleList.attach({"mouseover@.card_front":this._onMouseOverCard})},_initHotAndNew:function(){if(!this._welHotAndNew){return}var itemCount=0;var itemPerPage=4;var oPagenation=null;if(this._welHotAndNew.data("item-count")!=null){itemCount=Number(this._welHotAndNew.data("item-count"))}else{itemCount=0}this._welHotAndNew.attach({"mouseover@.card_front":this._onMouseOverCard,"click@._prevBtn":function(oEvent){oEvent.stopDefault();oHotAndNewRolling.moveBy(-itemPerPage);var nPage=getCurrentPage();oPagenation&&oPagenation.movePageTo(nPage)},"click@._nextBtn":function(oEvent){oEvent.stopDefault();oHotAndNewRolling.moveBy(itemPerPage);var nPage=getCurrentPage();oPagenation&&oPagenation.movePageTo(nPage)}});var oHotAndNewRolling=new jindo.CircularRolling(jindo.$("rolling"),{nDuration:400});if(jindo.$("hotAndNewPagination")){oPagenation=new jindo.Pagination("hotAndNewPagination",{nItem:itemCount,nItemPerPage:itemPerPage,sInsertTextNode:"\n",sClassFirst:"",sClassLast:"",sPageTemplate:'<a href="#" class="ico_pg N=a:hnn.page,g:'+sNclkLanguageCode+'">{=page}</a>',sCurrentPageTemplate:'<strong class="ico_pg">{=page}</strong>'}).attach({click:function(oCustomEvent){var nMoveCount=this.getItemPerPage();var current=getCurrentPage();var maximum=Math.ceil(itemCount/itemPerPage);var event=oCustomEvent.nPage;if(getRightMoving(current,event,maximum)>-getLeftMoving(current,event,maximum)){nMoveCount*=getLeftMoving(current,event,maximum)}else{if(getRightMoving(current,event,maximum)<-getLeftMoving(current,event,maximum)){nMoveCount*=getRightMoving(current,event,maximum)}else{if(current<event){nMoveCount*=getRightMoving(current,event,maximum)}else{nMoveCount*=getLeftMoving(current,event,maximum)}}}oHotAndNewRolling.moveBy(nMoveCount)}})}var welMultiSummary=this._welHotAndNew.query("li.card_multi p.summary");Util.ellipsis(welMultiSummary,"div.ellipsis_wrap");function getCurrentPage(){return(oHotAndNewRolling.getIndex()%itemCount)/itemPerPage+1}function getRightMoving(current,event,max){if(event<current){event+=max}return event-current}function getLeftMoving(current,event,max){if(current<event){current+=max}return event-current}},_getCurrentWeekdayIndex:function(){var oDate=jindo.$Date();var nDay=oDate.day()-1<0?6:oDate.day()-1;return nDay},_changeWeekday:function(nIndex){var aDailyTab=this._welDailyTab.queryAll("li");for(var i=0,n=aDailyTab.length;i<n;i++){var welDailyTab=aDailyTab[i];if(welDailyTab.hasClass("on")){welDailyTab.removeClass("on")}if(i==nIndex){welDailyTab.addClass("on")}}var aWeekdayList=this._welWeekdayList.queryAll("ul.card_lst");for(var i=0,n=aWeekdayList.length;i<n;i++){var welWeekdayList=aWeekdayList[i];if(welWeekdayList.visible()==true){welWeekdayList.hide()}if(i==nIndex){welWeekdayList.show();var welMultiSummary=welWeekdayList.query("li.card_multi p.summary");Util.ellipsis(welMultiSummary,"div.ellipsis_wrap")}}this._changeBlindText()},_changeBlindText:function(){var sWeekdayName=this._welDailyTab.query("li.on a").text();this._welBlind.text(sWeekdayName+" "+this._sBlindSurfix)},_onClickWeekdayTab:function(oEvent){oEvent.stopDefault();var nIndex=jindo.$Element("dailyTab").indexOf(oEvent.element.parentNode);this._changeWeekday(nIndex)},_onMouseOverCard:function(oEvent){var elSummary=jindo.$$.getSingle("+ div.card_back div.info p.summary",oEvent.element);var welSummary=jindo.$Element(elSummary);if(welSummary.data("ellipsised")&&welSummary.data("ellipsised")==true){return}Util.ellipsis(welSummary,"div.info",5);welSummary.data("ellipsised",true)},_onClickMoreBtn:function(oEvent){oEvent.stopDefault();var sWeekday=this._welDailyTab.query("li.on").data("weekday");clickcr(this,"hdy.more","","",oEvent,sNclkLanguageCode);location.href=oEvent.element.href+"?weekday="+sWeekday},_extractFavoriteGenreList:function(nExtractCount){var oRecentWebtoon=new RecentWebtoon();aRecentWebtoon=oRecentWebtoon.get(gsContentLanguage)||[];for(var i=0;i<aRecentWebtoon.length;i++){var oRecentWebtoon=aRecentWebtoon[i];if(oRecentWebtoon.bChallenge==true){continue}var sGenre=oRecentWebtoon.genreCode;if(!sGenre){continue}if(sGenre==true){continue}if(ghtGenreList[sGenre]==undefined){continue}ghtGenreList[sGenre].nCount++}var whtGenreList=jindo.$H(ghtGenreList);whtGenreList.sort(function(val1,val2){var nCount1=val1.nCount;var nCount2=val2.nCount;return nCount2-nCount1});var aFavoriteGenreList=[];var aNotFavoriteGenreList=[];whtGenreList.forEach(function(v,k,o){if(v.nCount>0){aFavoriteGenreList.push(k)}else{aNotFavoriteGenreList.push(k)}});var waFavoriteGenreList=jindo.$A(aFavoriteGenreList).concat(jindo.$A(aNotFavoriteGenreList).shuffle().slice(0,nExtractCount));return waFavoriteGenreList.slice(0,nExtractCount).$value()}});
var MainBanner=new jindo.$Class({$autoBind:true,$init:function(){if(!jindo.$Element("mainBannerList")){return}this._initVars();if(this._nBannerCount==1){jindo.$Element(mainBannerPagination).hide();return}this._welMainBannerList.attach({"mouseenter@._largeBannerArea":this._stopRolling,"mouseleave@._largeBannerArea":this._startRolling});this._startRolling()},_initVars:function(){this._nCurrentIndex=0;this._welMainBannerList=jindo.$Element("mainBannerList");this._aBannerList=jindo.$$("._largeBanner",this._welMainBannerList);this._nBannerCount=this._aBannerList.length;this._nDuration=4000;this._fpRolling=null;this._oTimer=new jindo.Timer();var self=this;this._oPagination=new jindo.Pagination("mainBannerPagination",{nItem:this._nBannerCount,nItemPerPage:1,sInsertTextNode:"\n",sClassFirst:"",sClassLast:"",sPageTemplate:'<a href="#" class="ico_pg2">{=page}</a>',sCurrentPageTemplate:'<strong class="ico_pg2">{=page}</strong>'}).attach({move:function(oCustomEvent){self._move(oCustomEvent.nPage)}})},_move:function(nPage){var nTargetIndex=nPage-1;var welTargetBanner=jindo.$Element(this._aBannerList[nTargetIndex]);var welCurrentBanner=jindo.$Element(this._aBannerList[this._nCurrentIndex]);this._changeBanner(welCurrentBanner,welTargetBanner);this._nCurrentIndex=nTargetIndex},_moveNext:function(){var nNextIndex=this._nCurrentIndex==this._nBannerCount-1?0:this._nCurrentIndex+1;this._oPagination.movePageTo(nNextIndex+1);return true},_changeBanner:function(welCurrent,welNext){if(jindo.$Agent().navigator().ie&&jindo.$Agent().navigator().version<=9){welNext.show().css({opacity:"1",filter:"alpha(opacity=100)"});welCurrent.hide().css({opacity:"0",filter:"alpha(opacity=0)"})}else{var self=this;new jindo.Morph().pushCall(function(){var aBannerList=self._aBannerList;for(var i=0,n=aBannerList.length;i<n;i++){var welBanner=jindo.$Element(aBannerList[i]);if(welNext.$value()==welBanner.$value()){welBanner.css({opacity:0,display:"block"})}else{if(welCurrent.$value()==welBanner.$value()){welBanner.css({opacity:1,display:"block"})}else{welBanner.css({opacity:0,display:"none"})}}}}).pushAnimate(2000,[welCurrent,{"@opacity":0},welNext,{"@opacity":1}]).pushCall(function(){welCurrent.hide()}).play()}},_startRolling:function(){this._oTimer.start(this._moveNext,this._nDuration)},_stopRolling:function(){this._oTimer.abort()}});
var EventWinnerPopup=jindo.$Class({$autoBind:true,$init:function(){this._getEventWinnerPopupInfo()},_getEventWinnerPopupInfo:function(){var self=this;jindo.$Ajax("/"+contentLanguageCode+"/event/winnerInfoNotice",{type:"xhr",method:"get",onload:function(oRes){var oJson=oRes.json();if(oJson.popupInfo){self._showPopup(oJson.popupInfo)}},}).request({})},_showPopup:function(oPopupInfo){var oTemplate=jindo.$Template("eventWinnerPopup");var sHtml=oTemplate.process(oPopupInfo);this._welPopup=jindo.$Element("<div>");this._welPopup.html(sHtml);jindo.$Element(document.body).append(this._welPopup).css("overflow","hidden");this._welPopup.attach({"click@._btnSubmit":this._onClickSubmitButton,"click@._btnClose":this._onClickCloseButton,"keyup@#winner_name":this._checkInput,"keyup@#winner_email":this._checkInput,"keyup@#winner_addr":this._checkInput,"keyup@#winner_phone":this._checkInput,"click@#chk_term":this._onClickChkbox,"click@#chk_term2":this._onClickChkbox})},_onClickSubmitButton:function(oEvent){oEvent.stopDefault();this._checkInput();if(this._welPopup.query("._btnSubmit").attr("disabled")){return}var htParams={};if(this._getInputValue("winner_name")!=null){htParams.userName=this._getInputValue("winner_name")}if(this._getInputValue("winner_email")!=null){htParams.email=this._getInputValue("winner_email")}if(this._getInputValue("winner_phone")!=null){htParams.phoneNumber=this._getInputValue("winner_phone")}if(this._getInputValue("winner_addr")!=null){htParams.address=this._getInputValue("winner_addr")}var self=this;jindo.$Ajax("/"+contentLanguageCode+"/event/saveWinnerInfo",{type:"xhr",method:"post",onload:function(oRes){if(oRes.json().success){self._welPopup.leave()}}}).request(htParams)},_onClickCloseButton:function(oEvent){oEvent.stopDefault();if(this._welPopup){this._welPopup.leave()}jindo.$Element(document.body).css("overflow","")},_checkInput:function(oEvent){var bNameInput=this._checkInputValue("winner_name");var bEmailInput=this._checkInputValue("winner_email");var bPhoneNumberInput=this._checkInputValue("winner_phone");var bAddressInput=this._checkInputValue("winner_addr");var bChecked=jindo.$("chk_term").checked;var bTermChecked=jindo.$("chk_term2").checked;if(bNameInput==true&&bEmailInput==true&&bPhoneNumberInput==true&&bAddressInput==true&&bChecked==true&&bTermChecked==true){this._welPopup.query("._btnSubmit").attr("disabled","")}else{this._welPopup.query("._btnSubmit").attr("disabled","disabled")}},_checkInputValue:function(sId){var sInputValue=this._getInputValue(sId);if(sInputValue==null){return true}return sInputValue!=""},_getInputValue:function(sId){var elInput=jindo.$(sId);if(elInput==null){return null}return Util.trim(jindo.$(sId).value)},_onClickChkbox:function(oEvent){if(oEvent.element.checked){jindo.$Element(oEvent.element).next().addClass("on")}else{jindo.$Element(oEvent.element).next().removeClass("on")}this._checkInput(oEvent)}});
var LayerNoticePopup=eg.Class({construct:function(options){this._setVar(options);this._setEvent()},_setVar:function(options){this._ui={notice:$("#_notice"),dim:$("#_dim")};this._noticeSeq=this._ui.notice.data("bannerSeq");this._muteDays=Number(this._ui.notice.data("muteDays"));this._doNotShowCookieName="noticeDoNotShow"+this._noticeSeq},_setEvent:function(){this._ui.notice.on("click",".lk_close",$.proxy(this._closeNotice,this)).on("click","._closeNotice",$.proxy(this._closeNotice,this)).on("click","._noticeNotAgain",$.proxy(this._checkMuteClose,this))},checkNotice:function(){if(this._isExistsNotice()===false){return}var noticeDoNotShow=Cookies.get(this._doNotShowCookieName);if(!noticeDoNotShow){this._showNotice()}},_showNotice:function(){this._ui.dim.addClass("on");this._ui.notice.addClass("on");var isNoticeScrollNeeded=(this._ui.notice.find("div").outerHeight()>($(document.body).outerHeight()*0.8));if(isNoticeScrollNeeded){this._ui.notice.removeClass("fixed")}},_closeNotice:function(){if(this._isExistsNotice()===false){return}var noticeNotAgainCheckbox=this._ui.notice.find("._noticeNotAgain");if(noticeNotAgainCheckbox.length>0&&noticeNotAgainCheckbox.prop("checked")){Cookies.set(this._doNotShowCookieName,"true",{expires:this._muteDays,domain:"webtoons.com"})}else{Cookies.set(this._doNotShowCookieName,"true",{domain:"webtoons.com"})}this._ui.notice.hide().remove();this._ui.dim.removeClass("on");return false},_checkMuteClose:function(e){var checkbox=this._ui.notice.find(".ico_chkbox");if(checkbox.length){if($(e.currentTarget).prop("checked")){checkbox.addClass("on")}else{checkbox.removeClass("on")}}},_isExistsNotice:function(){return(this._ui.notice.length>0)}});
